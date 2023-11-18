import { convertFormToJson } from '$lib';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load = (async ({ fetch, params }) => {
  const res = await fetch(`/api/templates/${params.page}`, {
    method: "GET"
  })

  const { templates, totalPages } = await res.json();

  return { templates, totalPages };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, fetch }) => {
    const data = await request.formData();

    const form = convertFormToJson(data);

    if (!form.name) {
      return fail(400, {name: form.name, missing : true})
    }

    await fetch("/api/templates", {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "content-type": "application/json",
      },
    })

    return { ok: true };
	}
} satisfies Actions;