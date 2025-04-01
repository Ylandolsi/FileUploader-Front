import { FileType } from "@/types/filesTypes";
import { tokenService } from "./TokenService";
import { apiurl } from "@/constants/apiurl";

export const FileService = {
  uploadFile: async (file: File, folderId: number): Promise<FileType> => {
    console.log(`Uploading file to folder ID: ${folderId}`);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderId", folderId.toString());
    const response = await fetch(`${apiurl}/File/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenService.getAccessToken()}`,
      },
      body: formData,
    });
    if (!response.ok) {
      const responseText = await response.json();
      console.error("Error uploading file:", responseText.message);
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
    url = url.downloadurl;
    if (!url) {
      throw new Error("Download URL not found");
    }
    window.location.href = url;
  },

  shareFile: async (fileId: number, duration: number): Promise<string> => {
    const response = await fetch(
      `${apiurl}/File/share/${fileId}?duration=${duration}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenService.getAccessToken()}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      const responseText = await response.json();
      console.error("Error sharing file:", responseText.message);
      throw new Error("Failed to share file");
    }
    const shareData = await response.json();
    return shareData.shareLink;
  },

  downloadSharedFile: async (token: string): Promise<void> => {
    console.log("Token:", token);
    const response = await fetch(`${apiurl}/File/download/shared/${token}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      console.log("Error downloading shared file:", response.status);
      throw new Error("Failed to download shared file");
    }
    let url = await response.json();
    url = url.downloadUrl;
    console.log("Download URL response:", url);
    if (!url) {
      throw new Error("Download URL not found");
    }
    window.location.href = url;
  },
};
