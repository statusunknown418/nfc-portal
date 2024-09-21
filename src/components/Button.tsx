import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  inverted?: boolean;
  children: React.ReactNode;
}

export default function Button({
  inverted = false,
  children,
  ...props
}: ButtonProps) {
  const baseClasses =
    "px-4 py-2 rounded-full font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const colorClasses = inverted
    ? "bg-white text-black hover:bg-gray-300 focus:ring-gray-500"
    : "bg-black text-white hover:bg-gray-600 focus:ring-gray-500";

  return (
    <button className={`${baseClasses} ${colorClasses}`} {...props}>
      {children}
    </button>
  );
}

function Example() {
  return (
    <div className="flex space-x-4">
      <Button>Default Button</Button>
      <Button inverted>Inverted Button</Button>
    </div>
  );
}
