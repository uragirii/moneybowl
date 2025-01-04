import { unstable_cache } from "next/cache";

import { getDatabase } from "@/lib/sqlite";

const PAGE_SIZE = 50;

export async function generateStaticParams() {
  const db = await getDatabase("international");

  const teams = db
    .prepare(
      `SELECT count(match_id) as count, team_name from teams_in_match
      GROUP BY team_name
      ORDER BY count(match_id) DESC
`
    )
    .all() as any;

  const ret = teams
    .map((team: any) => {
      const { count } = db
        .prepare(
          `
    SELECT count(id) as count FROM players 
      JOIN teams_players ON teams_players.players_id = players.id
      WHERE team_name = ?
      `
        )
        .get(team.team_name) as any;

      const pages = Array.from({ length: Math.ceil(count / PAGE_SIZE) }, (_, i) => ({
        page: (i + 1).toString(),
      }));

      return pages.map((page) => ({
        database: 'international',
        team: team.team_name,
        page: page.page,
      }));
    })
    .flat();

  return ret;
}

const getPlayers = unstable_cache(async (database: string, team: string, page: number) => {
  const db = await getDatabase(database);
  const players = db
    .prepare(
      `
      SELECT count(players_in_match.match_id) as count, id, name FROM players_in_match 
        JOIN teams_players ON teams_players.players_id = players.id
        JOIN players ON players.id = players_in_match.player_id
        WHERE teams_players.team_name = ?
        GROUP BY players_in_match.player_id
        ORDER BY count DESC
        LIMIT ?, ?
      `
    )
    .all(team, (page - 1) * PAGE_SIZE, PAGE_SIZE);

  return players;
});

export default async function ({
  params,
}: {
  params: Promise<{ page: string; database: string; team: string }>;
}) {
  let { page, database, team } = await params;

  // URL decode the parameters
  team = decodeURIComponent(team);
  database = decodeURIComponent(database);
  page = decodeURIComponent(page);

  const players = await getPlayers(database, team, parseInt(page, 10));

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

      <p className="text-xl text-info font-bold mb-2">Players</p>
      <p>Click on the player name to view their stats.</p>

      <table className="table table-sm table-zebra">
        <thead>
          <tr>
            <th>Player</th>
            <th>Matches Played</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player: any) => (
            <tr key={player.id}>
              <td>
                <a href={`stats/${team}/${player.id}?page=1`}>{player.name}</a>
              </td>
              <td>{player.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const dynamic = "error";
