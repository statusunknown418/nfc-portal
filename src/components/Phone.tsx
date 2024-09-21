import Image from "next/image";

interface iPhoneFrameProps {
  imageUrl: string;
  altText: string;
}

export default function Component({ imageUrl, altText }: iPhoneFrameProps) {
  return (
    <div className="relative w-[320px] h-[670px] mx-auto">
      <svg
        viewBox="0 0 320 670"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer metallic border */}
        <rect
          x="10"
          y="10"
          width="300"
          height="650"
          rx="40"
          fill="none"
          stroke="url(#metalGradient)"
          strokeWidth="3"
        />

        {/* Phone frame */}
        <rect x="12" y="12" width="296" height="646" rx="38" fill="black" />

        {/* Inner screen border */}
        <rect
          x="16"
          y="16"
          width="288"
          height="638"
          rx="34"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
        />

        {/* Side buttons */}
        <rect
          x="6"
          y="120"
          width="2"
          height="60"
          rx="3"
          fill="rgba(180,180,180,0.3)"
        />
        <rect
          x="6"
          y="200"
          width="2"
          height="60"
          rx="3"
          fill="rgba(180,180,180,0.3)"
        />
        <rect
          x="311"
          y="170"
          z="0"
          width="2"
          height="80"
          rx="3"
          fill="rgba(180,180,180,0.25)"
        />

        {/* Gradient for metallic effect */}
        <defs>
          <linearGradient
            id="metalGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-[16px] overflow-hidden rounded-[34px]">
        <Image src={imageUrl} alt={altText} layout="fill" objectFit="cover" />
        {/* Floating camera notch */}
        <div className="absolute top-[10px] left-1/2 transform -translate-x-1/2 w-[35%] h-[25px] bg-black rounded-full flex items-center justify-center space-x-2">
          {/* Camera lens */}
          <div className="w-[10px] h-[10px] rounded-full bg-[rgba(255,255,255,0.1)] ring-0 ring-[rgba(255,255,255,0.2)]"></div>
        </div>
      </div>
    </div>
  );
}
