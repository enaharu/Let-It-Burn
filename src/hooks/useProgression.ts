import { useCallback, useEffect, useState } from "react";
import type {
  AchievementDefinition,
  BurnCompletionResult,
  PlayerProgress,
} from "../types/progression";

const STORAGE_KEY = "let-it-burn-player";
const BASE_BURN_EXP = 10;

const LEVEL_THRESHOLDS = [0, 100, 500, 1000, 2000, 5000] as const;

const TITLES: Record<number, string> = {
  1: "感情の旅人",
  2: "感情整理見習い",
  3: "感情整理人",
  4: "炎と向き合う者",
  5: "心の掃除人",
  6: "静かな浄化師",
};

const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "first-release",
    name: "初めての手放し",
    description: "初めて燃焼完了した",
    rewardExp: 20,
    requiredBurnCount: 1,
  },
  {
    id: "emotion-apprentice",
    name: "感情整理見習い",
    description: "累計5回燃焼",
    rewardExp: 50,
    requiredBurnCount: 5,
  },
  {
    id: "flame-regular",
    name: "炎の常連",
    description: "累計10回燃焼",
    rewardExp: 100,
    requiredBurnCount: 10,
  },
  {
    id: "emotion-cleaner",
    name: "感情の掃除人",
    description: "累計25回燃焼",
    rewardExp: 200,
    requiredBurnCount: 25,
  },
  {
    id: "heart-purifier",
    name: "心の浄化師",
    description: "累計50回燃焼",
    rewardExp: 300,
    requiredBurnCount: 50,
  },
];

const computeLevelFromExp = (totalExp: number) => {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i += 1) {
    if (totalExp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    }
  }

  const currentThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 500;

  return {
    level,
    currentLevelExp: Math.max(0, totalExp - currentThreshold),
    nextLevelExp: Math.max(1, nextThreshold - currentThreshold),
  };
};

const createProgress = (
  totalExp: number,
  totalBurns: number,
  unlockedAchievementIds: string[]
): PlayerProgress => {
  const levelState = computeLevelFromExp(totalExp);
  return {
    level: levelState.level,
    totalExp,
    totalBurns,
    currentLevelExp: levelState.currentLevelExp,
    nextLevelExp: levelState.nextLevelExp,
    unlockedAchievementIds,
    title: TITLES[levelState.level] ?? "感情の探究者",
  };
};

const getInitialProgress = (): PlayerProgress =>
  createProgress(0, 0, []);

const hydrateProgress = (): PlayerProgress => {
  if (typeof window === "undefined") {
    return getInitialProgress();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return getInitialProgress();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<PlayerProgress>;
    const totalExp = typeof parsed.totalExp === "number" ? parsed.totalExp : 0;
    const totalBurns = typeof parsed.totalBurns === "number" ? parsed.totalBurns : 0;
    const unlockedAchievementIds = Array.isArray(parsed.unlockedAchievementIds)
      ? parsed.unlockedAchievementIds.filter((id): id is string => typeof id === "string")
      : [];

    return createProgress(totalExp, totalBurns, unlockedAchievementIds);
  } catch {
    return getInitialProgress();
  }
};

export function useProgression() {
  const [player, setPlayer] = useState<PlayerProgress>(() => hydrateProgress());

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
  }, [player]);

  const onBurnCompleted = useCallback((): BurnCompletionResult => {
    const nextBurnCount = player.totalBurns + 1;
    const unlockedSet = new Set(player.unlockedAchievementIds);

    const newlyUnlocked = ACHIEVEMENTS.filter((achievement) => {
      if (unlockedSet.has(achievement.id)) {
        return false;
      }
      return nextBurnCount >= achievement.requiredBurnCount;
    });

    newlyUnlocked.forEach((achievement) => {
      unlockedSet.add(achievement.id);
    });

    const achievementExp = newlyUnlocked.reduce(
      (sum, achievement) => sum + achievement.rewardExp,
      0
    );

    const gainedExp = BASE_BURN_EXP + achievementExp;
    const nextPlayer = createProgress(
      player.totalExp + gainedExp,
      nextBurnCount,
      [...unlockedSet]
    );

    setPlayer(nextPlayer);

    return {
      nextPlayer,
      unlockedAchievements: newlyUnlocked,
      gainedExp,
    };
  }, [player]);

  return {
    player,
    onBurnCompleted,
  };
}