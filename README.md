# halo — Haircare, clarified. 🌿🧪
### Precision Science-Clarified Hair Wellness & Aria AI Regimen Guide

> Minimalist, science-clarified haircare regimens with precision formulas and **Aria**, an intelligent AI hair and scalp guide.

---

## 🏛️ Brand Concept & Visual Identity
- **Wordmark**: `halo` (lowercase Sora display)
- **Tagline**: *"Haircare, clarified."*
- **Aesthetic**: Soft Clinical. Clean, minimalist, lab-clean, calm, premium. Generous white space.
- **Background**: Cool white (`#F4F6F8`)
- **Card Surfaces**: Pure White (`#FFFFFF`) with 1px border (`#E1E6EB`)
- **Ink / Typography**: Deep Navy (`#0B1B2B`)
- **Muted Elements**: `#5B6B7A`
- **Accent**: Soft Aqua (`#7FD6D0`) with high-contrast accessible teal (`#2E9E96`)
- **Typography**: Display font *Sora*, body font *Inter*.

---

## 🌟 Core Brand Experience & Features
1. **Calm Announcement Strip**: Single thin line highlighting complimentary shipping and clarified formulas.
2. **Frosted-Glass Navigation**: Minimalist header with live cart counter and direct "Ask Aria" access.
3. **Procedural 3D Serum Bottle & Story**: Physically-based LatheGeometry serum bottle, orbiting halo ring, morphing serum droplet, and ambient particles (React Three Fiber).
4. **Adaptive Low-Power & Reduced-Motion Engine**: Detects hardware capabilities and automatically serves high-performance lightweight fallbacks without layout shift.
5. **Sequenced Clinical Regimens**: Multi-step timelines (Cleanse, Condition, Define, Protect) with 1-click routine ordering.
6. **Diagnostic Hair Quiz**: 4-step guided tool diagnosing texture and water hardness, with instant transfer into Aria AI consultations.
7. **Social Proof & Strand Outcomes**: Verified reviewer metrics across diverse climate conditions.

---

## 🌿 Aria — Halo Hair & Scalp Guide
- **Role**: AI hair and scalp guide (NOT a doctor; no medical claims).
- **Tone**: Calm, clear, warm, concise, and scientifically grounded.
- **Safety Triage**: Detects severe pain, bleeding, or sudden patchy symptoms and advises consulting a board-certified dermatologist.
- **Persistent Disclaimer**: *"Aria gives general hair care guidance, not medical advice."*

---

## 💻 Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Three.js / React Three Fiber / Drei, Lucide Icons, Canvas Confetti.
- **Backend**: Django, Django REST Framework, SQLite / PostgreSQL.
- **AI Engine**: Google Gemini API (`gemini-3.8-flash` / `gemini-2.5-flash`), with offline high-precision knowledge engine fallback.

---

## 🚀 Running Locally

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_haircare
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.
