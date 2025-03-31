import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else setLoading(false);
  }, []);

  if (loading) {
    return <div />;
  }

  return (
    <>
      <h1>WelcomeHome</h1>
    </>
  );
}
