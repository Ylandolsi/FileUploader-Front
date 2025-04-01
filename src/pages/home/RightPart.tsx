import { useState } from "react";
import { FileSideBar } from "@/pages/fileSidebar";
import { FileType } from "@/types/filesTypes";
export function RightPart({
  filesOfCurrentFolder,
  setFilesOfCurrentFolder,
}: {
  filesOfCurrentFolder: FileType[];
  setFilesOfCurrentFolder: (files: FileType[]) => void;
}) {
  const [selectedFileData, setselectedFileData] = useState<FileType | null>(
    null
  );
  return (
    <div className="relative h-full">
      <div className="grid grid-cols-4 gap-y-1 pl-2">
        <div className="col-span-4 grid grid-cols-4 bg-gray-200  dark:bg-gray-700/70 rounded-2xl px-4 py-1">
          <p className="col-span-2 font-medium h-8 flex items-center">Name</p>{" "}
          <p className="font-medium h-8 flex items-center">Size</p>{" "}
          <p className="font-medium h-8 flex items-center">Created At</p>{" "}
        </div>
        {filesOfCurrentFolder.map((file) => (
          <div
            onClick={() => {
              setselectedFileData(file);
            }}
            key={file.id}
            className="col-span-4 rounded-xl px-2 grid grid-cols-4 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <p className="col-span-2 truncate">{file.name}</p>
            <p>{(file.size / 1000000).toFixed(2)} MB</p>
            <p>{new Date(file.createdAt).toLocaleDateString()}</p>
          </div>
        ))}

        {filesOfCurrentFolder.length === 0 && (
          <div className="col-span-4 py-4 text-center text-gray-500">
            No files in this folder
          </div>
        )}
      </div>
      {selectedFileData != null && (
        <FileSideBar
          selectedFileData={selectedFileData}
          setselectedFileData={setselectedFileData}
        />
      )}
    </div>
  );
}
