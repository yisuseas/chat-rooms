import { USER_ID } from '$lib/constants';
import prisma from '$lib/prisma.server';
import type { User } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = ((event) => {
	return {
		user: event.locals.user
	};
}) satisfies PageServerLoad;

export const actions = {
	setInfo: async ({ request, locals, cookies }) => {
		const data = await request.formData();

		const name = data.get('name');
		if (!name || typeof name !== 'string') {
			return fail(400, { missing: 'name' });
		}
		if (name.length < 3 || name.length > 25) {
			return fail(400, { invalid: 'name' });
		}

		const formHue = data.get('hue');
		if (!formHue || typeof formHue !== 'string') {
			return fail(400, { missing: 'hue' });
		}
		const hue = parseInt(formHue);
		if (!isFinite(hue) || hue < 0 || hue > 255) {
			return fail(400, { invalid: 'hue' });
		}

		let user: User;
		if (locals.user) {
			user = await prisma.user.update({
				where: { id: locals.user.id },
				data: { name, hue }
			});
		} else {
			user = await prisma.user.create({
				data: { name, hue }
			});
		}

		cookies.set(USER_ID, user.id, { path: '/' });
		locals.user = user;

		return { success: true };
	},
	delete: async ({ locals, cookies }) => {
		if (locals.user) {
			const owned = await prisma.owner.findMany({
				where: { userId: locals.user.id }
			});
			// Delete all owned rooms and the user
			await Promise.all([
				prisma.room.deleteMany({
					where: { id: { in: owned.map((own) => own.roomId) } }
				}),
				prisma.user.delete({
					where: { id: locals.user.id }
				})
			]);
		}

		cookies.delete(USER_ID, { path: '/' });
		locals.user = null;

		return { success: true };
	}
} satisfies Actions;
