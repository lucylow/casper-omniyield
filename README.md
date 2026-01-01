**OmniYield Nexus — Casper Cross-Chain Yield Optimizer**
========================================================


**1\. Overview & Goals**
------------------------

**OmniYield Nexus** (a.k.a. _Casper Cross-Chain Yield Optimizer_) is a Casper-hosted protocol that enables users to deposit native Casper (CSPR) into a secure vault on Casper and receive a synthetic, transferable token omniYLD (CEP-18) that represents a share of a cross-chain, auto-rebalanced yield portfolio.

The protocol separates concerns:

*   **Casper** = secure _coordination hub_ (on-chain accounting, mint/burn, event emission).
    
*   **Adapters / Relayers** = off-chain components responsible for packing envelopes and interacting with external chains (or simulators for MVP).
    
*   **Satellite Vaults** = per-chain minimal contracts (or off-chain processes) that accept bridged value or simulated deposits and execute yield strategies.
    
*   **Frontend** = CSPR.click integration for smooth wallets & onboarding.
    
*   **Backend** = Sidecar/SSE + WebSocket bridge for live UX and monitoring.
    

**Primary goals**

*   Demonstrate cross-chain _interoperability primitives_ (deterministic payload\_hash events, bridge-ready envelopes).
    
*   Provide an MVP with a Casper Testnet deployed vault, Sidecar streaming of events, a simulator for cross-chain relays, and a demo dashboard to visualize message lifecycle.
    
*   Keep contract logic minimal & auditable (tokenization, mint/burn, accounting), with heavy lifting (rebalancing decisions & cross-chain interactions) handled by off-chain services and emitters.
    

**2\. High-level Architecture**
-------------------------------

### **Mermaid diagram — System overview**

flowchart LR

  subgraph USER

    A\[Wallet - CSPR.click\]

  end

  subgraph CASPER

    V\[OmniYield Vault (Odra)\]

    T\[omniYLD CEP-18 token (Odra module)\]

    S\[StrategyManager (Odra)\]

    SC\[Sidecar SSE\]

  end

  subgraph BACKEND

    B\[Backend Event Bridge (Node.js)\]

    SIM\[Simulator / Adapter\]

    WS\[WebSocket / UI feed\]

  end

  subgraph SATELLITE

    E1\[Satellite Vault - Ethereum ( /Goerli)\]

    E2\[Satellite Vault - Polygon ( )\]

  end

  A -->|Deposit CSPR| V

  V -->|mint omniYLD| T

  V -->|emit CrossChainMessage(payload\_hash)| S

  S --> SC

  SC --> B

  B -->|push| WS

  B -->|forward envelope| SIM

  SIM --> E1

  SIM --> E2

  E1 -->|returns accruals| B

  E2 -->|returns accruals| B

  B -->|aggregate| V

**Key flows**

1.  **User Deposit:** wallet → Casper Vault (native transfer attached to deploy).
    
2.  **Lock & Mint:** Vault locks CSPR and mints omniYLD CEP-18 tokens 1:1 (MVP) to user.
    
3.  **Emit Message:** StrategyManager emits CrossChainMessage event containing deterministic payload\_hash (hash of amount || user || ts plus metadata). Event is persisted on Casper and available via Sidecar SSE / CSPR.cloud streaming.
    
4.  **Relay / Adapter:** Backend or relayer listens to Sidecar events for the Vault contract hash; when a CrossChainMessage arrives, the adapter packages an envelope containing header|body|proof and forwards to the target chain(s) (for MVP: simulator sends to   satellite vaults).
    
5.  **Satellite Execution:** Satellite executes strategies (staking/lending) and returns an accrual report to Casper via the adapter (or simulated return).
    
6.  **Aggregate & Redeem:** On Casper, aggregator updates accounting (or the Vault reads accrual reports) and users burn omniYLD to redeem native CSPR + yield.
    

**3\. Component Breakdown**
---------------------------

### **Contracts (on Casper)**

*   **OmniYieldVault (Odra module)**
    
    *   deposit() — payable entrypoint, locks attached CSPR and creates ledger entry. Emits DepositReceived event.
        
    *   mintOmniYLD(owner, amount) — mints CEP-18 tokens (or use odra-modules Cep18). Emits SyntheticMinted.
        
    *   redeem(amount) — burns omniYLD and performs native transfer back to caller (respecting safety rules). Emits Redeem.
        
*   **StrategyManager (Odra)**
    
    *   emit\_cross\_chain(dest\_chain, action, amount, user) — compute deterministic payload\_hash and emit CrossChainMessage event.
        
*   **Optional modules:** AccessControl, TimeLock, Pauser, CircuitBreaker.
    

### **Backend Services**

*   **Sidecar / SSE Consumer** (Node.js)
    
    *   Connects to https://node.testnet.cspr.cloud/events or wss://streaming.testnet.cspr.cloud
        
    *   Filters by contract hash (Vault contract hash) and CrossChainMessage events.
        
    *   Broadcasts to frontend via internal WebSocket channel project:.
        
    *   Persists event history, and creates a bridge envelope (signed proof) for the adapter.
        
*   **Adapter / Simulator**
    
    *   For MVP: simulator consumes envelopes and invokes   Satellite Vaults on testnets (e.g., Sepolia, Goerli).
        
    *   Production: adapter implements handshake with real bridges (LayerZero, CCIP) or L2 bridges.
        
*   **Aggregator / Reconciler**
    
    *   Receives accrual reports from satellites and aggregates yields on Casper (via a submit action or via dropping events the Vault picks up).
        

### **Frontend**

*   **React + Typescript**
    
    *   CSPR.click provider for wallet aggregation (social login + multiple Casper wallets).
        
    *   Live dashboard with WebSocket feed showing events and cross-chain animation.
        
    *   Deposit UI that triggers a Casper deploy using casper-js-sdk or CSPR.click proxy.
        

**4\. Smart Contract Design (Odra)**
------------------------------------

### **Project structure (recommended)**

omniyield/

├─ Cargo.toml

├─ Odra.toml

├─ src/

│  ├─ lib.rs

│  ├─ events.rs

│  ├─ errors.rs

│  └─ modules/

│     ├─ vault.rs

│     ├─ synthetic\_token.rs

│     ├─ strategy.rs

│     ├─ access\_control.rs

│     └─ timelock.rs

├─ src/bin/

│  └─ omniyield\_livenet.rs

└─ tests/

   └─ odra\_vm.rs

### **Example: Event definitions (src/events.rs)**

use odra::prelude::\*;

use odra::types::U512;

#\[odra::event\]

pub struct DepositReceived {

    pub sender: Address,

    pub amount: U512,

}

#\[odra::event\]

pub struct SyntheticMinted {

    pub owner: Address,

    pub amount: U512,

}

#\[odra::event\]

pub struct CrossChainMessage {

    pub source\_chain: String,

    pub destination\_chain: String,

    pub payload\_hash: String,

}

#\[odra::event\]

pub struct YieldHarvested {

    pub beneficiary: Address,

    pub amount: U512,

}

### **Example: Vault deposit (simplified)**

#\[odra::module\]

pub struct Vault {

    deposits: Mapping,

    total\_locked: Var,

    // ... submodules

}

#\[odra::module\]

impl Vault {

    #\[odra(init)\]

    pub fn init(&mut self) { self.total\_locked.set(U512::zero()); }

    #\[odra(payable)\]

    pub fn deposit(&mut self) {

        let caller = self.env().caller();

        let amount = self.env().attached\_value();

        let current = self.deposits.get(&caller).unwrap\_or(U512::zero());

        self.deposits.set(&caller, current + amount);

        self.total\_locked.set(self.total\_locked.get() + amount);

        DepositReceived { sender: caller, amount }.emit();

    }

}

### **Deterministic payload\_hash computation**

We use blake2b (or odra::hash::blake2b) to compute a canonical payload hash:

payload\_hash = blake2b(serialize(amount) || user\_address\_bytes || u64\_to\_bytes(timestamp) || action\_bytes)

Store / emit only that payload\_hash on chain—this produces a small, verifiable on-chain receipt that the backend and remote chains can reference.

**5\. Event schema, payload\_hash & envelope spec**
---------------------------------------------------

### **CrossChainMessage event (on-chain)**

{

  "event": "CrossChainMessage",

  "source\_chain": "casper",

  "destination\_chain": "ethereum",

  "payload\_hash": "0xabc123...",

  "meta": {

    "entrypoint": "emit\_cross\_chain",

    "contract\_hash": "hash-omni-..."

  },

  "timestamp": 1735001700000

}

### **Message envelope (off-chain adapter payload)**

The adapter constructs an envelope with three sections:

Envelope {

  Header {

    source\_chain,

    source\_contract,

    timestamp

  }

  Body {

    action, // e.g., "deposit"

    asset, // "CSPR"

    amount, // in motes

    recipient, // account hash on target chain

    extra\_meta // optional

  }

  Proof {

    payload\_hash, // as emitted on Casper

    adapter\_signature, // signature by adapter private key

    merkle\_proof // optional when necessary

  }

}

**Payload hash equation (pseudocode)**

payload\_bytes = concat(U512\_to\_bytes(amount), account\_bytes(user), u64\_to\_bytes(ts), action\_bytes)

payload\_hash = blake2b(payload\_bytes)

Adapter signs the payload\_hash and includes signature in Proof.signature. This gives the target chain a verifiable binding to the original Casper event.

**6\. Backend — Sidecar / CSPR.cloud & WebSocket bridge**
---------------------------------------------------------

### **Requirements**

*   Node.js (v20+ recommended)
    
*   eventsource or ws for SSE/WebSocket consumption and broadcasting
    
*   Optional persistence (Postgres / SQLite) to store event history
    

### **Example architecture (mermaid)**

sequenceDiagram

  participant Sidecar as Sidecar SSE

  participant Bridge as Backend Bridge

  participant Adapter as Adapter/Simulator

  participant WS as WS (UI)

  Sidecar->>Bridge: Event(CrossChainMessage)

  Bridge->>Bridge: Filter(contract\_hash)

  Bridge->>Bridge: Persist(event)

  Bridge->>WS: Broadcast channel:project:proj-001

  Bridge->>Adapter: Build envelope + sign

  Adapter->>Satellite: send envelope

  Satellite->>Adapter: reply accruals

  Adapter->>Bridge: return report

  Bridge->>Vault: submit harvest report via deploy (optional)

### **Minimal backend listener snippet (TypeScript)**

// sidecarListener.ts

import EventSource from "eventsource";

import { broadcastToProject } from "./ws";

const sidecarUrl = process.env.CSPR\_EVENTS\_URL || "https://node.testnet.cspr.cloud/events";

const CONTRACT\_HASH = process.env.OMNIYIELD\_CONTRACT\_HASH;

const es = new EventSource(sidecarUrl);

es.onmessage = (e) => {

  try {

    const parsed = JSON.parse(e.data);

    // crude filter: look for contract\_hash

    if (JSON.stringify(parsed).includes(CONTRACT\_HASH)) {

      // parse event (depends on Sidecar shape)

      broadcastToProject(parsed);

      // persist, enqueue, or forward to adapter as needed

    }

  } catch (err) { console.error(err); }

};

### **Adapter example (simulator)**

*   For the hackathon we provide a simulator that consumes envelopes and executes a  ed satellite vault on a target testnet (or just replies with a harvest\_report event).
    

**7\. Frontend — CSPR.click & Live Dashboard**
----------------------------------------------

### **Key features**

*   Wallet aggregation & social login via **CSPR.click** provider.
    
*   Deposit flow: build Casper deploy with casper-js-sdk or via CSPR.click proxy.
    
*   Real-time feed: subscribe to backend WebSocket (project channel) to receive onchain\_event and cross\_chain\_message messages.
    
*   Cross-chain animation: simple SVG animation that moves "message" elements from Casper node to target chain icons as messages update status (created → sent → relayed → executed).
    

### **Sample React hook for events**

// hooks/useProjectEvents.ts

import { useState, useEffect } from "react";

export default function useProjectEvents(projectId) {

  const \[events, setEvents\] = useState(\[\]);

  useEffect(() => {

    const ws = new WebSocket(process.env.VITE\_WS\_URL);

    ws.onmessage = (e) => {

      const msg = JSON.parse(e.data);

      if (msg.channel === \`project:${projectId}\`) {

        setEvents(prev => \[msg.payload, ...prev\].slice(0, 200));

      }

    };

    return () => ws.close();

  }, \[projectId\]);

  return events;

}

### **Deposit flow (high-level)**

1.  User clicks “Deposit” → open CSPR.click wallet modal.
    
2.  Compose deploy: attach attached\_value = deposit amount; set session to Vault.contract deposit entrypoint.
    
3.  Send deploy; UI waits for DeployAccepted / DeployProcessed.
    
4.  Sidecar produces DepositReceived and SyntheticMinted events — backend picks up and UI displays minted omniYLD.
    

**8\. Testing**
---------------

### **OdraVM unit tests**

*   Run with cargo odra test.
    
*   Tests run in OdraVM backend; fast and debug-friendly.
    

Example test:

#\[test\]

fn deposit\_mints\_omni\_yld() {

    let env = TestEnv::new();

    let owner = env.get\_account(0);

    let mut instance = OmniYieldVault::deploy(&env, owner);

    env.set\_caller(owner);

    env.set\_attached\_value(U512::from(1\_000\_000u64));

    instance.deposit();

    assert\_eq!(instance.total\_locked(), U512::from(1\_000\_000u64));

    assert\_eq!(instance.balance\_of(owner), U512::from(1\_000\_000u64));

}

### **Integration / Livenet tests**

*   Provide a binary src/bin/deploy\_livenet.rs that runs a deployment using odra\_casper\_livenet\_env::env() and can be executed with --features livenet.
    
*   Livenet tests require .env with secret keys and node addresses.
    

### **Backend unit tests (Jest)**

*     CSPR.cloud responses using fixtures from / .
    
*   Test: Sidecar parser correctly extracts payload\_hash and triggers adapter queue.
    

Example Jest test (pseudo):

import { parseSidecarEvent } from "../sidecarParser";

import sample from "../ /ws\_project\_messages.json";

test("parses cross chain message", () => {

  const parsed = parseSidecarEvent(sample\[2\]);

  expect(parsed.eventName).toBe("CrossChainMessage");

  expect(parsed.payload\_hash).toBeDefined();

});

**9\. Deployment & CI/CD**
--------------------------

### **Environment files (.env examples)**

\# .env

ODRA\_CASPER\_LIVENET\_SECRET\_KEY\_PATH=./keys/secret\_key.pem

ODRA\_CASPER\_LIVENET\_NODE\_ADDRESS=https://node.testnet.cspr.cloud

ODRA\_CASPER\_LIVENET\_EVENTS\_URL=https://node.testnet.cspr.cloud/events

ODRA\_CASPER\_LIVENET\_CHAIN\_NAME=casper-test

CSPR\_CLOUD\_API\_KEY=...

OMNIYIELD\_CONTRACT\_HASH=hash-omni-...

WS\_PORT=4050

### **Sample NodeOps Autogen integration (CI)**

*   Use NodeOps Autogen to perform: build wasm, run cargo odra build --release, store wasm artifact, and auto-deploy via Livenet binary.
    
*   Provide a deploy.yaml with steps:
    
    *   install rust + wasm target
        
    *   cargo odra build --release
        
    *   cargo run --bin deploy\_livenet --features livenet (runs livenet deploy)
        

### **Docker & Compose (backend)**

Provide Dockerfile for backend and docker-compose.yml to run backend + ws +   simulator + local test server.

**10\. Security Patterns & Best Practices**
-------------------------------------------

**Main design rules:**

*   Keep minimal trust assumptions in on-chain code: contract only mints/burns and records payload hashes; off-chain components do not have unilateral control over user funds.
    
*   Use **Circuit Breaker** pattern in Vault: pause relays and withdraws when anomalies detected.
    
*   Use **Time-locks** for large withdrawals or rebalances to allow human intervention.
    
*   Use **Multi-Sig** for admin/parameter changes.
    
*   Emit detailed events for all critical state changes (deposits, mints, emitted messages, harvests) so Sidecar can provide verifiable histories.
    
*   When bridging real value, incorporate merkle\_proof or signature attestations from adapters and relayers, and require for finalizing cross-chain transfers.
    

**Audits & Sponsor (MVP policy)**

*   For hackathon MVP: use clear comment headers in contract code and include an audit checklist.
    
*   For mainnet: plan for a third-party security firm (Halborn, Trail of Bits, etc.) — sponsor integration with prize partners can help.
    

**11\. API Reference (sample OpenAPI snippet)**
-----------------------------------------------

Below is a small OpenAPI v3 fragment for the backend inspector & projects API. You can generate interactive docs (Swagger UI) from this.

openapi: 3.0.3

info:

  title: OmniYield Backend API

  version: 0.1.0

paths:

  /api/projects:

    get:

      summary: List projects

      responses:

        '200':

          description: OK

          content:

            application/json:

              schema:

                $ref: '#/components/schemas/ProjectsResponse'

  /api/cspr/deploy/{deployHash}:

    get:

      summary: Inspect deploy

      parameters:

        - name: deployHash

          in: path

          required: true

          schema:

            type: string

      responses:

        '200':

          description: Deploy info

          content:

            application/json:

              schema:

                $ref: '#/components/schemas/DeployResponse'

components:

  schemas:

    ProjectsResponse:

      type: object

      properties:

        data:

          type: array

          items:

            $ref: '#/components/schemas/Project'

    Project:

      type: object

      properties:

        id: { type: string }

        name: { type: string }

        contractHashes:

          type: array

          items: { type: string }

    DeployResponse:

      type: object

      properties:

        data:

          type: object

**Note:** Judges can run swagger-jsdoc to generate interactive docs using this spec.

**12\.   Data & Demo Scripts**
---------------------------------

Under /  include JSON fixtures used by backend and tests:

*   projects.json, ws\_project\_messages.json, crosschain\_messages\_lifecycle.json, deploy\_inspect\_\*.json, account\_info\_\*.json, ft\_actions\_omniYLD.json.
    

**Quick demo script** (Node) — run a simulated deposit → emit message → process envelope → simulated execution:

node backend/scripts/simulate\_deposit\_and\_relay.js --project proj-001 --amount 0.1

The script will:

1.  Call api/cspr/deploy ( ) to create a deposit event.
    
2.  Backend picks up deposit event and emits CrossChainMessage with payload\_hash.
    
3.  Adapter signs envelope and simulates sending to Satellite; satellite replies with harvest\_report.
    
4.  Backend aggregates and writes harvest\_report back to UI via WebSocket.
    

**13\. Performance & Gas Considerations**
-----------------------------------------

*   **On-chain costs:** each deposit() and redeem() is a deploy and will incur gas (native CSPR).
    
*   **Event emission:** emitting events is cheap in gas but still consumes resources – keep event payloads small (emit payload\_hash, not full payload).
    
*   **Batching:** batch non-urgent cross-chain messages to reduce adapter relay costs.
    
*   **Off-chain aggregation:** heavy compute (rebalancing decision logic) should run off-chain.
    

**Example gas tuning (Odra Livenet)**Set env.set\_gas(600\_000\_000\_000u64) for heavy operations, 300\_000\_000\_000u64 for simple calls — tune according to results on testnet with actual deploys.

**14\. Roadmap & Extensions**
-----------------------------

Short/mid term:

*   Implement real integrations with LayerZero / CCIP (production adapters).
    
*   Add DAO & governance token layers to manage rebalancer parameters.
    
*   Add audit & formal verification steps for on-chain code.
    
*   Add insurance / slashing guard rails for relayer misbehavior.
    

Long term:

*   Insure omniYLD TVL with third-party fund coverage.
    
*   Provide institutional vaults with risk profiles and KYC rails.
    
*   Implement composable yield derivatives (straddles, option wrappers).
    

**15\. Appendix: Useful Commands & File Layout**
------------------------------------------------

### **Build & test**

\# build wasm

cargo odra build --release

\# run OdraVM tests

cargo odra test

\# deploy to livenet (requires .env)

ODRA\_CASPER\_LIVENET\_ENV=casper-test cargo run --bin omniyield\_livenet --features livenet

### **Backend**

cd backend

npm install

node src/sidecarListener.js

node src/adapterSimulator.js

### **Frontend**

cd frontend

npm install

npm run dev

\# ensure VITE\_API\_BASE and VITE\_WS\_URL are correct

### **File layout (recap)**

/omni-yield

  /src (odra/rust code)

  / 

  /backend

    src/

    scripts/

    package.json

  /frontend

    src/

    package.json

  README.md

  Odra.toml

  Cargo.toml

**FAQ / Quick Troubleshooting**
-------------------------------

**Q: Sidecar SSE not emitting events?**A: Confirm Sidecar is running & events endpoint reachable. Check event\_stream\_buffer\_length in node config. Use curl -sN https://node.testnet.cspr.cloud/events to see raw SSE.

**Q: My frontend doesn't see messages?**A: Confirm backend is broadcasting via WebSocket and client connected to correct WS\_URL. Inspect backend logs for parsed events.

**Q: How do I compute payload\_hash in JS?**A: Use a blake2b library (e.g., blakejs):

import { blake2b } from "blakejs";

const payloadBytes = concat(amountBytes, userBytes, tsBytes, actionBytes);

const hash = blake2b(payloadBytes, null, 32);

const payloadHash = "0x" + Buffer.from(hash).toString("hex");

**Q: Where to store adapter private key?**A: Use vaults/secrets manager or environment secrets (do not commit keys to repo).

