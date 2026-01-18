# 🚀 Retail Order Submit Stack Suite

> A TypeScript orchestration tool for testing the complete Order Submit API workflow end-to-end.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-18+-green.svg)](https://nodejs.org/)

---

## 📋 Overview

The **Retail Order Submit Stack Suite** orchestrates multi-step API calls to demonstrate real-world order submission workflows. It automates the entire process from authentication to order completion, making it ideal for:

- ✅ **Integration Testing** - Validate end-to-end order flows
- ✅ **Development** - Quick order creation during feature development
- ✅ **QA/Testing** - Reproducible test scenarios with configurable data
- ✅ **CI/CD Automation** - Scheduled health checks via GitHub Actions

> **⚠️ Important**: This requires the **Order Submission Stack** to be running. Ensure all backend services are deployed and accessible before running.

---

## 📁 Project Structure

```
retail-order-submit-stack-suite/
├── .github/
│   └── workflows/
│       └── orchestration.yml         # GitHub Actions workflow
│
├── src/
│   ├── constants/
│   │   ├── fsi.ts                    # Internet plans (masked)
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
│   │   ├── queryString.ts            # Query string utilities
│   │   └── logger.ts                 # Logging with file output
│   │
│   ├── requestMapper.ts              # Request/response mapping
│   └── orchestrator.ts               # Main orchestration logic
│
├── logs/                              # Auto-generated logs (gitignored)
├── .env.example                       # Environment template
├── .gitignore
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

### Environment Configuration

Update `.env` with your stack endpoints:

```env
NODE_ENV=development

# API Endpoints
API_BASE_URL=https://api-dev.example.com
PAYMENT_BASE_URL=https://payment-dev.example.com

# Authentication (Base64 encoded username:password)
USR_PSWD_IO=dXNlcm5hbWU6cGFzc3dvcmQ=
```

### Run Locally

```bash
npm start
```

---

## 💻 Usage

### Local Execution

Configure test data and workflow in `src/orchestrator.ts`:

- **`context`** (line 9) - Account details, address, products
- **`orchestrateSequence`** (line 52) - Service execution order

Then run:
```bash
npm start
```

### GitHub Actions

The orchestration can run automatically via GitHub Actions:

#### Manual Trigger
1. Go to **Actions** tab in GitHub
2. Select **Order Submission Orchestration**
3. Click **Run workflow**
4. Choose environment (dev/staging) and product plan
5. Click **Run workflow**

#### Scheduled Runs
- Runs automatically **daily at 2 AM UTC**
- Validates Order Submission Stack health

#### On Pull Requests
- Runs automatically when PRs modify:
  - `src/**` files
  - `package.json`
  - Workflow files

---

## 📊 Logging

The orchestrator automatically generates detailed logs:

### Log Files
- **Location**: `logs/` directory (auto-created)
- **Format**: `orchestration-YYYY-MM-DD-HH-MM-SS-runID.log`
- **Retention**: 7 days (auto-cleanup)

### Log Features
- ✅ Timestamped entries
- ✅ Step-by-step execution tracking
- ✅ Request/response data (sanitized)
- ✅ **Sensitive data redacted** (tokens, passwords, SSN)
- ✅ Color-coded console output
- ✅ Error stack traces

### Example Log Entry
```
[2026-01-18T14:30:25.123Z] INFO: Starting order orchestration
[2026-01-18T14:30:25.456Z] INFO: Step 1/24: AUTH_JWT
[2026-01-18T14:30:26.789Z] SUCCESS: Step completed: AUTH_JWT
```

### Security Notes
- 🔒 JWT tokens are **never cached** in CI environments
- 🔒 `tokenStore.json` is **gitignored** and auto-deleted after CI runs
- 🔒 Logs sanitize: `jwt_token`, `password`, `authorization`, `taxpayer_id`, `ssn`
- 🔒 GitHub Actions masks all secrets in console output

---

## 🔧 GitHub Actions Setup

### Required Secrets

Add these in **Settings → Secrets and variables → Actions**:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `API_BASE_URL` | Order API endpoint | `https://api-dev.example.com` |
| `PAYMENT_BASE_URL` | Payment API endpoint | `https://payment-dev.example.com` |
| `USR_PSWD_IO` | Base64 encoded credentials | `dXNlcm5hbWU6cGFzc3dvcmQ=` |

### Workflow Features
- ✅ Manual trigger with environment selection
- ✅ Scheduled daily health checks
- ✅ PR validation
- ✅ TypeScript type checking
- ✅ Log artifact upload (7-day retention)
- ✅ Automatic cleanup of sensitive files

---

## 🔍 Debugging

### View Logs Locally
```bash
# View latest log
tail -f logs/orchestration-*.log

# View all logs
ls -lh logs/

# Search logs
grep "ERROR" logs/orchestration-*.log
```

### View CI Logs
1. Go to **Actions** tab
2. Click on workflow run
3. Download **orchestration-logs** artifact
4. Extract and review logs

### Common Issues

**Issue**: `USR_PSWD_IO environment variable is not set`
- **Fix**: Add `USR_PSWD_IO` to `.env` or GitHub Secrets

**Issue**: `Repository not found` during git push
- **Fix**: Create repository on GitHub first

**Issue**: JWT token expired
- **Fix**: Delete `tokenStore.json` and re-run (tokens auto-refresh in CI)

---

## 🛡️ Security Best Practices

- ✅ **Never commit** `.env`, `tokenStore.json`, or log files
- ✅ **Use Base64 encoded credentials** in `USR_PSWD_IO`
- ✅ **Rotate credentials** regularly in GitHub Secrets
- ✅ **Review logs** before sharing (sensitive data is redacted)
- ✅ **Use GitHub Environments** for production deployments

---

## 📞 Support

**Author**: Sai Krishna Devineni  
**Repository**: [retail-order-submit-stack-suite](https://github.com/saikrishna-devineni/retail-order-submit-stack-suite)

---

**This project demonstrates real-world order submission workflows for testing and development.**