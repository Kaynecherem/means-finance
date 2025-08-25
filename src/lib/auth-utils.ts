import { DirectusContextClient } from '../utils/types/directus';

export async function ensureAuthenticated(client: DirectusContextClient) {
  try {
    if (client.getToken()) {
      await client.refresh();
      return;
    }
    throw new Error('No active auth token on client');
  } catch {
    throw new Error('User session expired or missing. Please re-authenticate.');
  }
}
