<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { setContext } from "svelte";
  import HomeForm from "$lib/components/HomeForm.svelte";

  export let form;

  $: if (form?.user) {
    localStorage.setItem("user", JSON.stringify(form.user));
    setContext('user', form.user);
    goto("/");
  }
</script>

<HomeForm>
  <form method="POST" use:enhance={() => {
    return async ({ update }) => {
      update({ reset: false });
    };
  }}>
    <div class="mt-4">
      <label
        class="block mb-2 text-sm font-medium text-black"
        for="email">Email</label
      >
      <input
        id="email"
        name="email"
        class="block w-full px-4 py-2 text-gray-700 bg-white border rounded-l {form?.userNotFound || form?.missingEmail ? "border-red-600" : ''} focus:border-blue-400 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
        type="email"
      />
      {#if form?.userNotFound}<p class="text-red-600">Este email não está cadastrado</p>{/if}
      {#if form?.missingEmail}<p class="text-red-600">O campo de email está vazio</p>{/if}
    </div>
  
    <div class="mt-4">
      <div class="flex justify-between">
        <label
          class="block mb-2 text-sm font-medium text-black"
          for="password">Senha</label
        >
      </div>
  
      <input
        id="password"
        name="password"
        class="block w-full px-4 py-2 text-gray-700 bg-white border rounded-l {form?.passwordIncorrect || form?.missingPassword ? "border-red-600" : ''} focus:border-blue-400 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
        type="password"
      />
      {#if form?.passwordIncorrect}<p class="text-red-600">A senha está incorreta</p>{/if}
      {#if form?.missingPassword}<p class="text-red-600">O campo de senha está vazio</p>{/if}
    </div>
  
    <div class="mt-6">
      <button
        type="submit"
        class="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-[#04AC5C] rounded-lg hover:bg-[#01783B] focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
      >
        Login
      </button>
    </div>
  
    <div class="flex items-center justify-between mt-4">
      <span class="w-1/5 border-b md:w-1/4" />
  
      <a
        href="/register"
        class="text-xs text-gray-500 uppercase hover:underline"
        >ou crie sua conta</a
      >
  
      <span class="w-1/5 border-b md:w-1/4" />
    </div>
  </form>
</HomeForm>
