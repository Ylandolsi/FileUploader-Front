import { FolderService } from "@/services/FolderService";
import { FolderBase } from "@/types/foldersTypes";
import {
  ChartSpline,
  ChevronDown,
  ChevronRight,
  CircleX,
  File,
  Folder,
  FolderInput,
} from "lucide-react";
import { FileType } from "@/types/filesTypes";
import { FileService } from "@/services/FileService";
import { useEffect, useState, useCallback } from "react";

const FolderItem = ({
  folder,
  level,
  setCurrentFolderId,
  setFilesOfCurrentFolder,
  currentFolderId,
  refreshTrigger,
}: {
  folder: FolderBase;
  level: number;
  currentFolderId: number;
  setCurrentFolderId: (id: number) => void;
  setFilesOfCurrentFolder: (files: FileType[]) => void;
  refreshTrigger: number;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [subFolders, setSubFolders] = useState<FolderBase[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSubFolders = useCallback(async () => {
    if (expanded) {
      try {
        setLoading(true);
        const subFolderList = await FolderService.getSubFolders(folder.id);
        setSubFolders(subFolderList);
      } catch (error) {
        console.error(`[${folder.name}] Error fetching subfolders:`, error);
      } finally {
        setLoading(false);
      }
    }
  }, [folder.id, folder.name, expanded]);

  useEffect(() => {
    if (expanded) {
      fetchSubFolders();
    }
  }, [refreshTrigger, expanded, fetchSubFolders]);

  const handleClick = async () => {
    setLoading(true);

    setCurrentFolderId(folder.id);
    const files = await FileService.getFolderFiles(folder.id);
    setFilesOfCurrentFolder(files);

    const newExpandedState = !expanded;
    setExpanded(newExpandedState);

    if (newExpandedState && subFolders.length === 0) {
      await fetchSubFolders();
    }

    setLoading(false);
  };

  const paddingLeft = level * 16;

  return (
    <div className="folder-item">
      <div
        onClick={handleClick}
        className={`flex items-center cursor-pointer hover:bg-gray-700/50 py-2 transition-colors
          ${folder.id === currentFolderId ? "bg-gray-500/40" : ""}`}
        style={{ paddingLeft: `${paddingLeft}px` }}>
        <span className="mr-1">
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
        <span
          className={`${
            currentFolderId === folder.id
              ? "text-blue-500 font-semibold"
              : "text-black dark:text-white"
          } mr-2`}>
          {folder.name || "Unnamed Folder"}
        </span>
        <Folder size={16} className="mr-2" />

        {loading && (
          <span className="ml-2 text-xs text-gray-500">loading...</span>
        )}
      </div>

      {expanded && subFolders.length > 0 && (
        <div className="folder-children">
          {subFolders.map((subFolder) => (
            <FolderItem
              key={subFolder.id}
              folder={subFolder}
              level={level + 1}
              setCurrentFolderId={setCurrentFolderId}
              setFilesOfCurrentFolder={setFilesOfCurrentFolder}
              currentFolderId={currentFolderId}
              refreshTrigger={refreshTrigger}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function LeftPart({
  setFilesOfCurrentFolder,
  filesOfCurrentFolder,
  refreshTrigger,
  setRefreshTrigger,
}: {
  setFilesOfCurrentFolder: (files: FileType[]) => void;
  filesOfCurrentFolder: FileType[];
  refreshTrigger: number;
  setRefreshTrigger: (trigger: number) => void;
}) {
  const [Root, setRoot] = useState<FolderBase[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<number>(1);

  useEffect(() => {
    const fetchFolders = async () => {
      let folderList = await FolderService.getRootFolders();
      setRoot(folderList);
    };

    const fetchFiles = async () => {
      let files = await FileService.getFolderFiles(currentFolderId);
      setFilesOfCurrentFolder(files);
    };

    fetchFolders();
    fetchFiles();
  }, [currentFolderId, setFilesOfCurrentFolder, refreshTrigger]);

  const handleNewFolder = async () => {
    const newFolderName = prompt("Enter new folder name:");
    if (!newFolderName) return;
    try {
      await FolderService.createFolder(newFolderName, currentFolderId);
      setRefreshTrigger(refreshTrigger + 1);
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const handleUploadFile = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "*";
    fileInput.onchange = async (event) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        try {
          await FileService.uploadFile(file, currentFolderId);
          setRefreshTrigger(refreshTrigger + 1);
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    };
    fileInput.click();
  };

  const handleDeleteFolder = async () => {
    if (currentFolderId === 1) {
      alert("You cannot delete the root folder.");
      return;
    }
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this folder? This action cannot be undone."
    );
    if (confirmDelete) {
      try {
        await FolderService.deleteFolder(currentFolderId);
        setRefreshTrigger(refreshTrigger + 1);
      } catch (error) {
        console.error("Error deleting folder:", error);
      }
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3">
          <button
            onClick={handleNewFolder}
            className="flex gap-1 p-2 bg-gray-200/70 dark:bg-gray-500/40 border-2 dark:border-amber-50 border-black rounded-md">
            <FolderInput />
            New Folder
          </button>
          <button
            onClick={handleUploadFile}
            className="flex gap-1 p-2 bg-gray-200/70 dark:bg-gray-500/40 border-2 dark:border-amber-50 border-black rounded-md">
            <File />
            New File
          </button>
          {currentFolderId !== 1 && (
            <button
              onClick={handleDeleteFolder}
              className="flex gap-1 p-2 bg-gray-200/70 dark:bg-gray-500/40 border-2 dark:border-amber-50 border-black rounded-md">
              <CircleX />
              Delete Folder
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        {Root.map((root) => (
          <FolderItem
            key={root.id}
            folder={root}
            level={0}
            currentFolderId={currentFolderId}
            setCurrentFolderId={setCurrentFolderId}
            setFilesOfCurrentFolder={setFilesOfCurrentFolder}
            refreshTrigger={refreshTrigger}
          />
        ))}
      </div>
    </div>
  );
}
