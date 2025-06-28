"use client";

import { PulseLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-background">
      <PulseLoader color="#10b981" size={10} margin={6} />
      <p className="text-sm mt-4 text-muted-foreground">
        Loading your appointments...
      </p>
    </div>
  );
}
