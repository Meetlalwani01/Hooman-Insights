# Hooman Insights Dashboard

A polished, production-ready dashboard for exploring call conversation metrics. Built with Next.js, TypeScript, MobX-State-Tree, Tailwind CSS, and Recharts.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Development](#development)
6. [Production](#production)
7. [Project Structure](#project-structure)

---

## Features

* Date Range Filter (From / To)
* Agent & Status Filters (multi-select)
* KPI Cards for seven metrics: Total Calls, Success Rate, Avg. Duration, Cost/Min, LLM Latency, TTS Latency, Interruptions/Min
* Responsive Pie Chart for Status Distribution
* Responsive Bar Chart for Cost/Min by Agent
* Glass-morphism UI, dark gradient theme, hover effects
<img width="1461" alt="image" src="https://github.com/user-attachments/assets/10c1c53c-68b5-4120-9d09-bad9162d7f31" />
<img width="928" alt="image" src="https://github.com/user-attachments/assets/c37f5278-66e0-464b-8b20-ca719e0b8064" />
<img width="835" alt="image" src="https://github.com/user-attachments/assets/a106a5a5-5701-4396-a69e-5e9fb4fff149" />


---

## Tech Stack

* Next.js (v15+) + TypeScript
* MobX-State-Tree
* Tailwind CSS
* Recharts

---

## Prerequisites

* Node.js v16+
* npm v8+

```bash
node -v
npm -v
```

---

## Installation

```bash
git clone https://github.com/your-username/hooman-insights.git
cd hooman-insights
npm install
```

---

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
API endpoint: [http://localhost:3000/api/conversations](http://localhost:3000/api/conversations)

---

## Production

```bash
npm run build
npm start
```

---

## Project Structure

```
hooman-insights/
├── next.config.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── README.md
├── design.md
└── src/
    ├── app/
    │   ├── api/
    │   │   └── conversations/route.ts
    │   └── page.tsx
    ├── data/
    │   └── conversations.json
    └── models/
        ├── Conversation.ts
        └── RootStore.ts
```


