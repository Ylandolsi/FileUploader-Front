import { FileType } from "@/types/filesTypes";
import { tokenService } from "./TokenService";
import { apiurl } from "@/constants/apiurl";

export const FileService = {
  uploadFile: async (file: File, folderId: number): Promise<FileType> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${apiurl}/File/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenService.getAccessToken()}`,
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Failed to upload file");
    }
    const fileData = await response.json();
    return fileData;
  },

  getFolderFiles: async (folderId: number): Promise<FileType[]> => {
    const response = await fetch(`${apiurl}/File/folder/${folderId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenService.getAccessToken()}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to get files");
    }
    const files = await response.json();
    return files;
  },
  deleteFile: async (fileId: number): Promise<void> => {
    const response = await fetch(`${apiurl}/File/delete/${fileId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${tokenService.getAccessToken()}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete file");
    }
  },
  downloadFile: async (fileId: number): Promise<void> => {
    const response = await fetch(`${apiurl}/File/download/${fileId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenService.getAccessToken()}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to download file");
    }
    let url = await response.json();
    url = url.message;
    if (!url.downloadurl) {
      throw new Error("Download URL not found");
    }
    window.location.href = url.downloadurl;
  },
};
