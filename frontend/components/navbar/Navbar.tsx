import { Button } from "../ui/button";
import Search from "./Search";

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
            <Button>Signup</Button>
          </div>
          <div>
            <Button variant="outline">Login</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
