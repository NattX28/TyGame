import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

const HeroHompage = () => {
  return (
    <div className="flex flex-col justify-between items-center md:flex-row rounded-md mb-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl md:text-6xl xl:text-8xl 2xl:text-10xl font-semibold lg:font-bold ">
          Connect <span className="block">With Gamers</span>
        </h1>
        <h2 className="md:text-2xl">
          Gaming isn’t just about playing—it’s about belonging.
        </h2>
        <div className="flex flex-col md:flex-row gap-2 mt-2">
          <Button className="w-48">
            <Link href={"/explore"}>Join us</Link>
          </Button>
          <Button variant="secondary" className="w-48">
            Learn more
          </Button>
        </div>
      </div>
      <div className="relative md:h-96 md:w-96 mt-6 md:mt-0">
        <Image
          src="/media/images/console-game-controller-3d-image.png"
          alt="background"
          fill
          className="absolute top-0 left-0 w-full h-full z-0 transform object-contain md:scale-125 md:translate-x-5 lg:translate-x-10 lg:object-cover xl:scale-150 xl:translate-y-24 xl:-translate-x-40"
        />
      </div>
    </div>
  );
};
export default HeroHompage;
