export const calculateReward = (score: number, games: number): number => {
  // Simple example: 1 coin per 10 score, +5 per game
  return Math.floor(score / 10) + games * 5;
};
