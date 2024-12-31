import Image from "next/image";
import { Button } from "../ui/button";

const HeroHompage = () => {
  return (
    <div className="flex justify-between items-center rounded-md mb-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-8xl font-semibold">
          Connect <span className="block">With Gamers</span>
        </h1>
        <h2 className="text-2xl">
          Gaming isn’t just about playing—it’s about belonging.
        </h2>
        <div className="flex gap-2 mt-2">
          <Button className="w-48">Join us</Button>
          <Button variant="secondary" className="w-48">
            Learn more
          </Button>
        </div>
      </div>
      <div className="relative h-96 w-96">
        <Image
          src="/media/images/console-game-controller-3d-image.png"
          alt="background"
          fill
          style={{
            objectFit: "cover",
            maskImage: `
            linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0) 100%),
            linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 1) 100%)
          `,
            WebkitMaskImage: `
            linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0) 100%),
            linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 1) 100%)
          `,
          }}
          className="absolute top-0 left-0 w-full h-full z-0 transform scale-150 translate-y-24 -translate-x-40"
        />
      </div>
    </div>
  );
};
export default HeroHompage;
