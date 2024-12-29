import { isEqual } from "lodash";
import { useState } from "react";
import { useSetAtom } from "jotai";
import { useParams } from "next/navigation";

import { DatabaseResult } from "@/components/database-result";
import { SqlEditor } from "@/components/sql-editor";
import { useSQLite } from "@/hooks/use-sqlite";
import { type Question } from "@/types";
import { scoreboardAtom } from "@/atoms/scoreboard";

export function Question({
  question,
  nextQuestion,
  levels,
}: {
  question: Question;
  nextQuestion: (level: number) => void;
  levels: number[];
}) {
  const [showHint, setShowHint] = useState(false);
  const [queryText, setQueryText] = useState("SELECT * from players");
  const [results, setResults] = useState<any[]>([]);
  const [correctResults, setCorrectResults] = useState<any[]>([]);
  const [showCorrectResult, setShowCorrectResult] = useState(false);
  const [isResultCorrect, setIsResultCorrect] = useState<boolean | undefined>(
    undefined,
  );
  const [error, setError] = useState("");
  const { runQuery, loadingProgress } = useSQLite();
  const setScoreboard = useSetAtom(scoreboardAtom);
  const { database } = useParams();

  const handleRunQuery = async () => {
    try {
      setError("");
      const [result, correctResult] = await Promise.all([
        runQuery(queryText),
        runQuery(question.sql),
      ]);
      setResults(result);
      setCorrectResults(correctResult);

      const [, resultWithoutHeader] = result;
      const [, correctResultWithoutHeader] = correctResult;

      if (isEqual(resultWithoutHeader, correctResultWithoutHeader)) {
        setIsResultCorrect(true);
        setScoreboard((prev) => {
          const newScore = prev?.[database as string] ?? {};
          newScore[question.level] = [
            ...new Set([...(newScore[question.level] ?? []), question.id]),
          ];
          return { ...prev, [database as string]: newScore };
        });
      } else {
        setIsResultCorrect(false);
      }

      // TESTING:
      // setResults(question.hardcode);
      // setIsResultCorrect(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Query execution failed");
    }
  };

  return (
    <>
      <p className="text-xl text-info font-bold mt-10 mb-2">Question:</p>
      <p className="text-xl font-semibold">{question.question}</p>
      {showHint && (
        <p className="text-sm text-gray-500 mt-1">{question.hint}</p>
      )}
      <div className="mt-2 flex gap-2">
        {question.hint && (
          <button
            className="btn btn-outline btn-xs inline-block"
            onClick={() => setShowHint(true)}
          >
            Show hint
          </button>
        )}
        {question.level >= 1 && (
          <button
            className="btn btn-outline btn-xs inline-block"
            onClick={() => nextQuestion(question.level - 1)}
          >
            Give me an easier question
          </button>
        )}
        {!isResultCorrect && (
          <button
            className="btn btn-outline btn-xs inline-block"
            onClick={() => nextQuestion(question.level)}
          >
            Skip this question
          </button>
        )}
        {Math.max(...levels) > question.level && (
          <button
            className="btn btn-outline btn-xs inline-block"
            onClick={() => nextQuestion(question.level + 1)}
          >
            Give me a harder question
          </button>
        )}
      </div>
      {question.resultSchema && (
        <div className="mt-8">
          <p className="font-bold">How the result should look?</p>
          <p className="text-sm">
            The result of your SQL query should look like the table below. Your
            column name could be different but the order matters.
          </p>
          <table className="table table-sm table-zebra max-w-fit -m-3 mt-1">
            <thead>
              <tr>
                {question.resultSchema[0].map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {question.resultSchema.slice(1).map((row, i) => (
                <tr key={i}>
                  {row.map((cell, i) => (
                    <td key={i}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-8 flex flex-col gap-2 items-start">
        <p className="font-bold">Write your query</p>
        {loadingProgress >= 100 && (
          <SqlEditor
            onChange={(value) => setQueryText(value ?? "")}
            defaultValue={queryText}
          />
        )}
        {isResultCorrect === undefined && loadingProgress < 100 && (
          <button
            onClick={handleRunQuery}
            className="btn btn-sm btn-accen btn-disabledt"
          >
            Download database... ({Math.floor(loadingProgress)}%)
          </button>
        )}
        {isResultCorrect === undefined && loadingProgress === 100 && (
          <button
            onClick={handleRunQuery}
            className="btn btn-sm btn-accent mt-2"
          >
            Run Query
          </button>
        )}
        {isResultCorrect === false && (
          <button onClick={handleRunQuery} className="btn btn-sm btn-warning">
            Run Again
          </button>
        )}
        {isResultCorrect === true && (
          <button
            onClick={() => nextQuestion(question.level)}
            className="btn btn-sm btn-info"
          >
            Next Question
          </button>
        )}
      </div>
      {error && <p className="text-error mt-2">{error}</p>}
      {results.length > 0 && (
        <div className="mt-8">
          <DatabaseResult
            titbit={question.titbit}
            results={showCorrectResult ? correctResults : results}
            isResultCorrect={!!isResultCorrect}
            isShowingCorrectResult={showCorrectResult}
            toggleResult={() => {
              setShowCorrectResult(!showCorrectResult);
            }}
          />
        </div>
      )}
    </>
  );
}
