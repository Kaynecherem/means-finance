import { AuthenticationClient, DirectusClient, RestClient } from '@directus/sdk';
import { Schema } from './schema';
export type DirectusContextClient = DirectusClient<Schema> & AuthenticationClient<Schema> & RestClient<Schema>
export type DirectusError = {
    errors: [
        {
            extensions: {
                code: string
            },
            message: string
            code?: string
        },
    ],
}
