import React from 'react';
import Link from 'next/link';
import { Joygame } from '../components/icon/joygame';
import { Button } from "../components/ui/button";

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen p-4">
      <div className="relative h-72 w-72 sm:h-[30rem] sm:w-[30rem]">
        <div className="absolute inset-0 flex justify-center items-center">
          <Joygame />
        </div>
        <div className="absolute top-5 left-0 w-full flex flex-col items-center">
          <h1 className="text-5xl sm:text-8xl font-bold stroke-text">404</h1>
          <p className="text-base sm:text-lg">Page not found</p>
        </div>
      </div>
      <Link href="/" className='z-10'>
        <Button className='mt-6'>&lt;- go back</Button>
      </Link>
    </div>
  );
};

export default NotFound;