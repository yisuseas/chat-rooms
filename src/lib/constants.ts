import { PUBLIC_PUSHER_CLUSTER, PUBLIC_PUSHER_KEY } from '$env/static/public';
import Pusher from 'pusher-js';

export const USER_ID = 'user-id';

export const REDIRECTED = 'bounced-from';

export const clientPusher = new Pusher(PUBLIC_PUSHER_KEY, {
	cluster: PUBLIC_PUSHER_CLUSTER
});

export const NEW_MEMBER = 'new-member';

export const NEW_MESSAGE = 'new-message';
