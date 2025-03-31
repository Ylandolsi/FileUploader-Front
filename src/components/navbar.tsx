import { useAuth } from "@/contexts/AuthContext";
import { ModeToggle } from "./darkmode";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export function Navbar() {
  const { isLoggedIn } = useAuth();

  const { logout } = useAuth();

  return (
    <div className="flex justify-between items-center bg-background border-b border-b-slate-200 mb-10 pb-3 ">
      <Link to="/">
        {" "}
        <p className="text-2xl font-bold">File Uploader</p>{" "}
      </Link>

      <div className="flex items-center gap-4">
        {!isLoggedIn ? (
          <div className="flex gap-2">
            <Button>
              {" "}
              <Link to="/login">Login</Link>
            </Button>
            <Button>
              {" "}
              <Link to="/register">Register</Link>
            </Button>
          </div>
        ) : (
          <Button onClick={logout}>Logout</Button>
        )}
        <div className="cursor-pointer">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
