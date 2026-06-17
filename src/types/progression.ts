export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  rewardExp: number;
  requiredBurnCount: number;
}

export interface PlayerProgress {
  level: number;
  totalExp: number;
  currentLevelExp: number;
  nextLevelExp: number;
  totalBurns: number;
  unlockedAchievementIds: string[];
  title: string;
}

export interface BurnCompletionResult {
  nextPlayer: PlayerProgress;
  unlockedAchievements: AchievementDefinition[];
  gainedExp: number;
}