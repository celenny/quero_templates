<script lang="ts">
  import FileTable from "$lib/components/FileTable.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import { enhance } from "$app/forms";
  import { browser } from "$app/environment";
  import toast from "svelte-french-toast";
  import type { PageServerData } from "./$types";
  import type { User } from "$lib/models/User";
  import downloadFile from "$lib/utils/dowloadFile";

  export let data: PageServerData;
  export let form;

  let showCreateTemplateModal = false;
  let showUploadFileModal = false;
  let fieldQtd = 1;
  let userId: number;
  let userRole: string;
  let selectedTemplateId: number;
  let selectedDirectory = "qqtech";
  let fileUploadModalText = "Clique ou arraste e solte seu arquivo";
  let uploadedFile: File | null = null;
  let isHover: boolean;

  if (browser) {
    const user: User = JSON.parse(localStorage.getItem("user") ?? "");
    userId = user.id;
    userRole = user.role;
  }

  $: if (form?.ok) {
    toast.success("Template salvo");
  }

  function handleFile(
    event: Event & { currentTarget: EventTarget & HTMLInputElement }
  ) {
    if (event.currentTarget.files) {
      uploadedFile = event.currentTarget.files[0];
      fileUploadModalText = `Arquivo ${uploadedFile.name} pronto para validação`;
      isHover = false;
    }
  }

  function handleDrop(
    event: DragEvent & { currentTarget: EventTarget & HTMLLabelElement }
  ) {
    if (event.dataTransfer) {
      uploadedFile = event.dataTransfer.files[0];
      fileUploadModalText = `Arquivo ${uploadedFile.name} pronto para validação`;
      isHover = false;
    }
  }

  function submitFile(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const form = new FormData();
        if (!uploadedFile) {
          throw new Error("No file uploaded");
        }
        form.append("directory", selectedDirectory);
        form.append("templateId", selectedTemplateId.toString());
        form.append("userId", userId.toString());
        form.append("file", uploadedFile);

        const response = await fetch("/api/files", {
          method: "POST",
          body: form,
        });

        if (!response.ok) {
          const json = await response.json();
          toast.error(json.error);
          throw new Error("Failed to upload file");
        }

        uploadedFile = null;
        fileUploadModalText = "Clique ou arraste e solte seu arquivo";
        resolve("File uploaded successfully");
      } catch (error) {
        reject(error);
      }
    });
  }

  async function handleStatus(
    event: Event & { currentTarget: EventTarget & HTMLSelectElement },
    statusId: number
  ) {
    await fetch(`/api/templates/${statusId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: event.currentTarget.value }),
      headers: {
        "content-type": "application/json",
      },
    });
  }

</script>

<svelte:head>
  <title>QueroTemplates</title>
</svelte:head>

<FileTable title="Templates Cadastrados" totalPages={data.totalPages}>
  <div slot="button" class="flex items-center mt-4 gap-x-3">
    <button
      on:click={() => (showCreateTemplateModal = true)}
      class="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-green-500 rounded-lg sm:w-auto gap-x-2 hover:bg-green-600 dark:hover:bg-green-500 dark:bg-green-600"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_3098_154395)">
          <path
            d="M13.3333 13.3332L9.99997 9.9999M9.99997 9.9999L6.66663 13.3332M9.99997 9.9999V17.4999M16.9916 15.3249C17.8044 14.8818 18.4465 14.1806 18.8165 13.3321C19.1866 12.4835 19.2635 11.5359 19.0351 10.6388C18.8068 9.7417 18.2862 8.94616 17.5555 8.37778C16.8248 7.80939 15.9257 7.50052 15 7.4999H13.95C13.6977 6.52427 13.2276 5.61852 12.5749 4.85073C11.9222 4.08295 11.104 3.47311 10.1817 3.06708C9.25943 2.66104 8.25709 2.46937 7.25006 2.50647C6.24304 2.54358 5.25752 2.80849 4.36761 3.28129C3.47771 3.7541 2.70656 4.42249 2.11215 5.23622C1.51774 6.04996 1.11554 6.98785 0.935783 7.9794C0.756025 8.97095 0.803388 9.99035 1.07431 10.961C1.34523 11.9316 1.83267 12.8281 2.49997 13.5832"
            stroke="currentColor"
            stroke-width="1.67"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_3098_154395">
            <rect width="20" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>

      <span>Criar template</span>
    </button>
  </div>

  <thead slot="header" class="bg-gray-50 dark:bg-gray-800">
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
        Data de criação
      </th>

      <th
        scope="col"
        class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-800 dark:text-gray-400"
      >
        Proprietário
      </th>

      <th
        scope="col"
        class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-800 dark:text-gray-400"
      >
        Download
      </th>
      <th
        scope="col"
        class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-800 dark:text-gray-400"
      >
        Upload
      </th>
      {#if userRole === "ADMIN"}
        <th
          scope="col"
          class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-800 dark:text-gray-400"
        >
          Status
        </th>
      {/if}
    </tr>
  </thead>

  <tbody
    slot="body"
    class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900"
  >
    {#each data.templates as template}
      {#if template.status === "ACTIVE" || userRole === "ADMIN"}
        <tr>
          <td
            class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap"
          >
            <div class="inline-flex items-center gap-x-3">
              <div class="flex items-center gap-x-2">
                <div
                  class="flex items-center justify-center w-8 h-8 text-blue-500 bg-green-100 rounded-full dark:bg-gray-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5 stroke-green-600"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                </div>

                <div>
                  <h2 class="font-normal text-gray-800 dark:text-white">
                    {template.name}.{template.extension}
                  </h2>
                </div>
              </div>
            </div>
          </td>
          <td
            class="px-4 py-4 text-sm text-gray-800 dark:text-gray-300 whitespace-nowrap"
            >{new Date(template.date).toLocaleString()}</td
          >
          <td
            class="px-4 py-4 text-sm text-gray-800 dark:text-gray-300 whitespace-nowrap"
            >{template.user.name}</td
          >
          <td class="px-4 py-4 text-sm whitespace-nowrap">
            <button
              on:click={() => {
                toast.promise(
                  downloadFile(
                    template.id,
                    `${template.name}.${template.extension}`, 
                    'templates'
                  ),
                  {
                    loading: "Baixando template...",
                    success: "Template baixado",
                    error: "Não foi possível baixar o template",
                  }
                );
              }}
              class="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg dark:text-gray-300 hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-7 h-7 text-gray-800 dark:text-white dark:hover:text-gray-700"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                /></svg
              >
            </button>
          </td>
          <td class="px-4 py-4 text-sm whitespace-nowrap">
            <button
              on:click={() => {
                showUploadFileModal = true;
                selectedTemplateId = template.id;
              }}
              class="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg dark:text-gray-300 hover:bg-gray-100"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="currentColor"
                class="text-gray-800 fill-gray-700 dark:text-white dark:hover:fill-gray-700 dark:fill-white dark:hover:text-gray-700"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12 2C9.55912 2 7.4608 3.45744 6.52373 5.54534C6.44011 5.73166 6.38425 5.85598 6.34206 5.94471C6.33167 5.96657 6.32326 5.98381 6.31654 5.99729L6.29677 5.99799C6.23318 5.99989 6.14598 6 6 6C3.79086 6 2 7.79086 2 10C2 12.2091 3.79086 14 6 14H6.17157L8.17157 12H6C4.89543 12 4 11.1046 4 10C4 8.89543 4.89543 8 6 8L6.06419 8.0001H6.0642C6.27177 8.00057 6.51342 8.00111 6.71431 7.96068C6.92683 7.91791 7.17254 7.84692 7.414 7.69062C7.65546 7.53433 7.82083 7.33923 7.94687 7.16285C8.03371 7.04134 8.10219 6.90047 8.14829 6.8035C8.20111 6.69243 8.26605 6.54772 8.34352 6.37511L8.34839 6.36427C8.97472 4.96871 10.3753 4 12 4C13.6247 4 15.0253 4.96871 15.6516 6.36427L15.6565 6.37511C15.7339 6.54772 15.7989 6.69243 15.8517 6.8035C15.8978 6.90047 15.9663 7.04134 16.0531 7.16285C16.1792 7.33923 16.3445 7.53433 16.586 7.69062C16.8275 7.84692 17.0732 7.91791 17.2857 7.96068C17.4866 8.00111 17.7282 8.00057 17.9358 8.0001H17.9358L18 8C19.1046 8 20 8.89543 20 10C20 11.1046 19.1046 12 18 12H15.8284L17.8284 14H18C20.2091 14 22 12.2091 22 10C22 7.79086 20.2091 6 18 6C17.854 6 17.7668 5.99989 17.7032 5.99799L17.6835 5.99729C17.6767 5.98381 17.6683 5.96657 17.6579 5.94471C17.6158 5.85598 17.5599 5.73166 17.4763 5.54534C16.5392 3.45744 14.4409 2 12 2ZM6.29756 6.03369C6.29755 6.03369 6.29761 6.03357 6.29774 6.03336L6.29777 6.03333L6.29756 6.03369ZM17.7024 6.03369C17.7024 6.03369 17.7024 6.03358 17.7022 6.03333L17.7023 6.03336L17.7024 6.03369Z"
                />
                <path
                  d="M12 12L11.2929 11.2929L12 10.5858L12.7071 11.2929L12 12ZM13 21C13 21.5523 12.5523 22 12 22C11.4477 22 11 21.5523 11 21L13 21ZM7.29289 15.2929L11.2929 11.2929L12.7071 12.7071L8.70711 16.7071L7.29289 15.2929ZM12.7071 11.2929L16.7071 15.2929L15.2929 16.7071L11.2929 12.7071L12.7071 11.2929ZM13 12L13 21L11 21L11 12L13 12Z"
                />
              </svg>
            </button>
          </td>
          {#if userRole === "ADMIN"}
            <td class="px-4 py-4 text-sm whitespace-nowrap">
              <select
                name="status"
                id="status"
                bind:value={template.status}
                on:change={(event) => handleStatus(event, template.id)}
                class="flex items-center px-2 py-2 text-sm text-gray-800 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <option value="ACTIVE">Ativo</option>
                <option value="INACTIVE">Inativo</option>
              </select>
            </td>
          {/if}
        </tr>
      {/if}
    {/each}
    <Modal bind:showModal={showUploadFileModal}>
      <h2
        slot="header"
        class="text-lg font-semibold text-gray-700 dark:text-white"
      >
        Upload do arquivo
      </h2>
      <div slot="body">
        <label class="text-gray-700 dark:text-gray-200" for="directory">Selecione o repositório para salvar o arquivo</label>
        <select
          name="directory"
          id="directory"
          bind:value={selectedDirectory}
          class="flex items-center px-2 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <option value="qqtech">QQTech</option>
          <option value="vendas">Vendas</option>
          <option value="recursos_humanos">Recursos Humanos</option>
          <option value="marketing">Marketing</option>
          <option value="cadastros">Cadastros</option>
        </select>
        <label
          for="dropzone-file"
          on:dragover|preventDefault={() => {
            fileUploadModalText = "Solte para fazer o upload";
            isHover = true;
          }}
          on:dragexit={() => {
            fileUploadModalText = "Clique ou arraste e solte seu arquivo";
            isHover = false;
          }}
          on:drop|preventDefault={(e) => handleDrop(e)}
          class="flex flex-col items-center w-full max-w-lg p-5 mx-auto mt-2 text-center bg-white border-2 border-gray-300 border-dashed cursor-pointer dark:bg-gray-900 {isHover
            ? 'dark:border-cyan-600'
            : 'dark:border-gray-700'} transition-colors duration-500 rounded-xl"
        >
          {#if uploadedFile}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-8 h-8 text-gray-500 dark:text-gray-400"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12"
              />
            </svg>
          {:else}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-8 h-8 text-gray-500 dark:text-gray-400"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
              />
            </svg>
          {/if}

          <h2
            class="mt-1 font-medium tracking-wide text-gray-700 dark:text-gray-200"
          >
            {fileUploadModalText}
          </h2>

          <p
            class="mt-2 text-xs tracking-wide text-gray-500 dark:text-gray-400"
          >
            Formatos suportados: XLSX, XLS ou CSV.
          </p>

          <input
            id="dropzone-file"
            type="file"
            class="hidden"
            accept="text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/vnd.oasis.opendocument.text"
            on:change={(e) => handleFile(e)}
          />
        </label>
      </div>
      <button
        slot="button"
        on:click={() => {
          toast.promise(submitFile(), {
            loading: "Validando arquivo",
            success: "Arquivo validado",
            error: "Arquivo invalido",
          });
        }}
        class="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-green-500 hover:bg-green-600 dark:hover:bg-green-500 dark:bg-green-600 rounded-md focus:outline-none"
        >Validar
      </button>
    </Modal>
    <Modal bind:showModal={showCreateTemplateModal}>
      <h2
        slot="header"
        class="text-lg font-semibold text-gray-700 capitalize dark:text-white"
      >
        Cadastrar novo template
      </h2>

      <form
        slot="body"
        id="templateForm"
        method="POST"
        use:enhance={() => {
          return async ({ update }) => {
            update({ reset: false });
          };
        }}
      >
        <div>
         
          <label class="text-gray-700 dark:text-gray-200" for="name"
            >Nome do template*</label
          >
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Digite o nome do template"
            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border {form?.missing ? "border-red-600 dark:border-red-600": "border-gray-200 dark:border-gray-600"} rounded-md dark:bg-gray-800 dark:text-gray-300 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
          />
          {#if form?.missing}<p class="text-red-600">O campo de nome do template está vazio</p>{/if}
        </div>
        <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
          <div>
            <label class="text-gray-700 dark:text-gray-200" for="fieldQtd"
              >Quantidade de campos*</label
            >
            <input
              bind:value={fieldQtd}
              id="fieldQtd"
              type="number"
              name="fieldQtd"
              placeholder="Digite a quantidade de campos"
              min="1"
              class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
            />
          </div>

          <div>
            <label class="text-gray-700 dark:text-gray-200" for="extension"
              >Tipo do arquivo*</label
            >
            <select
              name="extension"
              id="extension"
              class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
            >
              <option value="xlsx">xlsx</option>
              <option value="csv">csv</option>
              <option value="xls">xls</option>
            </select>
          </div>

          <input type="text" class="hidden" name="userId" bind:value={userId} />

          {#each { length: fieldQtd } as _, i}
            <div>
              <label class="text-gray-700 dark:text-gray-200" for="columnName"
                >Nome da coluna {i + 1}</label
              >
              <input
                id="columnName"
                type="text"
                name="columnName{i + 1}"
                class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
              />
            </div>
            <div>
              <label class="text-gray-700 dark:text-gray-200" for="columnType"
                >Formato da coluna {i + 1}</label
              >
              <select
                name="columnType{i + 1}"
                id="columnType"
                class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
              >
                <option value="object">Texto</option>
                <option value="int64">Inteiro</option>
                <option value="float64">Decimal</option>
              </select>
            </div>
          {/each}
        </div>
      </form>
      <button
        form="templateForm"
        slot="button"
        type="submit"
        class="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-green-500 hover:bg-green-600 dark:hover:bg-green-500 dark:bg-green-600 rounded-md focus:outline-none"
        >Criar
      </button>
    </Modal>
  </tbody>
</FileTable>
