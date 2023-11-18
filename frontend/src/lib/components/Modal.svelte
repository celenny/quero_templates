<script lang="ts">
  export let showModal: boolean;

  let dialog: HTMLDialogElement;

  $: if (dialog && showModal) dialog.showModal();
</script>

<dialog
  class="bg-white dark:bg-slate-800 backdrop:bg-slate-900/60 max-w-lg rounded-md border border-none p-0 m-auto"
  bind:this={dialog}
  on:close={() => (showModal = false)}
>
  <div class="p-4">
    <slot name="header" />
    <slot name="body"/>
    <div class="flex justify-end mt-6 gap-4">
      <button
        on:click={() => dialog.close()}
        class="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
      >
        Cancelar
      </button>
      <slot name="button"/>
    </div>
  </div>
</dialog>

<style>
  dialog[open] {
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes zoom {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }
  dialog[open]::backdrop {
    animation: fade 0.2s ease-out;
  }
  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
