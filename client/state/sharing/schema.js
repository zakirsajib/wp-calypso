import {
	connectionsSchema,
	connectionsBySiteIdSchema
} from './publicize/schema';

export const publicizeSchema = {
	type: 'object',
	required: [ 'connections', 'connectionsBySiteId' ],
	properties: {
		connections: connectionsSchema,
		connectionsBySiteId: connectionsBySiteIdSchema
	}
};

