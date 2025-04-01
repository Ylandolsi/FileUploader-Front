import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LeftPart } from "./LeftPart";
import { FileType } from "@/types/filesTypes";
import { RightPart } from "./RightPart";

export function Home() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);

  const [filesOfCurrentFolder, setFilesOfCurrentFolder] = useState<FileType[]>(
    []
  );

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else setLoading(false);
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
        />
      </div>
      <div className=" grow h-full p-3">
        <RightPart
          filesOfCurrentFolder={filesOfCurrentFolder}
          setFilesOfCurrentFolder={setFilesOfCurrentFolder}
        />
      </div>
    </div>
  );
}
