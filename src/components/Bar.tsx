import React from "react";
import Button from "./Button";

const Bar = () => {
  return (
    <div className="font-bold pt-3 pb-9 flex justify-between items-center px-5">
      <span className="text-2xl">NexTap</span>
      <Button inverted>Get Started</Button>
    </div>
  );
};

export default Bar;
