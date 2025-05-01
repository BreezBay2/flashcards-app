# Flashcards

Flashcards is an app that can help you learn and remember information by studying with flashcards. Create decks with cards and test yourself. Three different studying methods are provided:
1. Test yourself whenever you want.
2. Test yourself once per day.
3. Anki-style Spaced Repetition.

### Technologies used in this project:
- Tech Stack: React, Node.js, Express, Prisma, PostgreSQL
- User Authentication with JSON Web Token (JWT)
- Data Fetching, Caching & Updating with TanStack React Query

## Project Setup

### Setup .env file

```
PORT={Port to run the project on}
JWT={JSON Web Token Secret Key}
NODE_ENV=...
DATABASE_URL={Your Postgres Database URL}
```

### Build app

```
npm run build
```

### Start app

```
npm start
```

# The SM-2 Algorithm

This app uses a simplified and slightly modified version of the SM-2 spaced repetition algorithm. The algorithm uses a **Quality Score** (0-5), based on how easily the user recalls an answer, to update the card’s **Ease Factor** — a measure of how easily the user remembers that card over time (it starts at 2.5) — and recalculates the **Interval**, which determines the next review date. This dynamic adjustment ensures that well-remembered material is reviewed less often, while more difficult material receives more frequent reinforcement. However, to keep things as simple as possible, this app provides only two values to assess the quality score. The first 3 successful reviews also set predetermined intervals and do not adjust the ease factor (a kind of learning phase).

## How the values are calculated
### Interval Recalculation:
```math
\text{New Interval}=\text{Previous Interval} \cdot \text{Ease Factor}
```

### Ease Factor Adjustment:
```math
\text{New Ease Factor}=\text{Previous Ease Factor} + (0.1 - (5 - \text{Quality}) \cdot (0.08 + (5 - \text{Quality}) \cdot 0.02))
```

### Fuzz
This app uses a random interval fuzz to combat the clumping of cards. It randomizes slightly (±5-15%) to prevent a bunch of reviews from landing on the same day and spread them out a little bit.
```math
\text{Fuzz Factor}=0.05 + x \cdot 0.1 \quad \text{} \text{} \text{} \text{where} \text{} \text{} \text{} \quad x\sim\mathcal{U}(0,1)
```
```math
\text{Final Interval}=\text{Interval} - \text{Interval} \cdot \text{Fuzz Factor} \cdot \pm1
```
