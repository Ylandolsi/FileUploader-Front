import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FileService } from "@/services/FileService";

export function SharedFileDownload() {
  const { token } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initiateDownload() {
      if (!token) {
        setError("Invalid download link");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        await FileService.downloadSharedFile(token);
        setIsLoading(false);
      } catch (err) {
        setError(
          "Failed to download file. The link may have expired or is invalid."
        );
        setIsLoading(false);
      }
    }
    initiateDownload();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <div className="max-w-md w-full bg-gray-100 dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Shared File Download</h1>

        {isLoading ? (
          <div className="text-center">
            <p className="mb-4">Starting download...</p>
            <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : error ? (
          <div className="text-red-500">
            <p>{error}</p>
            <button
              onClick={() => (window.location.href = "/")}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Go Home
            </button>
          </div>
        ) : (
          <p className="text-green-500">Downloaded Sucessfully</p>
        )}
      </div>
    </div>
  );
}
