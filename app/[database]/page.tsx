"use client";
import { SQLiteProvider } from "@/hooks/useSqlite";
import { useParams } from "next/navigation";
import { useState, Suspense } from "react";
import Content from "./content";

export default function Index() {
  const { database } = useParams();

  return (
    <div className="max-w-5xl m-auto p-4">
      <div className="hero">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">
              Practice SQL as a Cricket Fan
            </h1>
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
          dbUrl={`${process.env.NEXT_PUBLIC_DATABASE_URL}/${database as string}.db.br`}
        >
          <Content />
        </SQLiteProvider>
      </Suspense>

      <div className="h-48"></div>
    </div>
  );
}
