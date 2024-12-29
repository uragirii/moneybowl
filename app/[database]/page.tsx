import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useState, Suspense } from "react";
import { useAtomValue } from "jotai";
import yaml from "js-yaml";

import { Questions, type Score } from "@/types";
import { Scoreboard } from "@/components/scoreboard";

import Content from "./content";
import path from "path";
import fs from "fs/promises";

export default async function Index({ params }: any) {
  const { database } = await params;

  const questions = await getQuestions(database);

  return (
    <div className="max-w-5xl m-auto p-4 mb-24">
      <div className="hero mb-16">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold">
              <a href="/">SELECT * FROM Cricket</a>
            </h1>
            <Scoreboard database={database} />
          </div>
        </div>
      </div>

      <p className="text-xl text-info font-bold mb-2">Schema:</p>
      <iframe
        className="w-full"
        height="500"
        src="https://dbdiagram.io/e/6744d12be9daa85acaab4fa4/674dad31e9daa85aca5e88b0"
      />

      <Content questions={questions} />
    </div>
  );
}

async function getQuestions(database: string): Promise<Questions> {
  // Get the path to the JSON file
  const jsonDirectory = path.join(process.cwd(), "static", database);

  // Read the YAML file
  const fileContents = await fs.readFile(
    jsonDirectory + "/questions.yaml",
    "utf-8",
  );

  // Parse the YAML as JSON
  const questions = yaml.load(fileContents) as Questions;

  return questions.filter((q) => !q.hidden);
}
