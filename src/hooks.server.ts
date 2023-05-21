import { USER_ID } from '$lib/constants';
import prisma from '$lib/prisma.server';
import type { Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
	const userIdCookie = event.cookies.get(USER_ID);

	if (!userIdCookie) {
		event.locals.user = null;
		return await resolve(event);
	}

	event.locals.user = await prisma.user.findUnique({
		where: { id: userIdCookie }
	});

	return await resolve(event);
}) satisfies Handle;
