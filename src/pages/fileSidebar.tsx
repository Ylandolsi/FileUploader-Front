import { Button } from "@/components/ui/button";
import { FileService } from "@/services/FileService";
import { FileType } from "@/types/filesTypes";
import { X } from "lucide-react";

export function FileSideBar({
  selectedFileData,
  setselectedFileData,
}: {
  selectedFileData: FileType;
  setselectedFileData: (file: FileType | null) => void;
}) {
  const handleDownload = async () => {
    try {
      console.log("Downloading file with ID:", selectedFileData.id);
      await FileService.downloadFile(selectedFileData.id);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  const handleDelete = async () => {
    try {
      await FileService.deleteFile(selectedFileData.id);
      setselectedFileData(null);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };
  return (
    <>
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-sm z-10"
        onClick={() => setselectedFileData(null)} // if we click outside the sidebar, close it
      />

      <div className="absolute w-full md:w-1/2 lg:w-1/3 top-0 right-0 h-full bg-gray-100 dark:bg-gray-700 p-4 rounded-l-2xl z-20 shadow-lg">
        <div className="relative h-full flex flex-col rounded-xl overflow-hidden">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold p-4">File Details</h2>
            <button
              onClick={() => setselectedFileData(null)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-2 justify-between rounded-b-xl p-4 overflow-y-auto text-md lg:text-lg">
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {selectedFileData.name}
              </p>
              <p>
                <strong>Size:</strong>{" "}
                {(selectedFileData.size / 1000000).toFixed(2)} MB
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(selectedFileData.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="pt-4 flex flex-wrap justify-start items-center gap-2">
              <Button
                className="bg-gray-400 hover:bg-gray-500 transition-colors w-full"
                onClick={handleDownload}>
                Download
              </Button>
              <Button className="bg-gray-400 hover:bg-gray-500 transition-colors w-full">
                Share
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-700 transition-colors w-full "
                onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
