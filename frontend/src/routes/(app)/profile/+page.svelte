<script lang="ts">
  import { browser } from "$app/environment";
  import profile from "$lib/assets/profile-pic.png";
  import toast from "svelte-french-toast";
  import type { User } from "$lib/models/User";
  import type { PageData } from "./$types";

  export let data: PageData;

  let user: User;

  if (browser) {
    user = JSON.parse(localStorage.getItem("user") ?? "");
  }

  function submitFile(
    event: Event & { currentTarget: EventTarget & HTMLInputElement }
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const form = new FormData();
        const file = event.currentTarget.files![0];
        form.append("imgPath", file);
        await fetch(`/api/users/${user.id}`, {
          method: "PATCH",
          body: form,
        });

        const reader = new FileReader();
        reader.onload = (e) => {
          // @ts-ignore
          user.imgPath = `data:image/png;base64,${e.target.result.split(",")[1]}`;
          localStorage.setItem("user", JSON.stringify(user));
          resolve();
        };

        reader.readAsDataURL(file);
      } catch (error) {
        reject(error);
      }
    });
  }
</script>

<div class="flex h-screen w-full justify-center dark:bg-gray-800">
  <div class="w-96 px-6 py-6">
    <label
      class="flex flex-col items-center p-8 transition-colors duration-300 transform border cursor-pointer rounded-xl hover:border-transparent group hover:bg-green-600 dark:border-gray-700 dark:hover:border-transparent"
    >
      <img
        class="object-cover w-32 h-32 rounded-full ring-4 ring-gray-100"
        src={user?.imgPath ?? profile}
        alt="Profile pic"
      />

      <h1
        class="mt-4 text-2xl font-semibold text-gray-700 capitalize dark:text-white group-hover:text-white"
      >
        {data.user?.name}
      </h1>

      <input
        id="dropzone-file"
        type="file"
        class="hidden"
        accept="image/jpeg, image/png"
        on:change={(e) => {
          toast.promise(submitFile(e), {
            loading: "Enviando imagem...",
            success: "Imagem atualizada",
            error: "Não foi possível atualizar a imagem"
          })
        }}
      />

      <table class="text-base my-3">
        <tbody class="group-hover:text-white">
          <tr>
            <td
              class="px-2 py-2 text-gray-500 font-semibold dark:text-white group-hover:text-white"
              >Permissão</td
            >
            <td class="px-1 py-2 dark:text-white group-hover:text-white"
              >{data.user?.role === "ADMIN" ? "Administrador" : "Usuário"}</td
            >
          </tr>
          <tr>
            <td
              class="px-2 py-2 text-gray-500 font-semibold dark:text-white group-hover:text-white"
              >Email</td
            >
            <td class="px-1 py-2 dark:text-white">{data.user?.email}</td>
          </tr>
        </tbody>
      </table>
    </label>
  </div>
</div>
