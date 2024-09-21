import Image from "next/image";
import Hero from "../components/Hero";
import Phone from "../components/Phone";
import Bar from "../components/Bar";
import { Cards } from "../components/Cards/Cards";

export default function Home() {
  return (
    <>
      <Bar />
      <Hero />
      <Cards />
    </>
  );
}
