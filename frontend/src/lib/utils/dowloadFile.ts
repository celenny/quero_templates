import pkg from "file-saver";
const { saveAs } = pkg;

export default function downloadFile(
  id: number,
  fileName: string,
  route: string
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `/api/${route}/${id}/download`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download template");
      }

      const blob = await response.blob();
      saveAs(blob, fileName);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}