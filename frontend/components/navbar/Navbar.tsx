import { Button } from "../ui/button";
import Search from "./Search";

const Navbar = () => {
  return (
    <nav>
      <div className="flex justify-between items-center h-16">
        Logo
        <Search />
        <div className="flex gap-4">
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
