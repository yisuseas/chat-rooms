import prisma from '$lib/prisma.server';
import { getUser } from '$lib/user.server';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = ((event) => {
	return {
		user: event.locals.user
	};
}) satisfies PageServerLoad;

export const actions = {
	create: async ({ request, locals, cookies }) => {
		const data = await request.formData();

		const [userRes, room] = await Promise.all([
			getUser({ data, locals, cookies }),
			prisma.room.create({ data: {} })
		]);
		const { user, error } = userRes;
		if (error) {
			return fail(400, error);
		}

		await prisma.owner.create({
			data: { userId: user.id, roomId: room.id }
		});

		throw redirect(303, '/' + room.id);
	},
	join: async ({ request, locals, cookies }) => {
		const data = await request.formData();

		const { error } = await getUser({ data, locals, cookies });
		if (error) {
			return fail(400, error);
		}

		const roomId = data.get('room-id');
		if (!roomId || typeof roomId !== 'string') {
			return fail(400, { missing: 'room-id' });
		}

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
