# CampusConnect – Doubt Exchange
> **Tagline:** Ask Freely. Learn Together.  
> **Project Type:** College Design Thinking Mini-Project (B.Tech Peer Learning Platform)  
> **Tech Stack:** HTML5, CSS3, Vanilla JavaScript, LocalStorage API (Zero Frameworks, Zero Dependencies)

---

## 1. Project Overview

**CampusConnect – Doubt Exchange** is a college-only peer-learning web platform engineered specifically for B.Tech engineering students. First-year undergraduates frequently struggle with syntax errors, pointer concepts, runtime exceptions, and lab assignments, yet often hesitate to ask in public forums or large lecture halls for fear of judgment. 

CampusConnect solves this through:
- **Anonymous Mode:** Students can ask beginner questions without revealing their identity.
- **College-Verified Community:** A private, trusted environment for engineering batchmates.
- **Syntax-Formatted Code & Terminal Output:** Clear presentation of code and stack traces.
- **Best Answer Bounty & Peer Upvotes:** Transparent recognition for classmates who help debug.

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
- **Icons:** Font Awesome 6 CDN (`fa-solid`, `fa-regular`)
- **Fonts:** Google Fonts (*Outfit*, *Plus Jakarta Sans*, *Fira Code*)

---

## 3. How to Run

1. Open the project folder in File Explorer.
2. Double-click **`index.html`** to open it in any web browser (Chrome, Edge, Firefox, Safari).
3. **No Node.js, npm, or build tools required.** The application works out of the box.

---

## 4. Demo Accounts & Evaluator Testing

The app comes preloaded with an active session for **Arjun Sharma** (1st Year CSE) and pre-seeded realistic questions and answers across C, Python, Java, DSA, and Web Development.

### Quick Testing Credentials:
- **Student 1 (Preloaded Active):**
  - Email: `arjun.btech24@college.edu`
  - Password: `password123`
- **Student 2 (Senior Mentor):**
  - Email: `priya.btech23@college.edu`
  - Password: `password123`
- **1-Click Quick Fill:** On `login.html`, click the **"Evaluator Quick-Test"** button to auto-fill credentials instantly!

---

## 5. Pre-seeded Sample Doubts

1. **Why is i <= 5 out of bounds in C?** (C Programming, Solved, Best Answer marked)
2. **Segmentation fault in linked list insertion at end** (DSA, Solved, Anonymous Mode demo)
3. **IndentationError: unindent does not match any outer indentation level in Python** (Python, Solved)
4. **Difference between array and structure in C with practical examples** (C Viva Concept, Solved)
5. **How does recursion work in programming? Why does my recursive function never stop?** (Python, Solved, Anonymous Mode)
6. **Why is my Java NullPointerException occurring when accessing student name?** (Java, Unsolved)
7. **How to properly connect HTML, CSS, and JavaScript in a project?** (Web Dev, Needs answer)

---

## 6. Project Structure

```
CampusConnect/
│
├── index.html            # Public landing page with features & how it works
├── login.html            # Student login with 1-click test credentials
├── signup.html           # Student registration with simulated college email OTP modal
├── dashboard.html        # Main student portal with metrics, feed, & quick ask
├── explore.html          # Real-time search, category filters, & question cards
├── ask-doubt.html        # Form with code editor, error trace, screenshot preview, & anonymous switch
├── doubt-details.html    # Full question discussion, copy code button, & best answer toggle
├── profile.html          # Student stats, edit profile modal, questions & saved bookmarks
│
├── css/
│   ├── style.css         # Design system, typography, buttons, toasts, modals
│   ├── auth.css          # Login/signup styling, OTP inputs, credentials card
│   └── dashboard.css     # Sidebar layout, cards, discussion feed, filters
│
├── js/
│   ├── storage.js        # LocalStorage data engine, seed dataset, CRUD, toasts
│   ├── main.js           # Navigation sync, notification bell, clipboard copy
│   ├── auth.js           # Login, validation, simulated OTP verification
│   ├── dashboard.js      # Dashboard counters, recent/trending filters
│   └── doubts.js         # Explore search, ask form, details thread, profile tabs
│
└── assets/
    └── images/           # Image assets directory
```

---

## 7. Key Features Implemented

- [x] **Universal Realtime Search:** Filters simultaneously across question title, body text, programming language, and error terminal output.
- [x] **Anonymous Student Mode:** Strips user name and avatar, displaying a discreet "Anonymous Student" badge.
- [x] **Screenshot Upload & Preview:** Uses the HTML5 `FileReader` API to preview attached screenshots before posting.
- [x] **Syntax-Formatted Code Blocks:** Styled with dark monospace themes and 1-click "Copy Code" clipboard integration.
- [x] **Owner-Only "Mark as Best Answer":** Only the student who posted the question can verify and mark a solution as the winning Best Answer.
- [x] **Toast Feedback & Modals:** Non-intrusive feedback toasts for upvotes, saves, edits, and answers.
- [x] **Simulated College Email Verification:** Interactive 4-digit verification modal created specifically for the Design Thinking prototype demonstration.

