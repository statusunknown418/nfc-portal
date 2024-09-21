"use client";
import React from "react";
import Phone from "./Phone";
import { ScrollParallax } from "react-just-parallax";
import { socialIcons } from "@/constants";
import { Reveal } from "./Reveal";

const Hero = () => {
  return (
    <div className="relative bg-black text-white min-h-screen flex flex-col justify-center items-center">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-medium mb-2 w-full max-w-lg mx-auto">
          Tu presentación mas profesional que nunca
        </h1>
        <p className="text-xl text-zinc-300">Una nueva forma de conectar</p>
      </div>

      <div className="relative z-10 mb-8">
        <Reveal>
          <Phone imageUrl="/ss5.png" altText="Phone Image" />
        </Reveal>
        <ScrollParallax>
          <ul className="absolute top-[-260px] -left-24 transform -translate-x-1/2 w-fit flex justify-center items-center space-x-4 bg-white/10 backdrop-blur border border-gray-300 rounded-xl p-2 z-20">
            {socialIcons.map(({ src, alt }, index) => (
              <li key={index} className="p-1">
                <img
                  src={src}
                  width={24}
                  height={24}
                  alt={alt}
                  className="hover:scale-110 transition-transform"
                />
              </li>
            ))}
          </ul>
        </ScrollParallax>
      </div>
    </div>
  );
};

export default Hero;
