import { Route } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";
import { Home } from "./pages/home/Home";

export function Routes() {
  <Route path="/" element={<RootLayout />}>
    <Route index element={<Home />}></Route>
  </Route>;
}
