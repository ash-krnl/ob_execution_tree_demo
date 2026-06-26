# OpenBox Agent Logs Demo

A Vite + React app that renders a live workflow execution tree for an OpenBox agent — grouped by session, with expandable nodes, span traces, and JSON metadata viewers.

## Prerequisites

- Node.js 18+
- An OpenBox account with an agent already configured

## Setup

**1. Clone and install**

```bash
npm install
```

**2. Create your environment file**

```bash
cp .env.example .env
```

**3. Fill in `.env`**

```env
VITE_API_TOKEN=obx_key_...
VITE_AGENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### Getting your API key

1. Go to your OpenBox dashboard
2. Navigate to **Organization → API Keys**
3. Create a new key with the **Agent Log Read** permission
4. Copy the key into `VITE_API_TOKEN`

### Getting your Agent ID

Open the agent you want to monitor in the OpenBox dashboard. The agent ID is in the URL:

```
https://app.openbox.ai/agents/142e6819-df96-4afe-88fb-df2dc7a3ec01
                                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

Copy it into `VITE_AGENT_ID`.

## Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## What you'll see

| Element | Description |
|---|---|
| **Session dropdown** | Lists all sessions for the agent, newest first. Switch sessions to view a different execution. |
| **Workflow Execution Tree** | Hierarchical view of every event in the selected session — click any row to expand it. |
| **Spans** | Activity events with spans show nested span rows. Click a span to view its input data. |
| **Signal Args / Metadata** | `SignalReceived` events show the raw prompt and metadata in separate panels. |
| **Tree / Pretty / Raw** | Three views for JSON payloads — interactive tree, syntax-highlighted, or plain text. |
| **Stats bar** | Per-session summary: signal count, LLM calls, tool executions, valid events, completion status. |

## Build for production

```bash
npm run build
npm run preview
```
