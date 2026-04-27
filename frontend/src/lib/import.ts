import * as XLSX from "xlsx";
import { ImportTask } from "../types/task"; // sửa path

export const importFile = (file: File): Promise<ImportTask[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json<ImportTask>(worksheet);

        resolve(jsonData);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};