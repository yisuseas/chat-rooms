import type { Message, User } from '@prisma/client';

// The idea behind this file is to force the server and the client to synchronize their channel event types

export type NewMemberPayload = User;

export type NewMessagePayload = Message & {
	user: User;
};
