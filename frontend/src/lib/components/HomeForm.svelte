<script lang="ts">
  import icon from "$lib/assets/icon-pessoa.svg";
  import logo from "$lib/assets/logo.png";
  import "../../app.css";
</script>

<svelte:head>
  <title>QueroTemplates</title>
</svelte:head>

<div class="flex flex-col justify-center items-center bg-[#04AC5C] h-screen">
  <div
    class="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg lg:max-w-4xl"
  >
    <div class="bg-white lg:block lg:w-1/2">
      <img src={icon} alt="" class="h-full" />
    </div>

    <div class="w-full px-6 py-8 md:px-8 lg:w-1/2">
      <div class="flex justify-center mx-auto">
        <img class="w-20 h-20 sm:h-20" src={logo} alt="" />
      </div>

      <p class="mt-3 text-xl text-center text-black font-semibold">
        QueroTemplates
      </p>

      <slot/>
    </div>
  </div>
</div>
