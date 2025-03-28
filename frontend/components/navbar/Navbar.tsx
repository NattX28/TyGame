import { Button } from "../ui/button";
import Search from "./Search";
import Link from "next/link";

const Navbar = () => {
  

  return (
    <nav>
      <div className="flex justify-between items-center h-16">
        Logo
        <div className="hidden md:inline-block">
          <Search />
        </div>
        <div className="flex gap-2 sm:gap-4">
          <div>
            <Button>
              <Link href={"/signin"}>Signup</Link>
            </Button>
          </div>
          <div>
            <Button variant="outline" asChild>
              <Link href={"/login"}>Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
