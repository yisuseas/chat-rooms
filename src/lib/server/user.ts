import { USER_ID } from '$lib/constants';
import type { User } from '@prisma/client';
import type { Cookies } from '@sveltejs/kit';
import prisma from './prisma';

interface Params {
	data: FormData;
	locals: App.Locals;
	cookies: Cookies;
}

type UserResponse =
	| {
			user: User;
			error: null;
	  }
	| {
			user: null;
			error: {
				missing?: string;
				invalid?: string;
			};
	  };

export async function getUser({
	data,
	locals,
	cookies
}: Params): Promise<UserResponse> {
	const name = data.get('name');
	if (!name || typeof name !== 'string') {
		return { user: null, error: { missing: 'name' } };
	}
	if (name.length < 3 || name.length > 25) {
		return { user: null, error: { invalid: 'name' } };
	}

	const formHue = data.get('hue');
	if (!formHue || typeof formHue !== 'string') {
		return { user: null, error: { missing: 'hue' } };
	}
	const hue = parseInt(formHue);
	if (!isFinite(hue) || hue < 0 || hue > 360) {
		return { user: null, error: { invalid: 'hue' } };
	}

	let user: User;
	if (locals.user) {
		// Update user if needed, use the one in `locals` if not.
		if (locals.user.name !== name || locals.user.hue !== hue) {
			user = await prisma.user.update({
				where: { id: locals.user.id },
				data: { name, hue }
			});
		} else {
			user = locals.user;
		}
	} else {
		user = await prisma.user.create({
			data: { name, hue }
		});
	}

	cookies.set(USER_ID, user.id, { path: '/' });
	locals.user = user;

	return {
		user,
		error: null
	};
}
