<script lang="ts">
  import FileTable from "$lib/components/FileTable.svelte";
  import toast from "svelte-french-toast";
  import type { PageData } from "./$types";
  import { Chart } from "chart.js/auto";
  import { onMount } from "svelte";
  import downloadFile from "$lib/utils/dowloadFile";

  export let data: PageData;

  let perStatusChart: HTMLCanvasElement;
  let perExtensionChart: HTMLCanvasElement;
  let filesPerTemplatesChart: HTMLCanvasElement;

  onMount(() => {
    new Chart(perStatusChart, {
      type: "pie",
      data: {
        datasets: [
          {
            data: data.chartData.perStatus.map((item: any) => item._count),
            backgroundColor: ["#438764", "#01E17B"],
          },
        ],
        labels: data.chartData.perStatus.map((item: any) =>
          item.status === "ACTIVE" ? "ATIVO" : "INATIVO"
        ),
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Quantidade de Templates por Status",
            color:
              window.matchMedia &&
              window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "#fff"
                : "#000",
          },
        },
      },
    });

    new Chart(perExtensionChart, {
      type: "pie",
      data: {
        datasets: [
          {
            data: data.chartData.perExtension.map((item: any) => item._count),
            backgroundColor: ["#27CA40", "#01E17B", "#438764"],
          },
        ],
        labels: data.chartData.perExtension.map((item: any) =>
          item.extension.toUpperCase()
        ),
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Quantidade de Templates por Extensões",
            color:
              window.matchMedia &&
              window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "#fff"
                : "#000",
          },
        },
      },
    });

    new Chart(filesPerTemplatesChart, {
      type: "pie",
      data: {
        datasets: [
          {
            data: data.chartData.filesPerTemplate.map(
              (item: any) => item._count
            ),
            backgroundColor: [
              "#01E17B",
              "#438764",
              "#27CA40",
              "#157f0d",
              "#369d29",
              "#56ba46",
              "#77d863",
              "#98f599",
              "#005600",
              "#5e8b53",
            ],
          },
        ],
        labels: data.chartData.filesPerTemplate.map(
          (item: any) => item.templateName
        ),
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Quantidade de Arquivos por Template",
            color:
              window.matchMedia &&
              window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "#fff"
                : "#000",
          },
          legend: {
            display: false,
          },
        },
      },
    });
  });
</script>

<svelte:head>
  <title>QueroTemplates</title>
</svelte:head>

<FileTable title="Arquivos Enviados" totalPages={data.totalPages}>
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
        class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-800 dark:text-gray-400"
      >
        Tamanho
      </th>

      <th
        scope="col"
        class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-800 dark:text-gray-400"
      >
        Data de upload
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
    </tr>
  </thead>

  <tbody
    slot="body"
    class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900"
  >
    {#each data.files as file}
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
                  {file.info.name.split("-")[1]}
                </h2>
              </div>
            </div>
          </div>
        </td>
        <td
          class="px-12 py-4 text-sm font-normal text-gray-800 dark:text-white whitespace-nowrap"
        >
          {file.info.size}
        </td>
        <td
          class="px-4 py-4 text-sm text-gray-800 dark:text-gray-300 whitespace-nowrap"
          >{new Date(file.info.date).toLocaleString()}</td
        >
        <td
          class="px-4 py-4 text-sm text-gray-800 dark:text-gray-300 whitespace-nowrap"
          >{file.user.name}</td
        >
        <td class="px-4 py-4 text-sm whitespace-nowrap">
          <button
            on:click={() => {
              toast.promise(
                downloadFile(file.id, file.info.name.split("-")[1], "files"),
                {
                  loading: "Baixando arquivo...",
                  success: "Arquivo baixado",
                  error: "Não foi possível baixar o arquivo",
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
      </tr>
    {/each}
  </tbody>
  <div slot="footer" class="flex flex-row justify-center py-6">
    <div class="w-96">
      <canvas bind:this={perStatusChart} />
    </div>
    <div class="w-96">
      <canvas bind:this={perExtensionChart} />
    </div>
    <div class="w-96">
      <canvas bind:this={filesPerTemplatesChart} />
    </div>
  </div>
</FileTable>
