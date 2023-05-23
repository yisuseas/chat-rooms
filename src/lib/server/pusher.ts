import {
	PRIVATE_PUSHER_APP_ID,
	PRIVATE_PUSHER_SECRET
} from '$env/static/private';
import { PUBLIC_PUSHER_CLUSTER, PUBLIC_PUSHER_KEY } from '$env/static/public';
import Pusher from 'pusher';

export const pusher = new Pusher({
	appId: PRIVATE_PUSHER_APP_ID,
	key: PUBLIC_PUSHER_KEY,
	secret: PRIVATE_PUSHER_SECRET,
	cluster: PUBLIC_PUSHER_CLUSTER,
	useTLS: true
});
