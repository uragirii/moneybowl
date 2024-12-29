"use client";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useSetAtom } from "jotai";

import { Questions } from "@/types";
import { useQuestions } from "@/hooks/use-questions";
import { scoreboardAtom } from "@/atoms/scoreboard";

const SQLiteProvider = dynamic(
  async () => (await import("@/hooks/use-sqlite")).SQLiteProvider,
  { ssr: false },
);

const Question = dynamic(async () => (await import("./question")).Question, {
  ssr: false,
});

export default function Content({ questions }: { questions: Questions }) {
  const { database } = useParams();
  const setScoreboard = useSetAtom(scoreboardAtom);
  const { loadQuestion, currentQuestion, levels } = useQuestions({
    questions,
    database: database as string,
  });

  return (
    <SQLiteProvider
      dbUrl={`${process.env.NEXT_PUBLIC_DATABASE_URL}/${database as string}.db`}
    >
      {currentQuestion ? (
        <Question
          key={currentQuestion.question}
          question={currentQuestion ?? ({} as any)}
          nextQuestion={loadQuestion}
          levels={levels}
        />
      ) : (
        <div className="mt-10">
          <p className="text-xl text-info font-bold">Questions:</p>
          <p className="mt-2">
            Thank you! that's all the questions for now. We'll be adding more
            soon. Do you want to reset the scoreboard and start again?
          </p>
          <button
            className="btn btn-soft btn-primary btn-sm mt-2"
            onClick={() => {
              setScoreboard((prev) => ({
                ...prev,
                [database as string]: {},
              }));
              setTimeout(() => loadQuestion(0), 5);
            }}
          >
            Restart
          </button>
        </div>
      )}
    </SQLiteProvider>
  );
}
