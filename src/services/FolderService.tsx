import { apiurl } from "@/constants/apiurl";
import { tokenService } from "./TokenService";
import { FolderBase } from "@/types/foldersTypes";
export const FolderService = {
  async createFolder(
    folderName: string,
    parentId: string
  ): Promise<FolderBase> {
    const response = await fetch(`${apiurl}/Folder/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenService.getAccessToken()}`,
      },
      body: JSON.stringify({
        name: folderName,
        parentId: parentId,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to create folder");
    }
    const folder = await response.json();
    return folder;
  },
  async deleteFolder(folderId: number): Promise<void> {
    const response = await fetch(`${apiurl}/Folder/${folderId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${tokenService.getAccessToken()}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete folder");
    }

    return;
  },

  async getRootFolders(): Promise<FolderBase[]> {
    const response = await fetch(`${apiurl}/Folder/root`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenService.getAccessToken()}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to get folders");
    }
    const folders = await response.json();
    return folders;
  },

  async getSubFolders(parentId: number): Promise<FolderBase[]> {
    const response = await fetch(`${apiurl}/Folder/subfolders/${parentId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenService.getAccessToken()}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to get subfolders");
    }
    const folders = await response.json();
    return folders;
  },
};
