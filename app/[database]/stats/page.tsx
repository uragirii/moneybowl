import { unstable_cache } from "next/cache";

import { getDatabase } from "@/lib/sqlite";

// This will generate paths for each database at build time
export async function generateStaticParams() {
  return [{ database: 'international' }];
}

const getTeams = unstable_cache(
  async (database: string) => {
    const db = await getDatabase(database);

    const teams = db
      .prepare(
        `SELECT count(match_id) as count, team_name from teams_in_match
        GROUP BY team_name
        ORDER BY count(match_id) DESC
  `
      )
      .all() as any;

    return teams;
  },
  ["teams"]
);

export default async function ({ params }: { params: Promise<{ database: string }> }) {
  const { database } = await params;
  const teams = await getTeams(database);

  return (
    <div className="max-w-5xl m-auto p-4 mb-24">
      <div className="hero mb-16">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold">
              <a href="/">SELECT * FROM Cricket</a>
            </h1>
          </div>
        </div>
      </div>

      <p className="text-xl text-info font-bold mb-2">Teams</p>
      <p>Click on the player name to view their stats.</p>

      <article className="prose">
        <table className="table table-sm table-zebra">
          <thead>
            <tr>
              <th>Team</th>
              <th>Matches Played</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team: any) => (
              <tr key={team.team_name}>
                <td>
                  <a href={`stats/${team.team_name}?page=1`}>{team.team_name}</a>
                </td>
                <td>{team.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </div>
  );
}

export const dynamic = 'error'
