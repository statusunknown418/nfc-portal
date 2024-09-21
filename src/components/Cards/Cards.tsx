"use client";
import "swiper/css";
import "swiper/css/effect-cards";
import { Swiper, SwiperSlide } from "swiper/react";
import { BackgroundRight } from "../BackgroundRight";
import { MotionTransition } from "../MotionTransition/MotionTransition";
import { Reveal } from "../Reveal";
import { EffectCards } from "swiper/modules";
import { dataCards } from "./Cards.data";
import Image from "next/image";

export function Cards() {
  return (
    <div className="relative px-6 py-20 md:py-64" id="tarjetas">
      <BackgroundRight />
      <div className="block max-w-5xl mx-auto md:grid md:grid-cols-2">
        <Reveal>
          <h2 className="text-5xl bg-gradient-to-r from-zinc-100 via-white-500 to-indigo-300 inline-block text-transparent bg-clip-text">
            Customize your experience
            <span className="block degradedBlue bg-blueLight bg-gradient-to-r from-indigo-300 via-white-500 to-zinc-100 text-transparent bg-clip-text">
              Design and buy the style you want
            </span>
          </h2>
        </Reveal>
        <div className="px-5">
          <MotionTransition>
            <Swiper effect={"cards"} grabCursor={true} modules={[EffectCards]}>
              {dataCards.map(({ image, id }) => (
                <SwiperSlide key={id}>
                  <Image
                    src={image}
                    alt="Credit Card"
                    width="400"
                    height="300"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </MotionTransition>
        </div>
      </div>
    </div>
  );
}
