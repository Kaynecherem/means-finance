import { DirectusContextClient } from '../utils/types/directus';

// Ensure the Directus client has a valid auth token. If a token exists
// attempt to refresh it, otherwise signal that the session is missing.
export async function ensureAuthenticated(client: DirectusContextClient) {
  try {
    const token = await client.getToken();
    if (token) {
      await client.refresh();
      return;
    }
    throw new Error('No active auth token on client');
  } catch {
    throw new Error('User session expired or missing. Please re-authenticate.');
  }
}
