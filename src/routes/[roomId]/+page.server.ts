import prisma from '$lib/prisma.server';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ params: { roomId }, locals }) => {
	if (!locals.user) {
		throw redirect(307, '/');
	}

	const room = await prisma.room.findUnique({
		where: { id: roomId },
		include: {
			owner: { include: { user: true } },
			members: { include: { user: true } },
			messages: { include: { user: true } }
		}
	});

	if (!room) {
		throw error(404, 'Room not found');
	}
	if (!room.owner) {
		throw error(500, 'Abandoned room');
	}

	let addedUser = false;
	const userId = locals.user.id;
	if (room.members.findIndex((mem) => mem.userId === userId) < 0) {
		await prisma.member.create({ data: { roomId, userId } });
		addedUser = true;
	}

	return {
		roomId: room.id,
		owner: room.owner.user,
		members: room.members
			.map((mem) => mem.user)
			.concat(addedUser ? [locals.user] : []),
		messages: room.messages
	};
}) satisfies PageServerLoad;

export const actions = {
	send: async ({ request, locals, params }) => {
		if (!locals.user) {
			throw redirect(307, '/');
		}

		const data = await request.formData();
		const message = data.get('message');
		if (!message || typeof message !== 'string') {
			return fail(400, { missing: 'message' });
		}
		if (!locals.user) {
			return fail(403, { missing: 'user' });
		}

		const newMessage = await prisma.message.create({
			data: {
				userId: locals.user.id,
				roomId: params.roomId,
				content: message
			}
		});

		return { newMessage };
	}
} satisfies Actions;
