# PolicyPal — AI-Powered Privacy Policy Analyzer

**PolicyPal** is a full-stack web app that helps users understand privacy policies in plain language using **GPT-4o**, custom NLP, and structured formatting. Upload a PDF, paste text, or submit a URL — PolicyPal summarizes the risks, categories, and assigns a trust score instantly.

---

## Features

- Summarize privacy policies from text, PDFs, or URLs
- Highlights risks (e.g. third-party tracking, indefinite retention)
- Assigns a trust score from 1 to 10
- Flags categories like adTracking, dataCollection, etc.
- Saves last 50 analyses per user
- User accounts via Clerk (email or OAuth)
- Responsive, mobile-friendly UI

---

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS, Framer Motion  
- **Backend**: OpenAI GPT-4o, custom NLP (Regex), MongoDB (Mongoose)  
- **Auth**: Clerk  
- **Deployment**: Vercel  

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/prernaxa/PolicyPal.git
cd policy-pal
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set environment variables

Create a `.env.local` file in the root directory with the following:

```env
OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=your_mongodb_connection_string
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_FRONTEND_API=your_clerk_frontend_api
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 4. Start the dev server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How It Works

1. User uploads a policy via text, PDF, or URL.
2. Text is parsed and sanitized.
3. The OpenAI API is called with a strict prompt structure.
4. The output is:
   - A bullet point summary
   - Two explicit risks
   - A trust score
   - Flags like:  
     `dataCollection: ✅`, `adTracking: ❌`, `thirdParty: ✅`
5. The output is saved to MongoDB under the user’s history.

---

## Sample Output

```
Summary
- Company collects email, location, and usage data.
- Data shared with third-party ad networks and analytics partners.

🚨 Risks
- Shares user data with advertisers without opt-out.
- Retains identifiable data indefinitely.

🔐 Trust Score  
3 / 10

🗂️ Categories  
dataCollection: ✅  
adTracking: ✅  
thirdParty: ✅  
dataRetention: ✅
```
---

## Join the Mission

Empowering users to understand what they’re signing up for — one policy at a time!
