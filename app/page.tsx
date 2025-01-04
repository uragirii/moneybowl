export default function Content() {
  return (
    <div className="px-4">
      <div className="hero">
        <div className="hero-content text-center">
          <div className="max-w-2xl flex flex-col items-center">
            <h1 className="text-5xl font-bold">SELECT * FROM Cricket</h1>
            <p className="mt-3 max-w-lg">
              <span className="font-bold">Moneybowl:</span> like the movie Moneyball. Master SQL
              while learning interesting facts about cricket.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="m-auto max-w-2xl">
          <div>
            <p className="text-xl text-info font-bold">How it works?</p>
            <ul className="list-none">
              <li className="before:content-['-'] before:mr-2">Select a database</li>
              <li className="before:content-['-'] before:mr-2">
                Study the database schema using the ER diagram
              </li>
              <li className="before:content-['-'] before:mr-2">
                Read the question and submit an SQL query
              </li>
            </ul>
          </div>
          <div className="mt-5">
            <p className="text-xl text-info font-bold">Sample questions?</p>
            <ul className="list-none">
              <li className="before:content-['-'] before:mr-2">
                Players that have played the most number of matches
              </li>
              <li className="before:content-['-'] before:mr-2">
                In which international match was most boundaries scored
              </li>
            </ul>
          </div>
          <div className="mt-5">
            <p className="text-xl text-info font-bold">Available Databases</p>
            <p>
              All databases have the same <span>schema</span> and track teams, players, matches and
              each delivery in the match.
            </p>
            <p className="text-lg font-bold mt-2">
              <a className="link" href="international">
                1. International matches
              </a>
            </p>
            <p>
              The database includes matches played between countries including tournaments like ICC,
              T20 World Cup, etc. Across all formats including T20, ODI and test. A total of{" "}
              <span className="font-bold">6378</span> matches are available, played by{" "}
              <span className="font-bold"> male</span> players, and played between{" "}
              <span className="font-bold">2001-12-19</span> and{" "}
              <span className="font-bold">2024-11-27</span>.
            </p>
            <div className="flex gap-2 mt-1">
              <a href="international">
                <button className="btn btn-xs btn-secondary">Start answering</button>
              </a>
              <a href="international/stats">
                <button className="btn btn-xs btn-outline btn-secondary">View player stats</button>
              </a>
            </div>
            {/* <div className="mt-2">
              <p className="font-bold">Player Stats</p>
              <p>
                Player statistics extracted from this database, such as - total runs, boundaries,
                wickets, total matches played etc. Along with the SQL query used to extract the
                data.
              </p>
              <a href="international">
                <button className="btn btn-xs btn-outline btn-secondary mt-1">View Stats</button>
              </a>
            </div> */}
          </div>
          <div className="mt-5">
            <p className="text-lg font-bold mt-2">
              <a className="link">2. IPL matches</a>
            </p>
            <p>Coming soon!</p>
          </div>
          <div className="mt-5">
            <p className="text-sm text-gray-500">
              The data is provided by{" "}
              <a href="https://cricsheet.org/" target="_blank">
                cricksheet.org
              </a>{" "}
              in JSON format. We then convert it into a SQLite database.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
