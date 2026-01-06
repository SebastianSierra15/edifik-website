"use client";

import dynamic from "next/dynamic";

const Timeline = dynamic(
  () => import("./Timeline").then((mod) => mod.Timeline),
  { ssr: false }
);

const StatsSection = dynamic(
  () => import("./StatsSection").then((mod) => mod.StatsSection),
  { ssr: false }
);

export function AboutInteractiveSections() {
  return (
    <>
      <Timeline />
      <StatsSection />
    </>
  );
}
