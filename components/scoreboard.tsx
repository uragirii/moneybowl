import { type Score } from "@/types";

function splitToNChunks(array: Array<unknown>, n: number) {
  let result = [];
  for (let i = n; i > 0; i--) {
    result.push(array.splice(0, Math.ceil(array.length / i)));
  }
  return result;
}

export function Scoreboard({ score }: { score: Score[string] }) {
  score = score ?? {};

  const levels = Object.keys(score);
  const [easyLevels, mediumLevels, hardLevels] = splitToNChunks(levels, 3);

  const easyScore = Object.entries(score)
    .filter(([level]) => easyLevels.includes(level))
    .reduce((score, [level, ids]) => {
      return score + ids.length;
    }, 0);

  const mediumScore = Object.entries(score)
    .filter(([level]) => mediumLevels.includes(level))
    .reduce((score, [level, ids]) => {
      return score + ids.length;
    }, 0);

  const hardScore = Object.entries(score)
    .filter(([level]) => hardLevels.includes(level))
    .reduce((score, [level, ids]) => {
      return score + ids.length;
    }, 0);

  return (
    <div className="flex justify-center flex-col items-center">
      <div className="stats shadow">
        <div className="stat p-3 pb-0">
          <div className="stat-title">Easy</div>
          <div className="stat-value text-2xl">{easyScore}</div>
        </div>
        <div className="stat p-3 pb-0">
          <div className="stat-title">Medium</div>
          <div className="stat-value text-2xl">{mediumScore}</div>
        </div>
        <div className="stat p-3 pb-0">
          <div className="stat-title">Hard</div>
          <div className="stat-value text-2xl">{hardScore}</div>
        </div>
      </div>
      <p className="text-sm text-gray-500">Questions answered by you</p>
    </div>
  );
}
