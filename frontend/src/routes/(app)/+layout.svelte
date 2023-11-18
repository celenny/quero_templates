<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { Toaster } from "svelte-french-toast";
  import "../../app.css";
  import logo from "$lib/assets/logo.png";
  import profile from "$lib/assets/profile-pic.png"
  import type { User } from "$lib/models/User";

  let user: User;
  if (browser) {
    user = JSON.parse(localStorage.getItem("user") ?? "");
  }

  function logout() {
    localStorage.removeItem("user");
    goto("/");
  }
</script>

<Toaster containerStyle="z-index: 2147483600 !important" />
<div class="flex flex-row">
  <aside
    class="flex flex-col w-64 h-screen px-5 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700"
  >
    <a href="/" class="flex-row flex justify-center items-center">
      <img class="w-12 h-12 mr-2" src={logo} alt="logo Lojas QQ" />
      <h2 class="text-center text-black font-semibold dark:text-white">
        QueroTemplates
      </h2>
    </a>

    <div class="flex flex-col justify-between flex-1 mt-6">
      <nav class="flex-1 -mx-3 space-y-3">
        <a
          href="/templates"
          class="flex items-center px-3 py-2 text-gray-800 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
            />
          </svg>

          <span class="mx-2 text-sm font-medium">
            {user?.role === "ADMIN"
              ? "Gerenciar Templates"
              : "Templates"}
          </span>
        </a>

        {#if user?.role === "ADMIN"}
          <a
            href="/files"
            class="flex items-center px-3 py-2 text-gray-800 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>

            <span class="mx-2 text-sm font-medium">Arquivos Enviados</span>
          </a>

          <a
            href="/users"
            class="flex items-center px-3 py-2 text-gray-800 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>

            <span class="mx-2 text-sm font-medium">Gerenciar Usuários</span>
          </a>
        {/if}
      </nav>

      <div class="mt-6">
        <div class="flex items-center justify-between mt-6">
          <a href="/profile" class="flex items-center gap-x-2">
            <img
              class="object-cover rounded-full h-7 w-7"
              src={user?.imgPath ?? profile}
              alt="avatar"
            />
            <span class="text-sm font-medium text-gray-800 dark:text-gray-200"
              >{user?.name}</span
            >
          </a>

          <button
            on:click={logout}
            class="text-gray-800 transition-colors duration-200 rotate-180 dark:text-gray-400 rtl:rotate-0 hover:text-green-500 dark:hover:text-green-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </aside>
  <slot />
</div>
