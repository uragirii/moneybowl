export default function Content() {
  return (
    <>
      <div className="hero">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">SELECT * FROM Cricket</h1>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="m-auto max-w-md">
          <div>
            <p className="text-xl text-info font-bold">Here's how it works?</p>
            <ul className="list-none">
              <li className="before:content-['-'] before:mr-2">
                Select a database
              </li>
              <li className="before:content-['-'] before:mr-2">
                Go through the ER diagram
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
              All databases have the same <span>schema</span> and track teams,
              players, matches and each delivery in the match.
            </p>
            <p className="text-lg font-bold mt-2">
              <a className="link" href="international">
                1. International matches
              </a>
            </p>
            <p>
              The database includes matches played between countries including
              tournaments like ICC, T20 World Cup, etc. A total of{" "}
              <span className="font-bold">8359</span> matches are available,
              played by both
              <span className="font-bold"> male</span> and{" "}
              <span className="font-bold">female</span> players.
            </p>
          </div>
          <div className="mt-5">
            <p className="text-lg font-bold mt-2">
              <a className="link">2. IPL matches</a>
            </p>
            <p>Coming soon!</p>
          </div>
        </div>
      </div>
    </>
  );
}
