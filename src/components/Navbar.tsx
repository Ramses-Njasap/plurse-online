import { isAuthenticated } from "@/app/utils/auth";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  // Read token from cookie memory instantly — 0 database hits
  const loggedIn = await isAuthenticated();

  return <NavbarClient loggedIn={loggedIn} />;
}