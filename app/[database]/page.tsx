import yaml from "js-yaml";
import path from "path";
import fs from "fs/promises";

import { Questions, type Score } from "@/types";
import { Scoreboard } from "@/components/scoreboard";

import Content from "./content";
import { Diagram } from "./diagram";

export async function generateStaticParams() {
  return [{ database: "international" }];
}

export default async function Index({ params }: any) {
  const { database } = await params;

  const questions = await getQuestions(database);

  return (
    <div className="max-w-5xl m-auto p-4">
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

      <p className="text-xl text-info font-bold mb-2">ER Diagram:</p>
      <div className="mb-5 prose">
        <p>
          The database records all the teams, players and matches stored in <code>teams</code>,{" "}
          <code>players</code> and <code>matches</code> tables respectively. <br />
        </p>
        <p>
          <code>players_in_match</code>, <code>teams_in_match</code> and <code>teams_players</code>{" "}
          are junction tables denoting many-to-many relationship. These tables denote many-to-many
          relationships.
        </p>
        <p>
          For every match, the database also includes information about each delivery bowled. This
          information is stored in the <code>innings</code>, <code>overs</code>,{" "}
          <code>deliveries</code>, <code>wickets</code>,<code>runs</code>, and <code>extras</code>{" "}
          tables. There being a one-to-many relationship between. As in, one match has many innings,
          one inning has many overs, one over has many deliveries, etc.
        </p>
      </div>
      <div>
        <Diagram
          src={"https://dbdiagram.io/e/6744d12be9daa85acaab4fa4/674dad31e9daa85aca5e88b0"}
          fallbackSrc={`static/${database}/diagram.png`}
        />
      </div>

      <Content questions={questions} />

      <div className="footer footer-center mt-44 gap-2">
        <div>🏏 Moneybowl</div>
        <nav className="grid grid-flow-col gap-4">
          <a className="link link-hover" href="https://github.com/il3ven/moneybowl">
            Submit question
          </a>
          <a className="link link-hover" href="https://lghzh51gfia.typeform.com/to/Bvxj8Xl6">
            Feedback
          </a>
        </nav>
      </div>
    </div>
  );
}

async function getQuestions(database: string): Promise<Questions> {
  // Get the path to the JSON file
  const jsonDirectory = path.join(process.cwd(), "static", database);

  // Read the YAML file
  const fileContents = await fs.readFile(jsonDirectory + "/questions.yaml", "utf-8");

  // Parse the YAML as JSON
  const questions = yaml.load(fileContents) as Questions;

  return questions.filter((q) => !q.hidden);
}
