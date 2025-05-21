"use client";
import { Button } from "@heroui/react";
import Link from "next/link";

const HomePage = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen px-4 py-8 md:px-8 lg:px-16">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4 text-center">
          Bienvenido a mi sitio web
        </h1>
        <p className="text-base md:text-lg mb-4 md:mb-6 text-center">
          Este sitio web es totalmente accesible
        </p>
        <div className="flex gap-3 md:gap-4">
        <Link href='/main/levels'>
          <Button>
            Main Page
          </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default HomePage;
