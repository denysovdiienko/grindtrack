# GrindTrack

A private, local-first bankroll and performance journal for online poker grinders.

## What it tracks

- Tournament daily totals by poker room, with automatic ABI, ROI, and $/MTT
- Cash sessions with stakes, hands, hours, rake, leaderboard rewards, bb/100, and $/hour
- USD and EUR balances across poker rooms and wallets
- Rakeback, bonuses, cumulative results, and encrypted backup/restore

Each browser creates its own AES-GCM encrypted vault. No poker records are uploaded to GitHub or shared between players.

## Development

```bash
pnpm install
pnpm dev
```

The `main` branch deploys automatically to GitHub Pages.
