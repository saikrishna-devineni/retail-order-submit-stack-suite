# 🚀 Retail Order Submit Stack Suite

> A TypeScript orchestration tool for testing the complete Order Submit API workflow end-to-end.

---

## 📋 Overview

The **Retail Order Submit Stack Suite** orchestrates multi-step API calls to demonstrate real-world order submission workflows. It automates the entire process from authentication to order completion.

> **⚠️ Important**: This requires the **Order Submission Stack** to be running. Ensure all backend services are deployed and accessible before running.

---

## 📁 Project Structure

```
retail-order-submit-stack-suite/
├── src/
│   ├── constants/
│   │   ├── fsi.ts                    # Based Internet plans (masked)
│   │   ├── payment.ts                # Payment constants
│   │   ├── url.ts                    # API endpoints
│   │   ├── addons.ts                 # Add-on product IDs
│   │   └── index.ts
│   │
│   ├── services/
│   │   ├── auth/
│   │   │   ├── auth_jwt.ts           # JWT authentication
│   │   │   └── tokenStore.ts         # Token management
│   │   │
│   │   ├── customers/
│   │   │   ├── add_customer.ts
│   │   │   ├── show_customer.ts
│   │   │   └── change_customer.ts
│   │   │
│   │   ├── geo/
│   │   │   ├── scrub_location.ts
│   │   │   └── verify_location_by_coordinates.ts
│   │   │
│   │   ├── offers/
│   │   │   ├── get_available_products.ts
│   │   │   ├── get_eic_messages.ts
│   │   │   ├── get_addons.ts
│   │   │   ├── extend_voice_addons.ts
│   │   │   ├── preview_products.ts
│   │   │   ├── extend_root_addons.ts
│   │   │   ├── get_shopping_cart.ts
│   │   │   ├── finalize_shopping_cart.ts
│   │   │   ├── add_fsi_to_cart.ts
│   │   │   └── update_eic.ts
│   │   │
│   │   ├── payment/
│   │   │   ├── create_payment_transaction.ts
│   │   │   └── complete_payment_transaction.ts
│   │   │
│   │   ├── billing/
│   │   │   ├── add_billing_account.ts
│   │   │   └── get_tax_codes.ts
│   │   │
│   │   ├── fulfillment/
│   │   │   └── get_available_appointments.ts
│   │   │
│   │   ├── agreements/
│   │   │   └── agreements.ts
│   │   │
│   │   └── orders/
│   │       ├── submit_order.ts
│   │       └── get_order.ts
│   │
│   ├── types/
│   │   └── Orchestrationtypes.ts     # TypeScript interfaces
│   │
│   ├── utils/
│   │   └── queryString.ts            # Query string utilities
│   │   └── logger.ts                 # console logs and writes logs to 
│   │
│   ├── requestMapper.ts              # Request/response mapping
│   └── orchestrator.ts               # Main orchestration logic
│
├── .env.example                      # Environment template
├── tokenStore.json                   # JWT token cache (gets generated when code executes. Don't share anywhere)
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

```bash
Node.js 18+
Order Submission Stack running
```

### Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure your environment
vim .env
```

### Configuration

Update `.env` with your stack endpoints


### Run

```bash
npm start
```

---

## 💻 Usage

Configure test data and workflow in `src/orchestrator.ts`:
- **`context`** (line 9) - Account details, address, products
- **`orchestrateSequence`** (line 52) - Service execution order

Then run:
```bash
npm start
```

---

## 📞 Support

**Author**: Sai Krishna Devineni

---

**This project demonstrates real-world order submission workflows.**