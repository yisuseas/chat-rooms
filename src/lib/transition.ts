/* eslint-disable @typescript-eslint/no-unused-vars */
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

const config = {
	delay: 0,
	duration: 450,
	easing: cubicOut
};

function screenLg() {
	return window.matchMedia('(min-width: 936px)').matches;
}

export function home(_node: Element): TransitionConfig {
	return {
		...config,
		css: (t, u) =>
			screenLg()
				? `
		 		transform-origin: center right;
				transform: translate(${25 * u}%, ${-25 * u}%) scale(${0.1 + 0.9 * t});
				opacity: ${t};
			`
				: `
				transform: translateX(${-100 * u}%);
			`
	};
}

export function room(_node: Element): TransitionConfig {
	return {
		...config,
		css: (t, u) =>
			screenLg()
				? `
		 		transform-origin: center left;
				transform: translate(0%, ${-25 * u}%) scale(${0.1 + 0.9 * t});
				opacity: ${t};
			`
				: `
				transform: translateX(${100 * u}%);
			`
	};
}
