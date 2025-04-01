import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LeftPart } from "./LeftPart";
import { FileType } from "@/types/filesTypes";
import { RightPart } from "./RightPart";

export function Home() {
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useAuth();

  const [filesOfCurrentFolder, setFilesOfCurrentFolder] = useState<FileType[]>(
    []
  );
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, []);

  if (loading) {
    return <div />;
  }

  return (
    <div className="flex h-full divide-x divide-gray-700 dark:divide-white">
      <div className=" w-[300px] h-full p-3">
        <LeftPart
          filesOfCurrentFolder={filesOfCurrentFolder}
          setFilesOfCurrentFolder={setFilesOfCurrentFolder}
          refreshTrigger={refreshTrigger}
          setRefreshTrigger={setRefreshTrigger}
        />
      </div>
      <div className=" grow h-full p-3">
        <RightPart
          filesOfCurrentFolder={filesOfCurrentFolder}
          setFilesOfCurrentFolder={setFilesOfCurrentFolder}
          refreshTrigger={refreshTrigger}
          setRefreshTrigger={setRefreshTrigger}
        />
      </div>
    </div>
  );
}
