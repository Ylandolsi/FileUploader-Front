import { RouterProvider } from "react-router-dom";
import "./styles/App.css";
import { AuthProvider } from "./contexts/AuthContext";
import { router } from "./Routes";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
