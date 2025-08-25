import { createDirectus, rest, authentication, AuthenticationData } from '@directus/sdk';
import { DirectusContextClient } from '../utils/types/directus';
import { Schema } from '../utils/types/schema';

const API_URL = process.env.REACT_APP_DIRECTUS_URL || 'https://meansfinance.directus.app/';

export const directusClient: DirectusContextClient = createDirectus<Schema>(API_URL)
  .with(
    authentication('json', {
      autoRefresh: true,
      storage: {
        get: () => {
          const data = localStorage.getItem('authenticationData');
          return data ? JSON.parse(data) : null;
        },
        set: (value: AuthenticationData | null) => {
          localStorage.setItem('authenticationData', JSON.stringify(value));
        },
      },
    })
  )
  .with(rest());

export async function restoreSession() {
  try {
    await directusClient.refresh();
  } catch (e) {
    console.warn('No session to restore or refresh failed:', e);
  }
}
