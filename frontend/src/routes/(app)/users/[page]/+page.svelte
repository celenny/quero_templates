<script lang="ts">
  import profile from "$lib/assets/profile-pic.png";
  import type { PageData } from "../$types";

  export let data: PageData;

  async function handleRole(
    event: Event & { currentTarget: EventTarget & HTMLSelectElement },
    userId: number
  ) {
    await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ role: event.currentTarget.value }),
      headers: {
        "content-type": "application/json",
      },
    });
  }
</script>

<section class="w-screen px-4 mx-auto pt-9 dark:bg-gray-800 overflow-scroll">
  <div class="flex items-center gap-x-3">
    <h2 class="text-lg font-medium text-gray-800 dark:text-white">
      Usuários Cadastrados
    </h2>
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
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  scope="col"
                  class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-800 dark:text-gray-400"
                >
                  <div class="flex items-center gap-x-3">
                    <span>Nome</span>
                  </div>
                </th>

                <th
                  scope="col"
                  class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-800 dark:text-gray-400"
                >
                  <button class="flex items-center gap-x-2">
                    <span>Permissão</span>
                  </button>
                </th>

                <th
                  scope="col"
                  class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-800 dark:text-gray-400"
                  >Email</th
                >
              </tr>
            </thead>
            <tbody
              class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900"
            >
              {#each data.users as user}
                <tr>
                  <td
                    class="px-4 py-4 text-sm font-medium text-gray-800 whitespace-nowrap"
                  >
                    <div class="inline-flex items-center gap-x-3">
                      <div class="flex items-center gap-x-2">
                        <img
                          class="object-cover w-10 h-10 rounded-full"
                          src={user.imgPath ?? profile}
                          alt=""
                        />
                        <div>
                          <h2 class="font-medium text-gray-800 dark:text-white">
                            {user.name}
                          </h2>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td class="px-4 py-4 text-sm whitespace-nowrap">
                    <select
                      name="status"
                      id="status"
                      bind:value={user.role}
                      on:change={(event) => handleRole(event, user.id)}
                      class="flex items-center px-2 py-2 text-sm text-gray-800 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                      <option value="ADMIN">Administrador</option>
                      <option value="USER">Usuário</option>
                    </select>
                  </td>
                  <td
                    class="px-4 py-4 text-sm text-gray-800 dark:text-gray-300 whitespace-nowrap"
                    >{user.email}</td
                  >
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <div class="flex items-center justify-between mt-6">

    <div class="items-center hidden lg:flex gap-x-3">
      {#each { length: data.totalPages } as _, i}
          <a
            href="/users/{i+1}"
            class="px-2 py-1 text-sm text-green-500 rounded-md dark:hover:bg-gray-600 dark:text-green-300 hover:bg-gray-100"
          >{i+1}
          </a>
        {/each}
    </div>
  </div>
</section>
