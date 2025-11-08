# SupplyChain - Blockchain Escrow Platform

A full-stack supply chain tracking application with blockchain escrow integration on Arc Testnet. Built with React, TypeScript, and ethers.js v6.

## Features

- **Role-Based Access**: Separate dashboards for Sellers, Buyers, Shippers, and Admins
- **Invoice Management**: Create and track invoices with smart contract escrow
- **Blockchain Integration**: Deploy escrow contracts on Arc Testnet using MetaMask
- **Shipment Tracking**: Real-time milestone updates for shipments
- **AI Assistant**: Built-in AI helper for guidance and quick actions
- **Secure Escrow**: Multi-party escrow with agent-controlled release/revert

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom design system
- **Blockchain**: ethers.js v6, MetaMask integration
- **Network**: Arc Testnet (chainId: 0x4CEF52)
- **UI Components**: shadcn/ui with custom variants
- **State Management**: localStorage (demo), React Query

## Prerequisites

- Node.js 18+ and npm
- MetaMask browser extension
- Arc Testnet USDC (for testing)

## Getting Started

1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env` and set your Cloudflare Worker URL:
```
VITE_WORKER_URL=https://your-worker.workers.dev
```

4. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## User Roles

### Seller
- Create and manage invoices
- Track invoice status (Draft → Awaiting Buyer → Deployed → Locked → Released)
- View payment history

### Buyer
- Review pending invoices
- Deploy escrow contracts on Arc Testnet
- Approve USDC spending
- Deposit funds to lock escrow

### Shipper
- View assigned shipments
- Update shipment milestones:
  - Pending
  - Picked Up
  - In Transit
  - Customs
  - Delivered

### Admin
- Perform agent operations (Release/Revert)
- Requires agent web key (X-AGENT-KEY)
- Submit evidence CID for decisions

## Arc Testnet Configuration

The app automatically configures MetaMask with Arc Testnet:

- **Chain ID**: 0x4CEF52 (5041234)
- **RPC**: https://rpc.testnet.arc.network
- **Explorer**: https://testnet.arcscan.app
- **Native Currency**: USDC (18 decimals for gas)
- **ERC-20 USDC**: 0x3600000000000000000000000000000000000000 (6 decimals)

## Cloudflare Worker API Endpoints

Your Worker should implement these endpoints:

- `GET /contract-artifact` - Returns escrow contract ABI and bytecode
- `POST /prepare/approve` - Prepares USDC approval transaction
- `POST /prepare/deposit` - Prepares deposit transaction
- `GET /stage?contractAddress=...` - Returns contract stage (OPEN/LOCKED/CLOSED)
- `POST /agent/release` - Agent-signed release (requires X-AGENT-KEY)
- `POST /agent/revert` - Agent-signed revert (requires X-AGENT-KEY)

## Demo Authentication

This app uses localStorage for demo authentication. To login:

1. Go to `/login`
2. Select a role (Seller/Buyer/Shipper/Admin)
3. Enter any email/password
4. You'll be redirected to your role-specific dashboard

## Smart Contract Integration

### Escrow Deployment Flow (Buyer)

1. **Deploy Contract**
   - Fetches ABI/bytecode from Worker
   - Deploys using ethers.js ContractFactory
   - Constructor: `(depositor, beneficiary, agent, amount, USDC_ADDRESS)`

2. **Approve USDC**
   - Calls Worker `/prepare/approve`
   - Signs transaction with MetaMask
   - Approves escrow contract to spend USDC

3. **Deposit Funds**
   - Calls Worker `/prepare/deposit`
   - Signs transaction with MetaMask
   - Locks funds in escrow (status → LOCKED)

### Agent Operations (Admin)

Release or revert funds using agent key:
- Input: contract address, evidence CID, agent key
- Worker validates key via X-AGENT-KEY header
- Transaction submitted and explorer link shown

## Project Structure

```
src/
├── components/
│   ├── ai/           # AI Assistant
│   ├── layout/       # Layout components
│   ├── wallet/       # Wallet connection
│   └── ui/           # shadcn components
├── lib/
│   ├── auth.ts       # Authentication
│   ├── storage.ts    # localStorage management
│   ├── types.ts      # TypeScript types
│   ├── wallet.ts     # Wallet integration
│   └── worker-api.ts # API client
├── pages/
│   ├── Login.tsx
│   ├── Seller.tsx
│   ├── Buyer.tsx
│   ├── Shipper.tsx
│   ├── Admin.tsx
│   ├── CreateInvoice.tsx
│   ├── BuyerInvoiceDetail.tsx
│   └── ShipmentDetail.tsx
└── App.tsx           # Routes & auth
```

## Design System

The app uses a professional supply chain theme with semantic tokens:

- **Primary**: Deep blue (#1E40AF) for trust
- **Accent**: Teal (#0D9488) for actions
- **Status Colors**: Amber (pending), Green (success), Red (errors)
- **Gradients**: Primary and hero gradients
- **Typography**: Clean hierarchy with good contrast
- **Animations**: Smooth transitions

All colors defined in `src/index.css` using HSL values.

## Development

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

### Type checking
```bash
npm run type-check
```

## Deployment

Deploy to Lovable:
1. Open [Lovable](https://lovable.dev/projects/a37c620e-ccf7-46ae-ba47-9399bf28ea10)
2. Click Share → Publish
3. Your app will be live!

## License

MIT

## Support

For questions or issues, contact support or check the [Lovable documentation](https://docs.lovable.dev).
