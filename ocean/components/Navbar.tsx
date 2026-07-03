import { AuthModel } from "./AuthModel";
import { NavbarChrome } from "./landing/NavbarChrome";

export default function Navbar() {
  return <NavbarChrome authButton={<AuthModel />} />;
}
