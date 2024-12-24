export type Score = {
  [database: string]:
    | {
        [level: number]: Array<string>; // IDs of question answered
      }
    | undefined;
};
