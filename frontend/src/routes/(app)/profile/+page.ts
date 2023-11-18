import { browser } from '$app/environment';
import type { PageLoad } from './$types';

export const load = (async () => {
  if (browser) {
    const user = JSON.parse(localStorage.getItem('user') ?? '');

    return { user }
  }
}) satisfies PageLoad;