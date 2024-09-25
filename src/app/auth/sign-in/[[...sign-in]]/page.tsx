import { SignIn } from "@clerk/nextjs";
import Particles from "~/components/magicui/particles";

export default function SignInPage({ searchParams }: { searchParams: { username: string } }) {
  const { username } = searchParams;

  return (
    <div className="relative grid h-full w-full grow place-items-center items-center px-4">
      <SignIn
        appearance={{
          elements: {
            rootBox: "w-full max-w-lg",
            cardBox: "w-full rounded-[calc(var(--radius)+1rem)]",
          },
          variables: {
            fontSize: "1rem",
          },
        }}
        initialValues={{
          username,
        }}
      />

      <Particles
        className="absolute inset-0 -z-10"
        quantity={200}
        ease={40}
        color="#000000"
        refresh
      />
    </div>
  );
}
