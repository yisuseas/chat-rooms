import prisma from '$lib/prisma.server';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = ((event) => {
	return {
		user: event.locals.user
	};
}) satisfies PageServerLoad;

export const actions = {
	create: async ({ locals }) => {
		if (!locals.user) {
			throw redirect(307, '/profile');
		}
		const room = await prisma.room.create({ data: {} });
		if (!room) {
			console.error("Couldn't make room");
			return error(500, 'Something went wrong, please try again.');
		}
		const owner = await prisma.owner.create({
			data: { userId: locals.user.id, roomId: room.id }
		});
		if (!owner) {
			console.error("Couldn't make owner");
			return error(500, 'Something went wrong, please try again.');
		}

		throw redirect(303, '/' + room.id);
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
