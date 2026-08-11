export type Currency = "USD" | "EUR";
export type Mode = "tournament" | "cash";
export type Tab = "dashboard" | "balances" | "daily" | "rakeback" | "settings";

export type Room = {
  id: string; name: string; kind: "room" | "wallet"; mode: Mode | "both";
  currency: Currency; startingBalance: number; currentBalance: number;
};
export type TournamentEntry = { roomId: string; tournaments: number; buyIns: number; cashes: number };
export type TournamentDay = { id: string; date: string; duration: number; notes: string; entries: TournamentEntry[] };
export type CashSession = {
  id: string; date: string; roomId: string; stake: string; hours: number; hands: number;
  tableResult: number; rake: number; lbPoints: number; lbRank: string; lbReward: number;
  rakeback: number; bonuses: number; notes: string;
};
export type Reward = {
  id: string; date: string; roomId: string; mode: Mode; amount: number;
  type: "rakeback" | "bonus" | "leaderboard" | "other"; comment: string;
};
export type AppState = {
  version: 1; profileName: string; rooms: Room[]; tournamentDays: TournamentDay[];
  cashSessions: CashSession[]; rewards: Reward[];
};
export type Vault = { salt: string; iv: string; cipher: string };
