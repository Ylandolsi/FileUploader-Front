import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";
import { Home } from "./pages/home/Home";
import { Login } from "./pages/login/Login";

export function Routes() {}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />}></Route>
      <Route path="login" element={<Login />}></Route>
    </Route>
  )
);
