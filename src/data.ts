import type { AppState, Currency, Room, Vault } from "./types";

export const VAULT_KEY = "grindtrack-private-vault-v1";
export const today = new Date().toISOString().slice(0, 10);
export const uid = () => crypto.randomUUID();
export const num = (value: FormDataEntryValue | null) => Number(value || 0);

const to64 = (bytes: Uint8Array) => { let binary = ""; bytes.forEach((byte) => binary += String.fromCharCode(byte)); return btoa(binary); };
const from64 = (value: string) => Uint8Array.from(atob(value), (char) => char.charCodeAt(0));

export async function deriveKey(pin: string, salt: Uint8Array) {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(pin), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: 250_000, hash: "SHA-256" }, material,
    { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"],
  );
}
export async function encryptState(state: AppState, key: CryptoKey, salt: Uint8Array): Promise<Vault> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(JSON.stringify(state)));
  return { salt: to64(salt), iv: to64(iv), cipher: to64(new Uint8Array(cipher)) };
}
export async function decryptState(vault: Vault, pin: string) {
  const salt = from64(vault.salt); const key = await deriveKey(pin, salt);
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: from64(vault.iv) }, key, from64(vault.cipher));
  return { state: JSON.parse(new TextDecoder().decode(plain)) as AppState, key, salt };
}

const baseRooms = (): Room[] => [
  { id: uid(), name: "PokerStars", kind: "room", mode: "both", currency: "USD", startingBalance: 0, currentBalance: 0 },
  { id: uid(), name: "GGPoker", kind: "room", mode: "both", currency: "USD", startingBalance: 0, currentBalance: 0 },
  { id: uid(), name: "CoinPoker", kind: "room", mode: "both", currency: "USD", startingBalance: 0, currentBalance: 0 },
  { id: uid(), name: "Wallet", kind: "wallet", mode: "both", currency: "EUR", startingBalance: 0, currentBalance: 0 },
];
export const emptyState = (name: string): AppState => ({ version: 1, profileName: name, rooms: baseRooms(), tournamentDays: [], cashSessions: [], rewards: [] });

export function demoState(): AppState {
  const rooms: Room[] = [
    { id: "stars", name: "PokerStars", kind: "room", mode: "both", currency: "USD", startingBalance: 4200, currentBalance: 5938 },
    { id: "gg", name: "GGPoker", kind: "room", mode: "both", currency: "USD", startingBalance: 3000, currentBalance: 4481 },
    { id: "coin", name: "CoinPoker", kind: "room", mode: "both", currency: "USD", startingBalance: 1800, currentBalance: 2145 },
    { id: "fortuna", name: "Fortuna", kind: "room", mode: "tournament", currency: "EUR", startingBalance: 900, currentBalance: 1134 },
    { id: "wallet", name: "Main wallet", kind: "wallet", mode: "both", currency: "EUR", startingBalance: 2500, currentBalance: 3100 },
  ];
  const dates = ["2026-08-03", "2026-08-04", "2026-08-05", "2026-08-07", "2026-08-08", "2026-08-10"];
  const results = [[680,1240],[540,310],[910,420],[760,1850],[420,90],[1120,1740]];
  return { version: 1, profileName: "Denys", rooms,
    tournamentDays: dates.map((date, i) => ({ id: uid(), date, duration: 7 + i % 3, notes: i === 3 ? "Good focus, late finish on Stars." : "", entries: [
      { roomId: "stars", tournaments: 18 + i, buyIns: results[i][0], cashes: results[i][1] },
      { roomId: "gg", tournaments: 9 + i, buyIns: Math.round(results[i][0] * .55), cashes: Math.round(results[i][1] * .4) },
    ] })),
    cashSessions: [
      { id: uid(), date: "2026-08-06", roomId: "coin", stake: "NL25", hours: 5.5, hands: 3240, tableResult: 186, rake: 94, lbPoints: 1220, lbRank: "18", lbReward: 35, rakeback: 28, bonuses: 0, notes: "Solid A-game." },
      { id: uid(), date: "2026-08-09", roomId: "gg", stake: "NL50", hours: 6.2, hands: 4110, tableResult: -74, rake: 161, lbPoints: 1840, lbRank: "31", lbReward: 45, rakeback: 40, bonuses: 15, notes: "Review river calls." },
      { id: uid(), date: "2026-08-10", roomId: "coin", stake: "NL25", hours: 4.1, hands: 2580, tableResult: 132, rake: 70, lbPoints: 940, lbRank: "22", lbReward: 30, rakeback: 21, bonuses: 0, notes: "" },
    ], rewards: [
      { id: uid(), date: "2026-08-05", roomId: "stars", mode: "tournament", amount: 85, type: "rakeback", comment: "Weekly challenge" },
      { id: uid(), date: "2026-08-10", roomId: "gg", mode: "tournament", amount: 120, type: "leaderboard", comment: "Daily leaderboard" },
    ] };
}

export const money = (value: number, currency: Currency = "USD") => new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(value || 0);
export const signed = (value: number, currency: Currency = "USD") => `${value > 0 ? "+" : ""}${money(value, currency)}`;
export const percent = (value: number) => `${Number.isFinite(value) ? value.toFixed(1) : "0.0"}%`;
export const roomCurrency = (rooms: Room[], id: string) => rooms.find((room) => room.id === id)?.currency ?? "USD";
export const roomName = (rooms: Room[], id: string) => rooms.find((room) => room.id === id)?.name ?? "Deleted room";
export const bigBlind = (stake: string) => Number(stake.replace(/[^0-9.]/g, "")) / 100 || 0;
