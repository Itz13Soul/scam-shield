"use client";

import dynamic from "next/dynamic";

const ShieldScene = dynamic(() => import("./ShieldScene"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-full bg-teal-400/5" />,
});

export default function ShieldLoader() {
  return <ShieldScene />;
}
