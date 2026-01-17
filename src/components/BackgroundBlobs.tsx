import React from "react";

export const BackgroundBlobs: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -top-28 -left-24 h-72 w-72 rounded-full blur-3xl opacity-35"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.14), rgba(59,130,246,0))",
        }}
      />
      <div
        className="absolute -top-24 right-[-60px] h-72 w-72 rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.12), rgba(99,102,241,0))",
        }}
      />
      <div
        className="absolute bottom-[-140px] left-1/3 h-80 w-80 rounded-full blur-3xl opacity-25"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.10), rgba(16,185,129,0))",
        }}
      />
    </div>
  );
};
