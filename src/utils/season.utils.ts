export function getTierFromScore(score: number): number {
  if (score >= 10000) return 5;
  if (score >= 7500) return 4;
  if (score >= 5000) return 3;
  if (score >= 2500) return 2;
  return 1;
}
