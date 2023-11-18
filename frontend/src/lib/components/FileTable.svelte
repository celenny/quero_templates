<script lang="ts">
  import { page } from "$app/stores";

  export let title: string;
  export let totalPages = 1;

  const regex = new RegExp("\/.+\/")

  const route = $page.url.pathname.match(regex)![0]
  // let prevPageNumber = Number($page.url.pathname.split("/")[2]) - 1;
  // let nextPageNumber = Number($page.url.pathname.split("/")[2]) + 1;
</script>

<div class="w-full h-screen pt-9 dark:bg-gray-800 overflow-scroll">
  <section class="container px-4 mx-auto">
    <div class="sm:flex sm:items-center sm:justify-between">
      <h2 class="text-lg font-medium text-gray-800 dark:text-white">
        {title}
      </h2>
      <slot name="button"/>
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
              <slot name="header"/>

              <slot name="body"/>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between mt-6">
      <!-- <a
        href="{prevPageNumber.toString()}"
        class="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5 rtl:-scale-x-100"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
          />
        </svg>

        <span> previous </span>
      </a> -->

      <div class="items-center hidden md:flex gap-x-3">
        {#each { length: totalPages } as _, i}
          <a
            href="{route}{i+1}"
            class="px-2 py-1 text-sm text-green-500 rounded-md dark:hover:bg-gray-600 dark:text-green-300 hover:bg-gray-100"
          >{i+1}
          </a>
        {/each}
      </div>

      <!-- <a
        href={nextPageNumber.toString()}
        class="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
      >
        <span> Next </span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5 rtl:-scale-x-100"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
          />
        </svg>
      </a> -->
    </div>
  </section>
  <slot name="footer"/>
</div>
