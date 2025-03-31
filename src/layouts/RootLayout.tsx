import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Breadcrumbs } from "../components/Breadcrumbs";

export function RootLayout() {
  return (
    <>
      <Navbar />
      <Breadcrumbs />
      <Outlet />
    </>
  );
}
