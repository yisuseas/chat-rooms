import { NEW_MESSAGE, REDIRECTED } from '$lib/constants';
import prisma from '$lib/server/prisma';
import { pusher } from '$lib/server/pusher';
import type { NewMessagePayload } from '$lib/types';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ params: { roomId }, locals }) => {
	if (!locals.user) {
		throw redirect(307, `/?${REDIRECTED}=${roomId}`);
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

	return {
		user: locals.user,
		room: {
			id: room.id,
			title: room.title,
			owner: room.owner.user,
			members: room.members.map((mem) => mem.user),
			messages: room.messages
		}
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

		const newMessage = await prisma.message.create({
			data: {
				userId: locals.user.id,
				roomId: params.roomId,
				content: message
			}
		});

		const payload = {
			...newMessage,
			user: locals.user
		} satisfies NewMessagePayload;
		pusher.trigger(newMessage.roomId, NEW_MESSAGE, payload);

		return { success: true };
	}
} satisfies Actions;
