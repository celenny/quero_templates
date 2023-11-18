import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
  const res = await fetch(`/api/files/${params.page}`, {
    method: "GET"
  })

  const chartData = await fetch("/api/templates/graphics", {
    method: "GET"
  })

  const { response, totalPages } = await res.json()

  return { files: response, totalPages, chartData: await chartData.json() };
}) satisfies PageLoad;