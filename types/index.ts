export type Score = {
  [database: string]:
    | {
        [level: number]: Array<string>; // IDs of question answered
      }
    | undefined;
};

export type Question = {
  id: string;
  question: string;
  level: number;
  hint?: string;
  /** The SQL string to generate the correct result */
  sql: string;
  /** Interesting information shown to the user after giving the correct answer */
  titbit?: string;
  resultSchema: string[][]; // [columnNames, ...rows]
  hidden?: boolean;
};

export type Questions = Array<Question>;
