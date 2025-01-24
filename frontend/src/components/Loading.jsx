import React from "react";
import Spinner from "./Spinner";

export const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-2 bg-black">
      <Spinner />
    </div>
  );
};
