import React from "react";

export const Spinner = ({ size = "16" }) => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div
        className={`animate-spin rounded-full border-t-4 border-l-4 border-gray-500 border-opacity-50`}
        style={{ width: `${size}rem`, height: `${size}rem` }}
      ></div>
      <p className="mt-4 text-zinc-500 dark:text-zinc-400">Loading...</p>
    </div>
  );
};

export default Spinner;
