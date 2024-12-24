"use client";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useState, Suspense } from "react";
import { useAtomValue } from "jotai";

import { type Score } from "@/types";
import { Scoreboard } from "@/components/scoreboard";
import { scoreboardAtom } from "@/atoms/scoreboard";

const Content = dynamic(() => import("./content"), { ssr: false });
const SQLiteProvider = dynamic(
  async () => (await import("@/hooks/use-sqlite")).SQLiteProvider,
  { ssr: false },
);

export default function Index() {
  const { database } = useParams();

  const scoreboard = useAtomValue(scoreboardAtom);

  return (
    <div className="max-w-5xl m-auto p-4">
      <div className="hero mb-16">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold">SELECT * FROM Cricket</h1>
            <Scoreboard score={scoreboard[database as string]} />
          </div>
        </div>
      </div>

      <p className="text-xl text-info font-bold mb-2">Schema:</p>
      <iframe
        className="w-full"
        height="500"
        src="https://dbdiagram.io/e/6744d12be9daa85acaab4fa4/674dad31e9daa85aca5e88b0"
      />

      <Suspense fallback={<div>Loading...</div>}>
        <SQLiteProvider
          dbUrl={`${process.env.NEXT_PUBLIC_DATABASE_URL}/${database as string}.db`}
        >
          <Content />
        </SQLiteProvider>
      </Suspense>

      <div className="h-48"></div>
    </div>
  );
}
