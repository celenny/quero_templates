import { browser } from '$app/environment';
import type { PageLoad } from './$types';
import type { User } from '$lib/models/User';

export const load = (async ({ fetch }) => {
  if (browser) {
    let user = localStorage.getItem("user");

    if (!user) {
      return {
        user,
        redirect: '/login'
      }
    } else if (user) {
      try {
        const userObj: User = JSON.parse(user)

        const response = await fetch(`/api/users/${userObj.id}/profile`, {
          method: "GET"
        })

        user = JSON.stringify(await response.json())

        return {
          user,
          redirect: '/templates'
        }
      } catch {
        return {
          user,
          redirect: '/login'
        }
      }

    }
  }
}) satisfies PageLoad;
