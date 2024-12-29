import { useEffect, useMemo, useState } from "react";
import { useAtomValue } from "jotai";

import { Question, Questions } from "@/types";
import { scoreboardAtom } from "@/atoms/scoreboard";

interface UseQuestionsPros {
  questions: Questions;
  database: string;
}

/** Selects a question based on an algorithm. Factoring in previous score */
export function useQuestions({ questions, database }: UseQuestionsPros) {
  const scoreboard = useAtomValue(scoreboardAtom);

  const calculateStartingLevel = () => {
    if (!scoreboard) return 0;

    const score = scoreboard[database];
    if (!score) return 0;

    let questionCount = {} as Record<number, number>; // Count of questions at each level
    for (const { level } of questions) {
      questionCount[level] = questionCount[level]
        ? questionCount[level] + 1
        : 1;
    }
    questionCount = Object.fromEntries(Object.entries(questionCount).sort());

    let answerCount = {} as Record<number, number>; // Count of questions answered at each level
    for (const level in score) {
      answerCount[level] = score[level].length;
    }
    answerCount = Object.fromEntries(
      Object.entries(answerCount).sort().reverse(),
    );

    // Calculate the percent of questions answers at each level
    // If for a given level less than 70% of questions have been answered, return that level
    for (const level in questionCount) {
      const percentAnswered =
        (answerCount[level] ?? 0) / (questionCount[level] ?? Number.MAX_VALUE);
      if (percentAnswered < 0.7) {
        return Number(level);
      }
    }

    return 0;
  };

  const availableLevels = useMemo(
    () => [...new Set(questions.map((q) => q.level))].sort((a, b) => a - b),
    [],
  );

  const [level, setLevel] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  const loadQuestion = (_level?: number) => {
    _level = _level ?? level;
    if (level !== _level) {
      setLevel(_level);
    }

    // Get all available levels in questions
    const availableLevels = [...new Set(questions.map((q) => q.level))].sort(
      (a, b) => a - b,
    );

    if (availableLevels.length === 0) return null;

    // Filter out previously answered questions if possible
    const answeredQuestions = Object.values(
      scoreboard?.[database] ?? {},
    ).flat();

    // Find questions at target level and adjacent levels
    const getQuestionsAtLevel = (l: number) =>
      questions
        .filter((q) => q.level === l)
        .filter((q) => q.id !== currentQuestion?.id)
        .filter((q) => !answeredQuestions.includes(q.id));

    const targetLevelQuestions = getQuestionsAtLevel(_level);
    const lowerLevelQuestions = getQuestionsAtLevel(_level - 1);
    const higherLevelQuestions = getQuestionsAtLevel(_level + 1);

    // Combine questions with priority (target level, then adjacent levels)
    let availableQuestions: Question[] = [];

    if (targetLevelQuestions.length > 0) {
      availableQuestions = targetLevelQuestions;
    } else if (
      lowerLevelQuestions.length > 0 ||
      higherLevelQuestions.length > 0
    ) {
      // Prefer questions closer to target level
      availableQuestions = [...lowerLevelQuestions, ...higherLevelQuestions];
    } else {
      // If no questions at target or adjacent levels, find the closest level
      const closestLevel = availableLevels.reduce((closest, current) =>
        Math.abs(current - _level) < Math.abs(closest - _level)
          ? current
          : closest,
      );
      availableQuestions = getQuestionsAtLevel(closestLevel);
    }

    console.log({
      availableQuestions,
      answeredQuestions,
    });

    // If all questions have been answered, use all available questions
    if (availableQuestions.length === 0) {
      setCurrentQuestion(null);
      return null;
    }

    // Select a random question from available questions
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[randomIndex];

    setCurrentQuestion(selectedQuestion);
    return selectedQuestion;
  };

  useEffect(() => {
    const startingLevel = calculateStartingLevel();
    loadQuestion(startingLevel);
    // TESTING: setCurrentQuestion(questions.find((q) => q.id === "9")!);
  }, []);

  return {
    loadQuestion,
    currentQuestion,
    levels: availableLevels,
  };
}
