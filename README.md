# CampusConnect – Doubt Exchange
> **Tagline:** Ask Freely. Learn Together.  
> **Project Type:** College Design Thinking Mini-Project (B.Tech Peer Learning Platform)  
> **Tech Stack:** HTML5, CSS3, Vanilla JavaScript, LocalStorage API (Zero Frameworks, Zero Dependencies)

---

## 1. Project Overview

**CampusConnect – Doubt Exchange** is a college-only peer-learning web platform engineered specifically for B.Tech engineering students. First-year undergraduates frequently struggle with syntax errors, pointer concepts, runtime exceptions, and lab assignments, yet often hesitate to ask in public forums or large lecture halls for fear of judgment. 

CampusConnect solves this through:
- **Common Shared Doubt Feed:** Every student's questions are immediately visible to all registered classmates on the shared Explore Doubts feed.
- **Anonymous Mode:** Students can ask beginner questions without revealing their identity or roll number.
- **Peer Answering & Follow-Up Discussions:** Any classmate can contribute solutions, hints, or code corrections.
- **Author-Only Best Answer System:** Only the student who posted the question can verify and mark a solution as the winning Best Answer, pinning it to the top with a trophy badge.
- **Upvote Recognition:** Students upvote helpful doubts and solutions, building peer recognition.
- **College-Verified Protected Access:** Strict route guards ensure only logged-in college students can access internal discussion portals.

---

## 2. Technology & Architecture

- **Markup:** Semantic HTML5 (`index.html`, `login.html`, `signup.html`, `dashboard.html`, `explore.html`, `ask-doubt.html`, `doubt-details.html`, `profile.html`)
- **Styling:** Modern CSS3 (`css/style.css`, `css/auth.css`, `css/dashboard.css`)
  - Clean light-blue & white background palette (`#f8fafc`, `#eff6ff`)
  - Dark navy headings and high-contrast typography (`#0f172a`)
  - Vibrant blue and purple gradients (`linear-gradient(135deg, #2563eb, #7c3aed)`)
  - Fully responsive grid and flexbox layout for mobile, tablet, and desktop
- **Logic:** Vanilla JavaScript (`js/storage.js`, `js/main.js`, `js/auth.js`, `js/dashboard.js`, `js/doubts.js`)
- **Persistence:** Browser `localStorage` for persisting demo users, doubts, answers, upvotes, bookmarks, and notifications.
- **Real-Time Updates:** Same-browser custom events (`campusconnect:data_changed`) and cross-tab `window.addEventListener('storage', ...)` synchronization.
- **Icons:** Font Awesome 6 CDN (`fa-solid`, `fa-regular`)
- **Fonts:** Google Fonts (*Outfit*, *Plus Jakarta Sans*, *Fira Code*)

---

## 3. How to Run

### Option 1: 1-Click Launch
Double-click **`run.bat`** or **`index.html`** in File Explorer. It opens instantly in your default web browser!

### Option 2: Local HTTP Server
```bash
python -m http.server 8000
```
Then open: **`http://localhost:8000`**

---

## 4. Multi-Student Peer Testing (1-Click Accounts)

On **`login.html`**, quick-fill buttons are provided for instant evaluator testing:

- **Student A (1st Year CSE):**
  - Email: `arjun.btech24@college.edu`
  - Password: `password123`
- **Student B (2nd Year Senior Mentor):**
  - Email: `priya.btech23@college.edu`
  - Password: `password123`

You can also register brand-new students on `signup.html` with simulated 4-digit college OTP verification (`2026`).

---

## 5. Verified Multi-User Test Scenarios

The platform has passed all 10 automated peer-collaboration scenarios:

| Scenario | Tested Action | Verified Outcome |
|---|---|---|
| **TEST 1** | Register Student A and log in | Session saved, redirected to Dashboard displaying Student A's name. |
| **TEST 2** | Student A posts a coding doubt | Saved to shared collection `campusconnect_doubts`. |
| **TEST 3** | Log out and log in as Student B | Session cleanly cleared, Student B authenticated. |
| **TEST 4** | Student B explores doubts | Student A's new doubt appears immediately in the common feed. |
| **TEST 5** | Student B submits an answer | Saved with Student B's name, avatar, and timestamp. |
| **TEST 6** | Log out and log in as Student A | Student A's session restored. |
| **TEST 7** | Student A reviews and marks Best Answer | Solution verified, marked with trophy banner, pinned to top. |
| **TEST 8** | Student B verifies Solved status | Solved badge and Best Answer visible; unauthorized toggle blocked. |
| **TEST 9** | Page reload & persistence | All questions, answers, and states preserved in `localStorage`. |
| **TEST 10** | Shared collection integrity | Verified single unified collection accessible to all students. |

---

## 6. Project Structure

```
CampusConnect/
│
├── index.html            # Public landing page with features & how it works
├── login.html            # Student login with 1-click test credentials (Student A / Student B)
├── signup.html           # Student registration with simulated college email OTP modal
├── dashboard.html        # Main student portal with metrics, feed, & quick ask
├── explore.html          # Common doubts feed with real-time search & language pills
├── ask-doubt.html        # Form with code editor, error trace, screenshot preview, & anonymous switch
├── doubt-details.html    # Full question thread with copy code, answers, & best answer toggle
├── profile.html          # Student stats, edit profile modal, questions & saved bookmarks
├── run.bat               # 1-click launcher for Windows
├── package.json          # Project descriptor & Vercel deployment metadata
├── vercel.json           # Vercel deployment configuration (clean URLs & caching)
│
├── css/
│   ├── style.css         # Design system, typography, buttons, toasts, modals
│   ├── auth.css          # Login/signup styling, OTP inputs, credentials card
│   └── dashboard.css     # Sidebar layout, cards, discussion feed, filters
│
├── js/
│   ├── storage.js        # LocalStorage data engine, seed dataset, CRUD, toasts, events
│   ├── main.js           # Navigation sync, notification bell, clipboard copy, logout
│   ├── auth.js           # Login, validation, simulated OTP verification, redirects
│   ├── dashboard.js      # Dashboard counters, recent/trending filters, live listeners
│   └── doubts.js         # Explore search, ask form, details thread, profile tabs
│
└── assets/
    └── images/           # Image assets directory
```

---

## 7. Cloud Migration Architecture (Firebase Firestore)

The codebase has been designed with modular, asynchronous abstractions in `js/storage.js`. To scale from prototype `localStorage` to multi-device cloud synchronization:
- `Storage.getDoubts()` maps to `db.collection('doubts').orderBy('createdAt', 'desc').onSnapshot()`
- `Storage.saveDoubt()` maps to `db.collection('doubts').add(...)`
- `Storage.addAnswer()` maps to `db.collection('doubts').doc(id).collection('answers').add(...)`
- `Storage.toggleUpvoteDoubt()` maps to `db.collection('doubts').doc(id).update({ upvotes: arrayUnion / arrayRemove })`

This ensures that the frontend UI, styles, and page controllers require zero structural redesign when connecting a cloud database!
