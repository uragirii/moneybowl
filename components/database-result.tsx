interface DatabaseResultProps {
  isResultCorrect: boolean;
  isShowingCorrectResult: boolean;
  results: any[];
  toggleResult: () => void;
}

export function DatabaseResult({
  results,
  isResultCorrect,
  isShowingCorrectResult,
  toggleResult,
}: DatabaseResultProps) {
  const [header, ...rows] = results;

  return (
    <>
      <div className="mt-4 max-w-4xl">
        <div className="flex items-center gap-2 mb-2">
          <p
            className={
              "text-xl font-bold mt-10" +
              (isResultCorrect ? "text-info" : "text-error")
            }
          >
            {isShowingCorrectResult ? "Expected Result:" : "Your Result:"}
          </p>
          {!isResultCorrect && !isShowingCorrectResult && (
            <button
              className="btn btn-outline btn-xs"
              onClick={() => toggleResult()}
            >
              Show expected result
            </button>
          )}
          {!isResultCorrect && isShowingCorrectResult && (
            <button
              className="btn btn-outline btn-xs"
              onClick={() => toggleResult()}
            >
              Show your result
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <colgroup>
              <col span={1} style={{ width: "30px" }} />
            </colgroup>
            <thead>
              <tr className="hover">
                <th></th>
                {header.map((cell: any, i: number) => (
                  <th key={i} className="font-bold">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="hover">
                  <th>{i + 1}</th>
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
        {results.length >= 25 && (
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Note: All SQL queries are capped to 25 rows in order to limit memory
            consumption. Expected results are always less than 25 rows.
          </p>
        )}
      </div>
    </>
  );
}
