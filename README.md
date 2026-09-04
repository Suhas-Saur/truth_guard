# 🛡️ TruthGuard AI — Intelligent Misinformation & Content Shield

<div align="center">

![TruthGuard Banner](https://img.shields.io/badge/TruthGuard%20AI-Verification%20Engine-6366f1?style=for-the-badge&logo=shield&logoColor=white)

**Your intelligent, multi-layer shield against online misinformation, phishing scams, and artificial text generation.**

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-Available%20Now-emerald?style=for-the-badge)](https://c7fb1f200cc3ca73-157-50-197-231.serveousercontent.com)
[![Next.js](https://img.shields.io/badge/Next.js%2016-Turbopack-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React%2018-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS%203.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

[**Explore Live Demo 🚀**](https://c7fb1f200cc3ca73-157-50-197-231.serveousercontent.com) • [**Report Bug**](https://github.com/Suhas-Saur/truth_guard/issues) • [**Request Feature**](https://github.com/Suhas-Saur/truth_guard/issues)

</div>

---

## 🌟 Overview

**TruthGuard AI** is a full-stack, enterprise-grade verification application designed to empower everyday internet users, researchers, and journalists with real-time digital forensics.

Misinformation, sophisticated phishing scams, and undetectable AI synthetic text erode trust across the digital web. TruthGuard AI consolidates three specialized forensic tools into one fast, glassmorphic dashboard powered by Google's Gemini LLMs and resilient local heuristic evaluation engines.

---

## 🚀 Live Demo

> 🔗 **Public Web App**: [https://c7fb1f200cc3ca73-157-50-197-231.serveousercontent.com](https://c7fb1f200cc3ca73-157-50-197-231.serveousercontent.com)
>
> *(Also accessible on local networks at `http://localhost:3001` or via local Wi-Fi)*

---

## ✨ Key Features

### 1. 🗞️ Fake News & Misinformation Detector
- **Natural Language Fact-Checking**: Evaluates headlines, social media posts, and breaking news articles against objective journalistic standards.
- **Multimodal Image Support**: Upload photos, memes, newspaper clippings, or screenshots to extract and analyze embedded text and claims.
- **Confidence Scoring**: Returns a clear verdict (`Real`, `Likely Fake`, `Uncertain`), confidence percentage, and journalistic rationale.

### 2. 🔒 Website Safety & Phishing Scanner
- **Zero-Day URL Forensics**: Analyzes domain architectures, typosquatting lures (`paypa1.com`), and suspicious subdomains.
- **Heuristic Protocol Screening**: Checks HTTPS compliance, non-standard ports, suspicious TLDs (`.xyz`, `.tk`, `.click`), and IP-based hostnames.
- **Credential Theft Prevention**: Detects lures mimicking banking and authentication portals before you click.

### 3. 🤖 AI Content & Deepfake Text Detector
- **Stylometric & Syntactic Analysis**: Identifies repetitive structural cadences, clichéd transitions (*"furthermore"*, *"pivotal"*, *"testament to"*), and unnaturally uniform sentence distribution.
- **Document Support**: Paste raw text or upload `.pdf`, `.docx`, `.doc`, `.txt`, and image files.
- **Human vs. AI Categorization**: Differentiates between authentic human voice and large language model synthetics.

### 4. 📜 Audit History & Activity Dashboard
- **Dedicated Audit Hub**: Tracks past scans with category filters (`All`, `Fake News`, `Web Safety`, `AI Content`).
- **Interactive Inspection Modal**: View the exact input query, confidence rating, timestamp, and reasoning.
- **Resilient Dual Storage**: Automatically synchronizes with **MongoDB** when configured, with seamless fallback to zero-dependency local JSON file storage.

---

## 🏗️ Architecture & Technology Stack

```
   ┌─────────────────────────────────────────────────────────┐
   │              TruthGuard Glassmorphic UI                 │
   │      (Next.js 16 App Router • TailwindCSS • React 18)    │
   └────────────┬────────────────────────────┬───────────────┘
                │                            │
      [REST API Endpoints]         [Interactive Dashboard]
                │                            │
   ┌────────────▼────────────────────────────▼───────────────┐
   │                  TruthGuard Core Engine                 │
   │  ┌─────────────────────────┐ ┌────────────────────────┐ │
   │  │   Gemini Cloud Cascade  │ │   Local Fallback Engine│ │
   │  │ (2.5 / 2.0 / 1.5 Flash) │ │ (Linguistic Heuristics)│ │
   │  └─────────────────────────┘ └────────────────────────┘ │
   └────────────┬────────────────────────────┬───────────────┘
                │                            │
   ┌────────────▼───────────────┐  ┌─────────▼───────────────┐
   │      MongoDB Database      │  │ Local JSON Cache (data/)│
   │   (Cloud Persistence)      │  │  (Zero-Config Fallback) │
   └────────────────────────────┘  └─────────────────────────┘
```

| Component | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16 (Turbopack) | Fast server-side rendering, API routes, and static generation |
| **Frontend** | React 18 & TailwindCSS | Modern dark-mode UI with glassmorphism and animations |
| **AI Model** | Google Gemini 2.5 Flash | Cutting-edge multimodal and factual reasoning engine |
| **Failover Engine** | Pure JavaScript Heuristics | Guaranteed 100% uptime even without cloud API keys |
| **Database** | MongoDB & Local JSON | Hybrid data layer with persistence across restarts |
| **Networking** | Node.js child tunnel | Secure public HTTPS tunneling with auto-reconnect |

---

## 📦 Quick Start & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- *(Optional)* [Google Gemini API Key](https://aistudio.google.com/)
- *(Optional)* [MongoDB Connection URI](https://www.mongodb.com/atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/Suhas-Saur/truth_guard.git
cd truth_guard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables *(Optional)*
TruthGuard runs out-of-the-box using its built-in fallback evaluation engine and local file store. To enable cloud features, create a `.env.local` file:
```bash
cp .env.example .env.local
```
Add your credentials:
```env
# Optional: Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: MongoDB Connection URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/truthguard
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 📡 API Reference

### 1. Fake News Detector
- **Endpoint**: `POST /api/fake-news`
- **Body**:
  ```json
  {
    "type": "text",
    "content": "Article headline or claim to analyze..."
  }
  ```
- **Response**:
  ```json
  {
    "result": "Likely Fake",
    "confidence": 95,
    "reason": "Content exhibits strong sensationalism and known misinformation patterns.",
    "verification_summary": "Flagged by TruthGuard pattern analysis."
  }
  ```

### 2. Website Safety Checker
- **Endpoint**: `POST /api/website-safety`
- **Body**:
  ```json
  {
    "url": "https://example.com"
  }
  ```
- **Response**:
  ```json
  {
    "result": "Safe",
    "score": 92,
    "reason": "Domain structure conforms to legitimate web standards."
  }
  ```

### 3. AI Content Detector
- **Endpoint**: `POST /api/ai-content`
- **Body**:
  ```json
  {
    "text": "Text snippet to analyze..."
  }
  ```
- **Response**:
  ```json
  {
    "result": "Likely AI-generated",
    "confidence": 96,
    "reason": "Shows repetitive structural cadences and generic connective phrases."
  }
  ```

### 4. Scan History
- **`GET /api/history?limit=50&type=all`**: Retrieve logged verification audits.
- **`POST /api/history`**: Save a custom scan item.
- **`DELETE /api/history`**: Clear all audit records.

---

## 🛡️ Security & Privacy
- **Stateless Analysis**: Uploaded files and texts are never sold or used for public training sets.
- **Resilient Fallback**: If third-party cloud APIs experience downtime, the built-in heuristic evaluator activates automatically with zero service interruption.
- **Safe Handling**: URL tests inspect domain syntax and metadata safely without executing malicious remote client scripts.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<div align="center">

Made with ❤️ by [Suhas S](https://github.com/Suhas-Saur)

</div>
