export type Currency = "USD" | "EUR";
export type Mode = "tournament" | "cash" | "universal";
export type Tab = "dashboard" | "balances" | "daily" | "rakeback" | "settings";

export type Room = {
  id: string; name: string; kind: "room" | "wallet"; mode: "tournament" | "cash" | "both";
  currency: Currency; startingBalance: number; currentBalance: number;
};
export type TournamentEntry = { roomId: string; tournaments: number; buyIns: number; cashes: number };
export type TournamentDay = { id: string; date: string; duration: number; notes: string; entries: TournamentEntry[] };
export type TournamentDraftRow = { key: string; roomId: string; tournaments: string; buyIns: string; cashes: string };
export type TournamentDraft = { date: string; duration: string; notes: string; rows: TournamentDraftRow[] };
export type CashSession = {
  id: string; date: string; roomId: string; stake: string; hours: number; hands: number;
  tableResult: number; rake: number; lbPoints: number; lbRank: string; lbReward: number;
  rakeback: number; bonuses: number; notes: string;
};
export type CashDraft = {
  date: string; roomId: string; stake: string; hours: string; hands: string;
  tableResult: string; rake: string; lbPoints: string; lbRank: string;
  lbReward: string; rakeback: string; bonuses: string; notes: string;
};
export type UniversalEntry = {
  roomId: string; overallResult: number; cashResult?: number; mttResult?: number;
};
export type UniversalDay = { id: string; date: string; duration: number; notes: string; entries: UniversalEntry[] };
export type UniversalDraftRow = {
  key: string; roomId: string; overallResult: string; cashResult: string; mttResult: string;
};
export type UniversalDraft = { date: string; duration: string; notes: string; rows: UniversalDraftRow[] };
export type Reward = {
  id: string; date: string; roomId: string; mode: Mode; amount: number;
  type: "rakeback" | "bonus" | "leaderboard" | "other"; comment: string;
};
export type AppState = {
  version: 5; profileName: string; rooms: Room[]; tournamentDays: TournamentDay[];
  cashSessions: CashSession[]; universalDays: UniversalDay[]; rewards: Reward[];
  drafts: { tournament: TournamentDraft; cash: CashDraft; universal: UniversalDraft };
};
export type Vault = { salt: string; iv: string; cipher: string };
export type StoredVault = { id: string; name: string; vault: Vault };
