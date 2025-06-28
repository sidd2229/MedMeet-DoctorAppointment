"use client";

import { BarLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <BarLoader color="#10b981" width={400} height={5} />
      <p className="text-sm mt-4 text-muted-foreground">Loading Doctor Dashboard...</p>
    </div>
  );
}
