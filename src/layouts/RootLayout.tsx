import { Outlet } from "react-router-dom";
import { Navbar } from "../components/navbar";
import { Breadcrumbs } from "../components/breadcrumbs";
import { ModeToggle } from "@/components/darkmode";

export function RootLayout() {
  return (
    <>
      <Navbar />
      <Breadcrumbs />
      <Outlet />
    </>
  );
}
