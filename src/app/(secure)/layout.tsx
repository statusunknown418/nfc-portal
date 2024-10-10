import { GoogleOneTap } from "@clerk/nextjs";

export default function SecureLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full">
      <GoogleOneTap />

      {children}
    </div>
  );
}
