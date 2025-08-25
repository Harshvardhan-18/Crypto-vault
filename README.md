# 🔐 Crypto Vault

A secure and user-friendly wallet manager built with **React + TypeScript**.  
Crypto Vault allows you to generate and manage crypto wallets from a single mnemonic seed phrase, making it simple to create, store, and interact with multiple wallets securely.

---

## ✨ Features

- 📜 **Mnemonic Seed Phrase**  
  - Generate a BIP-39 mnemonic (12/24 words).  
  - Persist the phrase safely in browser storage (localStorage).  

- 🪪 **Wallet Management**  
  - Create multiple wallets derived from the same seed phrase using derivation paths.  
  - Automatically assigns unique addresses with each wallet.  
  - View balances (mock/demo for now).  

- 🗂️ **Active Wallet Switching**  
  - Easily switch between wallets to perform actions.  

- 🔒 **Security Best Practices**  
  - Mnemonic is never exposed in UI once generated.  
  - Stored only locally in the browser.  

---

## 🛠️ Tech Stack

- **React + TypeScript** – frontend UI & state management  
- **TailwindCSS + shadcn/ui** – styling & components  
- **bip39** – mnemonic phrase generation  
- **ed25519-hd-key / tweetnacl / @solana/web3.js** – wallet derivation & keypair management  

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/crypto-vault.git
cd crypto-vault
