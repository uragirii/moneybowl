import SqlEditor from "@/components/SqlEditor";
import { useSQLite } from "@/hooks/useSqlite";
import { isEqual } from "lodash";
import { useEffect, useState } from "react";

export default function Content() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [question, setQuestion] = useState<any | null>({});
  const [levels, setLevels] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      const q = await (await fetch("/questions.json")).json();
      setQuestions(q);
      const qIndex = Math.floor(Math.random() * q.length);
      setQuestion(q[qIndex]);
      setLevels(Array.from(new Set(q.map((q: any) => q.level))));
    })();
  }, []);

  const loadQuestion = (level: number) => {
    const ques = questions.filter((q) => q.level === level);
    const qIndex = Math.floor(Math.random() * ques.length);
    setQuestion(ques[qIndex]);
  };

  return (
    <Question
      key={question.question}
      question={question}
      nextQuestion={loadQuestion}
      levels={levels}
    />
  );
}

function Question({
  question,
  nextQuestion,
  levels,
}: {
  question: any;
  nextQuestion: (level: number) => void;
  levels: number[];
}) {
  const [showHint, setShowHint] = useState(false);
  const [queryText, setQueryText] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isResultCorrect, setIsResultCorrect] = useState<boolean | undefined>(undefined);
  const [error, setError] = useState("");
  const { runQuery, loadingProgress } = useSQLite();

  const handleRunQuery = async () => {
    try {
      setError("");
      const [result, correctResult] = await Promise.all([
        runQuery(queryText),
        runQuery(question.sql),
      ]);
      setResults(result);

      console.log(result);
      console.log(correctResult);

      if (isEqual(result, correctResult)) {
        setIsResultCorrect(true);
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
      <p className="max-w-2xl">{question.question}</p>
      {showHint && <p className="text-sm text-gray-500 mt-1">{question.hint}</p>}
      <div className="mt-2 flex gap-2">
        {question.hint && (
          <button className="btn btn-outline btn-sm inline-block" onClick={() => setShowHint(true)}>
            Show hint
          </button>
        )}
        {question.level > 1 && (
          <button
            className="btn btn-outline btn-sm inline-block"
            onClick={() => nextQuestion(question.level - 1)}
          >
            Give me an easier question
          </button>
        )}
        {!isResultCorrect && (
          <button
            className="btn btn-outline btn-sm inline-block"
            onClick={() => nextQuestion(question.level)}
          >
            Skip this question
          </button>
        )}
        {Math.max(...levels) > question.level && (
          <button
            className="btn btn-outline btn-sm inline-block"
            onClick={() => nextQuestion(question.level + 1)}
          >
            Give me a harder question
          </button>
        )}
      </div>
      <div className="mt-4 flex flex-col gap-2 items-start">
        {/* <textarea
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          className="min-w-full max-w-3xl min-h-16 textarea-primary p-2 placeholder:opacity-50 font-mono "
          placeholder="SELECT * from players"
        /> */}
        {loadingProgress >= 100 && <SqlEditor onChange={(value) => setQueryText(value ?? "")} />}
        {isResultCorrect === undefined && loadingProgress < 100 && (
          <button onClick={handleRunQuery} className="btn btn-sm btn-accen btn-disabledt">
            Loading database... ({loadingProgress}%)
          </button>
        )}
        {isResultCorrect === undefined && loadingProgress === 100 && (
          <button onClick={handleRunQuery} className="btn btn-sm btn-accent">
            Run Query
          </button>
        )}
        {isResultCorrect === false && (
          <button onClick={handleRunQuery} className="btn btn-sm btn-warning">
            Try Again
          </button>
        )}
        {isResultCorrect === true && (
          <button onClick={() => nextQuestion(question.level)} className="btn btn-sm btn-info">
            Next Question
          </button>
        )}
      </div>
      {error && <p className="text-error mt-2">{error}</p>}
      {results.length > 0 && (
        <>
          <div className="mt-4 overflow-x-auto max-w-4xl">
            <p
              className={
                "text-xl font-bold mt-10 mb-2 " + (isResultCorrect ? "text-info" : "text-error")
              }
            >
              Your Result:
            </p>
            <table className="table table-zebra">
              <tbody>
                {results.map((row, i) => (
                  <tr key={i}>
                    {Array.isArray(row) ? (
                      row.map((cell, j) => <td key={j}>{cell?.toString()}</td>)
                    ) : (
                      <td>{row?.toString()}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
