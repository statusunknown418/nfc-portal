import { GoogleOneTap } from "@clerk/nextjs";

export default function SecureLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GoogleOneTap />
      <div className="h-full">{children}</div>
    </>
  );
}
