import { convertFormToJson } from '$lib';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: async ({ request, fetch }) => {
    const data = await request.formData()

    const form = convertFormToJson(data);

    if (!form.name) {
      return fail(400, { missingName : true})
    }

    if (!form.email) {
      return fail(400, { missingEmail : true})
    }

    if (!form.password) {
      return fail(400, { missingPassword : true})
    }

    const user = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "content-type": "application/json",
      },
    })

    return { user: await user.json() }
	}
} satisfies Actions;