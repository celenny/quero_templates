import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
  const res = await fetch(`/api/users/${params.page}`, {
    method: 'GET'
  })

  const {users, totalPages} = await res.json();
  return { users, totalPages };
}) satisfies PageLoad;