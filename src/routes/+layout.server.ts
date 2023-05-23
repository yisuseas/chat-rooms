import prisma from '$lib/server/prisma';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	let userRooms: string[] = [];
	if (locals.user) {
		const members = await prisma.member.findMany({
			where: { userId: locals.user.id }
		});
		userRooms = members.map((mem) => mem.roomId);
	}

	return {
		user: locals.user,
		userRooms
	};
}) satisfies LayoutServerLoad;
