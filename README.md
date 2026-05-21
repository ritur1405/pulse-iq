# PulseIQ — Enterprise AI Product Intelligence Platform

PulseIQ is an ultra-premium, high-fidelity AI-driven product intelligence platform designed to synthesize unstructured customer feedback, surveys, support tickets, and voice recordings into real-time prioritized decisions. 

By rejecting stateless "single-prompt" GPT wrappers, PulseIQ implements a highly auditable, hybrid deterministic-semantic processing pipeline powered by **Cascadeflow** and a version-aware contextual memory engine powered by **Hindsight**.

---

## 🚀 Key Features

* **Gated Workspace Authentication**: Glassmorphic, state-persisted Login & Create Account flows customized for corporate org structures.
* **Cascadeflow AI Orchestration**: A visual 10-node execution pipeline processing raw customer comments step-by-step with real-time streaming console logs ("Linguistic Shell").
* **Hindsight Version Memory**: Pinned release tracker auditing satisfaction trends, sentiment shifts, and multi-week bottleneck streaks across versions (`v1.8` to `v2.2`).
* **Voice-to-Insight Transcription**: Interactive audio waveform canvas mimicking real-time customer voice intake.
* **Analytics & Trend Hub**: Recharts-powered sentiment valence pie charts, issue category distributions, and competitor feedback comparisons.
* **Executive Report Builder**: Stakeholder PDF/JSON summary compiler with urgency filtering tools for product ops teams.

---

## 🛠️ Technology Stack

* **Frontend Framework**: Next.js (App Router, TypeScript)
* **Styling Engine**: Tailwind CSS v4 (Modern HSL system, ambient dark glows, custom scrollbars)
* **Animation Core**: Framer Motion
* **Visualization Layer**: Recharts (with Hydration Guard)
* **Icons Library**: Lucide React

---

## 📐 Architecture & Telemetry Flow

PulseIQ splits feedback processing into two decoupled systems:

```
[Raw User Feedback]
       │
       ▼ (Ingests unstructured text or raw audio wavs)
 ┌───────────┐
 │ 10-Stage  │ ─ ─ ─ ▶ [Linguistic Shell Terminal Logs]
 │ Pipeline  │          (Real-time diagnostic telemetry)
 └───────────┘
       │
       ▼ (Generates clean, categorized structured JSON)
 ┌───────────┐
 │ Hindsight │ ─ ─ ─ ▶ [Version Memory Store]
 │ Engine    │          (Calculates sentiment drift & streaks)
 └───────────┘
       │
       ▼
 [Executive Decision Briefings & AI Suggestions]
```

---

## ⚙️ Quick Start Installation

Follow these steps to spin up the local development console on your machine:

### 1. Clone & Install Dependencies
Ensure you have Node.js (v18+) installed. Clone the repository and install packages:
```bash
npm install
```

### 2. Launch Development Server
Start the local server with hot reloading:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the console.

### 3. Build for Production
To build a highly optimized, static production bundle:
```bash
npm run build
```

---

## 📂 Project Structure

```
├── src/
│   ├── app/                # Next.js App Router (Layouts, Global Styles)
│   ├── components/         # Core UI Panels (Auth, Home, Workflows, Timelines)
│   ├── lib/                # Orchestration & Memory Engines
│   │   ├── cascadeflow.ts  # 10-stage processing logic
│   │   └── hindsight.ts    # Version drift & comparison memory
│   └── docs/               # Next.js workspace specifications
├── public/                 # Static media and assets
├── AGENTS.md               # AI assistant code guidelines
└── README.md               # System overview and manuals
```

---

## 📄 License

This project is proprietary and custom-tailored as an Enterprise AI telemetry showcase. All rights reserved.
