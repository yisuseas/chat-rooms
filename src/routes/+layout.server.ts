import prisma from '$lib/server/prisma';
import type { Room } from '@prisma/client';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	let userRooms: Room[] = [];
	if (locals.user) {
		const members = await prisma.member.findMany({
			where: { userId: locals.user.id },
			include: { room: true }
		});
		userRooms = members.map((mem) => mem.room);
	}

	return {
		user: locals.user,
		userRooms
	};
}) satisfies LayoutServerLoad;
