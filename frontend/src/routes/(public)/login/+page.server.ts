import { convertFormToJson } from '$lib';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
  default: async ({ request, fetch }) => {
    const data = await request.formData()

    const form = convertFormToJson(data);

    if (!form.email) {
      return fail(400, { missingEmail : true})
    }

    if (!form.password) {
      return fail(400, { missingPassword : true})
    }

    const user = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "content-type": "application/json",
      },
    })

    if (user.status === 404) {
      return fail(user.status, {userNotFound: true})
    } 

    if (user.status === 401) {
      return fail(user.status, {passwordIncorrect: true})
    }

    return { user: await user.json() }
  }
} satisfies Actions;