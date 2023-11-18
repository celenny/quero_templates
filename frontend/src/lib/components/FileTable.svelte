<script lang="ts">
  import { page } from "$app/stores";

  export let title: string;
  export let totalPages = 1;

  const regex = new RegExp("/.+/");

  const route = $page.url.pathname.match(regex)![0];
</script>

<div class="w-full h-screen pt-9 dark:bg-gray-800 overflow-scroll">
  <section class="container px-4 mx-auto">
    <div class="sm:flex sm:items-center sm:justify-between">
      <h2 class="text-lg font-medium text-gray-800 dark:text-white">
        {title}
      </h2>
      <slot name="button" />
    </div>

    <div class="flex flex-col mt-6">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div
            class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg"
          >
            <table
              class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
            >
              <slot name="header" />

              <slot name="body" />
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between mt-6">
      <div class="items-center hidden md:flex gap-x-3">
        {#each { length: totalPages } as _, i}
          <a
            href="{route}{i + 1}"
            class="px-2 py-1 text-sm text-green-500 rounded-md dark:hover:bg-gray-600 dark:text-green-300 hover:bg-gray-100"
            >{i + 1}
          </a>
        {/each}
      </div>
    </div>
  </section>
  <slot name="footer" />
</div>
