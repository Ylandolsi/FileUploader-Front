import { FolderService } from "@/services/FolderService";
import { FolderBase } from "@/types/foldersTypes";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Folder } from "lucide-react";
import { FileType } from "@/types/filesTypes";
import { FileService } from "@/services/FileService";

const FolderItem = ({
  folder,
  level,
  setCurrentFolderId,
  setFilesOfCurrentFolder,
}: {
  folder: FolderBase;
  level: number;
  setCurrentFolderId: (id: number) => void;
  setFilesOfCurrentFolder: (files: FileType[]) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [subFolders, setSubFolders] = useState<FolderBase[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(`[${folder.name}] subfolder updated =`, subFolders);
  }, [subFolders, folder.name]);

  const handleClick = async () => {
    setLoading(true);

    setCurrentFolderId(folder.id);
    const files = await FileService.getFolderFiles(folder.id);
    setFilesOfCurrentFolder(files);

    const newExpandedState = !expanded;
    setExpanded(newExpandedState);

    if (newExpandedState && subFolders.length === 0) {
      try {
        console.log(`[${folder.name}] Fetching subfolders...`);
        const subFolderList = await FolderService.getSubFolders(folder.id);
        console.log(`[${folder.name}] Got subfolder list:`, subFolderList);

        setSubFolders(subFolderList);
        console.log(`[${folder.name}] State update called`);
      } catch (error) {
        console.error(`[${folder.name}] Error fetching subfolders:`, error);
      }
    }

    setLoading(false);
  };

  const paddingLeft = level * 16;

  return (
    <div className="folder-item">
      <div
        onClick={handleClick}
        className="flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 py-2 transition-colors"
        style={{ paddingLeft: `${paddingLeft}px` }}>
        <span className="mr-1">
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
        <Folder size={16} className="mr-2" />
        <span>{folder.name || "Unnamed Folder"}</span>
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
}: {
  setFilesOfCurrentFolder: (files: FileType[]) => void;
  filesOfCurrentFolder: FileType[];
}) {
  const [folders, setFolders] = useState<FolderBase[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<number>(1);

  useEffect(() => {
    const fetchFolders = async () => {
      let folderList = await FolderService.getRootFolders();
      setFolders(folderList);
    };

    const fetchFiles = async () => {
      let files = await FileService.getFolderFiles(currentFolderId);
      setFilesOfCurrentFolder(files);
    };

    fetchFolders();
    fetchFiles();
  }, [currentFolderId, setFilesOfCurrentFolder]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3">
          <button className="p-1 bg-gray-200/70 dark:bg-gray-500/40 border-2 dark:border-amber-50 border-black rounded-md">
            New Folder
          </button>
          <button className="p-1 bg-gray-200/70 dark:bg-gray-500/40 border-2 dark:border-amber-50 border-black rounded-md">
            New File
          </button>
        </div>
      </div>

      <div className="mt-4">
        {folders.map((folder) => (
          <FolderItem
            key={folder.id}
            folder={folder}
            level={0}
            setCurrentFolderId={setCurrentFolderId}
            setFilesOfCurrentFolder={setFilesOfCurrentFolder}
          />
        ))}
      </div>
    </div>
  );
}
