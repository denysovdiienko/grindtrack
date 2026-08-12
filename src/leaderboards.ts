import type { LeaderboardConfig, LeaderboardPool, Room } from "./types";

const band = (id: string, fromRank: number, toRank: number, amount: number) => ({ id, fromRank, toRank, amount });
const target = (id: string, rank: number, points: number) => ({ id, rank, points });

const findRoom = (rooms: Room[], names: string[]) => rooms.find((room) => room.kind === "room" && names.some((name) => room.name.toLowerCase().replace(/\s/g, "").includes(name)))?.id || "";

export const defaultLeaderboardConfigs = (rooms: Room[]): LeaderboardConfig[] => [
  {
    id: "qqpk", name: "QQPK", roomId: findRoom(rooms, ["qqpk"]), period: "daily", rakebackTiers: [],
    notes: "Current data covers Zoom NL25 only. Add point targets after you collect at least two weeks of daily results.",
    pools: [{ id: "qqpk-nl25", name: "Zoom NL25", limits: ["NL25"], targets: [], prizes: [
      band("qq-1", 1, 1, 64), band("qq-2-5", 2, 5, 42), band("qq-6-8", 6, 8, 30), band("qq-9", 9, 9, 24),
    ] }],
  },
  {
    id: "web3poker", name: "Web3Poker", roomId: findRoom(rooms, ["web3poker", "web3"]), period: "weekly",
    pointsPerRake: 33,
    notes: "Estimated rake uses 33 leaderboard points ≈ €1 rake. Observed targets should be updated as the player pool changes.",
    rakebackTiers: [
      { id: "w-rb-1", minRake: 10, maxRake: 200, percent: 20 },
      { id: "w-rb-2", minRake: 201, maxRake: 400, percent: 25 },
      { id: "w-rb-3", minRake: 401, maxRake: 700, percent: 35 },
      { id: "w-rb-4", minRake: 701, maxRake: 1000, percent: 40 },
      { id: "w-rb-5", minRake: 1001, percent: 45 },
    ],
    pools: [
      { id: "web3-low", name: "NL5–NL10", limits: ["NL5", "NL10"], targets: [target("w-low-1", 1, 12800), target("w-low-2", 2, 11800), target("w-low-3", 3, 10000)], prizes: [
        band("wl-1",1,1,150),band("wl-2",2,2,100),band("wl-3",3,3,75),band("wl-4",4,4,60),band("wl-5",5,5,45),band("wl-6",6,6,30),band("wl-7",7,7,20),band("wl-8",8,8,15),band("wl-9",9,9,15),band("wl-10-12",10,12,10),band("wl-14-19",14,19,7.5),band("wl-20-25",20,25,5),
      ] },
      { id: "web3-high", name: "NL25–NL50", limits: ["NL25", "NL50"], targets: [target("w-high-1",1,38000),target("w-high-2",2,34000),target("w-high-3",3,27000)], prizes: [
        band("wh-1",1,1,450),band("wh-2",2,2,300),band("wh-3",3,3,225),band("wh-4",4,4,180),band("wh-5",5,5,135),band("wh-6",6,6,90),band("wh-7",7,7,60),band("wh-8-9",8,9,45),band("wh-10-13",10,13,30),band("wh-14-19",14,19,22.5),band("wh-20-25",20,25,15),
      ] },
    ],
  },
];

export const rankNumber = (rank?: string) => Number(String(rank || "").match(/\d+/)?.[0] || 0);
export const poolForStake = (pools: LeaderboardPool[], stake?: string) => pools.find((pool) => pool.limits.includes(stake || "") || pool.name === stake);
export const prizeForRank = (pool: LeaderboardPool | undefined, rank: number) => pool?.prizes.find((prize) => rank >= prize.fromRank && rank <= prize.toRank)?.amount || 0;
export const rakebackRate = (config: LeaderboardConfig, rake: number) => config.rakebackTiers.find((tier) => rake >= tier.minRake && (tier.maxRake === undefined || rake <= tier.maxRake))?.percent || 0;
