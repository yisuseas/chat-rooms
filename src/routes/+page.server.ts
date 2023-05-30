import { NEW_MEMBER, REDIRECTED } from '$lib/constants';
import prisma from '$lib/server/prisma';
import { pusher } from '$lib/server/pusher';
import { getUser } from '$lib/server/user';
import type { NewMemberPayload } from '$lib/types';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (({ locals, url }) => {
	return {
		user: locals.user,
		target: url.searchParams.get(REDIRECTED)
	};
}) satisfies PageServerLoad;

export const actions = {
	setProfile: async ({ request, locals, cookies }) => {
		const data = await request.formData();
		const { user, error } = await getUser({ data, locals, cookies });
		if (error) {
			return fail(400, error);
		}

		return { user };
	},
	create: async ({ request, locals, cookies }) => {
		const data = await request.formData();

		const title = data.get('room-title');
		if (!title || typeof title !== 'string') {
			return fail(400, { missing: 'room-title' });
		}

		const [userRes, room] = await Promise.all([
			getUser({ data, locals, cookies }),
			prisma.room.create({ data: { title } })
		]);
		const { user, error } = userRes;
		if (error) {
			return fail(400, error);
		}

		const relation = {
			userId: user.id,
			roomId: room.id
		};
		await Promise.all([
			prisma.owner.create({ data: relation }),
			prisma.member.create({ data: relation })
		]);

		throw redirect(303, '/' + room.id);
	},
	join: async ({ request, locals, cookies }) => {
		const data = await request.formData();

		const { user, error } = await getUser({ data, locals, cookies });
		if (error) {
			return fail(400, error);
		}

		const roomId = data.get('room-id');
		if (!roomId || typeof roomId !== 'string') {
			return fail(400, { missing: 'room-id' });
		}

		const [room, member] = await Promise.all([
			prisma.room.findUnique({
				where: { id: roomId }
			}),
			prisma.member.create({
				data: { roomId, userId: user.id },
				include: { user: true }
			})
		]);

		if (!room || !member) {
			return fail(400, { invalid: 'room-id' });
		}

		const payload = member.user satisfies NewMemberPayload;
		pusher.trigger(room.id, NEW_MEMBER, payload);

		throw redirect(303, '/' + roomId);
	},
	nuke: async () => {
		const [users, rooms] = await Promise.all([
			prisma.user.deleteMany({}),
			prisma.room.deleteMany({})
		]);
		console.log('Deleted: ');
		console.table({
			users: users.count,
			rooms: rooms.count
		});
	}
} satisfies Actions;
