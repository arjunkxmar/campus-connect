/**
 * CampusConnect – Doubt Exchange
 * storage.js - Central Data Management & LocalStorage Persistence
 * Handles sample data seeding, users, doubts, replies, upvotes, and bookmarks.
 */

// Keys used in localStorage
const STORAGE_KEYS = {
    DOUBTS: 'campusconnect_doubts',
    USERS: 'campusconnect_users',
    CURRENT_USER: 'campusconnect_current_user',
    BOOKMARKS: 'campusconnect_bookmarks',
    NOTIFICATIONS: 'campusconnect_notifications',
    INITIALIZED: 'campusconnect_initialized_v1'
};

// ==========================================
// 1. Initial Sample Seed Data
// ==========================================
const DEFAULT_USERS = [
    {
        id: 'usr_demo_1',
        name: 'Arjun Sharma',
        email: 'arjun.btech24@college.edu',
        password: 'password123',
        branch: 'Computer Science & Engineering',
        year: '1st Year B.Tech',
        rollNo: '24CSE042',
        bio: 'First year CSE undergrad exploring C, Data Structures and Web Dev. Always up to solve bugs together!',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        joinedDate: '2026-09-01T10:00:00Z',
        isVerified: true
    },
    {
        id: 'usr_demo_2',
        name: 'Priya Patel',
        email: 'priya.btech23@college.edu',
        password: 'password123',
        branch: 'Computer Science & Engineering',
        year: '2nd Year B.Tech',
        rollNo: '23CSE018',
        bio: '2nd year senior, passionate about Python, algorithms, and mentoring junior batchmates.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        joinedDate: '2025-08-15T12:00:00Z',
        isVerified: true
    },
    {
        id: 'usr_demo_3',
        name: 'Rohan Mehta',
        email: 'rohan.btech22@college.edu',
        password: 'password123',
        branch: 'Information Technology',
        year: '3rd Year B.Tech',
        rollNo: '22IT091',
        bio: 'Competitive programmer and full stack developer. Love demystifying Java and memory leaks.',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
        joinedDate: '2024-08-20T09:30:00Z',
        isVerified: true
    },
    {
        id: 'usr_demo_4',
        name: 'Sneha Rao',
        email: 'sneha.btech24@college.edu',
        password: 'password123',
        branch: 'Electronics & Communication',
        year: '1st Year B.Tech',
        rollNo: '24ECE034',
        bio: 'Learning C programming for embedded systems. Friendly peer learner!',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        joinedDate: '2026-09-05T14:15:00Z',
        isVerified: true
    }
];

// Seed 7 Required Sample Questions with Realistic Code & Answers
const DEFAULT_DOUBTS = [
    {
        id: 'doubt_1',
        title: 'Why is i <= 5 out of bounds in C?',
        description: 'I created an integer array of size 5: `int arr[5] = {10, 20, 30, 40, 50};`. When I iterate using `for (int i = 0; i <= 5; i++)`, the program prints a garbage value on the last iteration or crashes. Why does this happen if the size is 5?',
        language: 'C',
        codeSnippet: `#include <stdio.h>

int main() {
    int arr[5] = {10, 20, 30, 40, 50};
    
    // Looping through the array
    for (int i = 0; i <= 5; i++) {
        printf("Element at index %d: %d\\n", i, arr[i]);
    }
    
    return 0;
}`,
        errorMessage: 'Element at index 5: 32764 (Garbage output / Undefined Behavior - Stack smashing detected)',
        screenshot: null,
        isAnonymous: false,
        authorId: 'usr_demo_1',
        authorName: 'Arjun Sharma',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        upvotes: ['usr_demo_2', 'usr_demo_3'],
        createdAt: new Date(Date.now() - 3600000 * 26).toISOString(), // 26 hours ago
        isSolved: true,
        answers: [
            {
                id: 'ans_1_1',
                authorId: 'usr_demo_2',
                authorName: 'Priya Patel',
                authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
                text: 'In C, arrays use **zero-based indexing**. This means that when you declare `int arr[5]`, the valid indices are `0, 1, 2, 3, 4`. There are exactly 5 elements, but index 5 is the 6th slot!\n\nWhen your loop reaches `i = 5`, it tries to access memory outside the bounds allocated for `arr`. This causes **Undefined Behavior** (reading garbage data from adjacent memory or causing a segmentation fault).\n\nChange your loop condition from `i <= 5` to `i < 5`:',
                codeSnippet: `for (int i = 0; i < 5; i++) {
    printf("Element at index %d: %d\\n", i, arr[i]);
}`,
                upvotes: ['usr_demo_1', 'usr_demo_3', 'usr_demo_4'],
                isBestAnswer: true,
                createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
            },
            {
                id: 'ans_1_2',
                authorId: 'usr_demo_3',
                authorName: 'Rohan Mehta',
                authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
                text: 'Spot on explanation by Priya. A good professional habit in C is to use `sizeof` to avoid hardcoded loop limits:\n\n`int n = sizeof(arr) / sizeof(arr[0]);`\n`for (int i = 0; i < n; i++) { ... }`',
                codeSnippet: `int n = sizeof(arr) / sizeof(arr[0]);
for (int i = 0; i < n; i++) {
    printf("%d ", arr[i]);
}`,
                upvotes: ['usr_demo_1'],
                isBestAnswer: false,
                createdAt: new Date(Date.now() - 3600000 * 20).toISOString()
            }
        ]
    },
    {
        id: 'doubt_2',
        title: 'Segmentation fault in linked list insertion at end',
        description: 'I am implementing a singly linked list in C for our DSA lab assignment. When inserting a node into an empty list or traversing to find the tail, I keep getting `Segmentation fault (core dumped)`. What am I doing wrong with pointers?',
        language: 'DSA',
        codeSnippet: `struct Node {
    int data;
    struct Node* next;
};

void insertEnd(struct Node* head, int val) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = val;
    newNode->next = NULL;

    struct Node* temp = head;
    // Traversing to the last node
    while (temp->next != NULL) { 
        temp = temp->next;
    }
    temp->next = newNode;
}`,
        errorMessage: 'Segmentation fault (core dumped) at line 14: while (temp->next != NULL)',
        screenshot: null,
        isAnonymous: true,
        authorId: 'usr_demo_4',
        authorName: 'Anonymous Student',
        authorAvatar: 'https://ui-avatars.com/api/?name=Anonymous+Student&background=64748b&color=fff',
        upvotes: ['usr_demo_1', 'usr_demo_2', 'usr_demo_3'],
        createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
        isSolved: true,
        answers: [
            {
                id: 'ans_2_1',
                authorId: 'usr_demo_3',
                authorName: 'Rohan Mehta',
                authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
                text: 'There are two crucial bugs here:\n1. If `head` is `NULL` (empty list), evaluating `temp->next` attempts to dereference a `NULL` pointer! That instantly triggers a segmentation fault.\n2. In C, parameters are passed by value. To modify `head` when the list is empty, you need to either pass `struct Node** head` (pointer to pointer) or return the updated head pointer.',
                codeSnippet: `struct Node* insertEnd(struct Node* head, int val) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = val;
    newNode->next = NULL;

    if (head == NULL) {
        return newNode; // New node is the new head!
    }

    struct Node* temp = head;
    while (temp->next != NULL) {
        temp = temp->next;
    }
    temp->next = newNode;
    return head;
}`,
                upvotes: ['usr_demo_1', 'usr_demo_2'],
                isBestAnswer: true,
                createdAt: new Date(Date.now() - 3600000 * 15).toISOString()
            }
        ]
    },
    {
        id: 'doubt_3',
        title: 'IndentationError: unindent does not match any outer indentation level in Python',
        description: 'I was writing a function to calculate student attendance grade in Python. Suddenly it started giving an IndentationError on line 6, even though visually the code looks aligned. Why is Python rejecting this block?',
        language: 'Python',
        codeSnippet: `def calculate_grade(attendance_pct, marks):
    if attendance_pct >= 75:
        total = marks + 5
        print("Eligible for bonus")
    else:
	    total = marks  # Error points here
	    print("No bonus")
    return total`,
        errorMessage: 'IndentationError: unindent does not match any outer indentation level',
        screenshot: null,
        isAnonymous: false,
        authorId: 'usr_demo_1',
        authorName: 'Arjun Sharma',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        upvotes: ['usr_demo_2'],
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        isSolved: true,
        answers: [
            {
                id: 'ans_3_1',
                authorId: 'usr_demo_2',
                authorName: 'Priya Patel',
                authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
                text: 'This classic Python bug occurs when you **mix Tabs and Spaces**! In your code, the `if` block uses 4 standard spaces, but inside the `else` block you pressed the `Tab` key.\n\nEven if your code editor visually renders a tab as 4 spaces, Python 3 strictly prohibits mixing tabs and spaces for indentation.',
                codeSnippet: `# Fix: Use consistent 4 spaces throughout:
def calculate_grade(attendance_pct, marks):
    if attendance_pct >= 75:
        total = marks + 5
        print("Eligible for bonus")
    else:
        total = marks  # Replaced Tab with 4 spaces
        print("No bonus")
    return total`,
                upvotes: ['usr_demo_1'],
                isBestAnswer: true,
                createdAt: new Date(Date.now() - 3600000 * 10).toISOString()
            }
        ]
    },
    {
        id: 'doubt_4',
        title: 'Difference between array and structure in C with practical examples',
        description: 'Our professor asked this in the lab viva: "Both arrays and structures store multiple values. When should an engineer use an array and when should you use a struct?" Can someone explain with a clear analogy and memory layout explanation?',
        language: 'C',
        codeSnippet: `// Array example
int rollNumbers[5] = {101, 102, 103, 104, 105};

// Structure example
struct Student {
    int rollNo;
    char name[30];
    float gpa;
};`,
        errorMessage: 'Conceptual Viva Question (Data Organization)',
        screenshot: null,
        isAnonymous: false,
        authorId: 'usr_demo_4',
        authorName: 'Sneha Rao',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        upvotes: ['usr_demo_1', 'usr_demo_2', 'usr_demo_3'],
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
        isSolved: true,
        answers: [
            {
                id: 'ans_4_1',
                authorId: 'usr_demo_3',
                authorName: 'Rohan Mehta',
                authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
                text: 'Here is the simplest way to remember this for exams and interviews:\n\n1. **Data Homogeneity:**\n- **Array:** Homogeneous collection (every item must have the *exact same data type*, e.g., all `int` or all `float`).\n- **Structure:** Heterogeneous collection (groups *different data types* under one logical entity, e.g., an `int rollNo`, `char name[]`, and `float gpa`).\n\n2. **Memory Layout:**\n- Array elements are stored in contiguous adjacent blocks with equal stride: `arr[i] = base + i * sizeof(type)`.\n- Struct members are contiguous, but may include padding bytes for hardware alignment.\n\n3. **Analogy:**\n- Array = An egg carton holding identical eggs.\n- Struct = A student ID card holding a name, photo, photo ID, and blood group.',
                codeSnippet: null,
                upvotes: ['usr_demo_4', 'usr_demo_1'],
                isBestAnswer: true,
                createdAt: new Date(Date.now() - 3600000 * 6).toISOString()
            }
        ]
    },
    {
        id: 'doubt_5',
        title: 'How does recursion work in programming? Why does my recursive function never stop?',
        description: 'I wrote a simple recursive countdown function in Python, but when I call `countdown(5)` it prints numbers endlessly and then crashes with `RecursionError: maximum recursion depth exceeded`. How does the call stack actually process recursion?',
        language: 'Python',
        codeSnippet: `def countdown(n):
    print(n)
    countdown(n - 1)  # Recursive call

countdown(5)`,
        errorMessage: 'RecursionError: maximum recursion depth exceeded while calling a Python object',
        screenshot: null,
        isAnonymous: true,
        authorId: 'usr_demo_1',
        authorName: 'Anonymous Student',
        authorAvatar: 'https://ui-avatars.com/api/?name=Anonymous+Student&background=64748b&color=fff',
        upvotes: ['usr_demo_2', 'usr_demo_3'],
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        isSolved: true,
        answers: [
            {
                id: 'ans_5_1',
                authorId: 'usr_demo_2',
                authorName: 'Priya Patel',
                authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
                text: 'Every recursive function must have two essential components:\n1. **Base Case:** The stopping condition that tells the function when to stop calling itself.\n2. **Recursive Step:** The step that reduces the problem size toward the base case.\n\nYour code is missing a **Base Case**! Because there is no check for `n <= 0`, it keeps calling `countdown(-1)`, `countdown(-2)`, `countdown(-1000)` until the call stack runs out of memory (Stack Overflow).',
                codeSnippet: `def countdown(n):
    # 1. Base Case (Stop condition)
    if n <= 0:
        print("Blast off! 🚀")
        return
    
    # 2. Work & Recursive Step
    print(n)
    countdown(n - 1)  # Moves closer to base case

countdown(5)`,
                upvotes: ['usr_demo_1', 'usr_demo_3'],
                isBestAnswer: true,
                createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
            }
        ]
    },
    {
        id: 'doubt_6',
        title: 'Why is my Java NullPointerException occurring when accessing student name?',
        description: 'I created a Student class and an array of Student objects in Java. In my main method, I initialize `Student[] section = new Student[3];` and immediately try `section[0].name = "Rahul";`, but it throws `NullPointerException`. Why is it null when I just allocated the array with `new`?',
        language: 'Java',
        codeSnippet: `class Student {
    String name;
    int rollNumber;
}

public class Main {
    public static void main(String[] args) {
        Student[] section = new Student[3];
        // Throws NullPointerException below:
        section[0].name = "Rahul";
        System.out.println(section[0].name);
    }
}`,
        errorMessage: 'Exception in thread "main" java.lang.NullPointerException: Cannot assign field "name" because "section[0]" is null',
        screenshot: null,
        isAnonymous: false,
        authorId: 'usr_demo_4',
        authorName: 'Sneha Rao',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        upvotes: ['usr_demo_3'],
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        isSolved: false,
        answers: [
            {
                id: 'ans_6_1',
                authorId: 'usr_demo_3',
                authorName: 'Rohan Mehta',
                authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
                text: 'This is the #1 mistake beginner Java developers make with object arrays!\n\nWhen you run `Student[] section = new Student[3];`, you are only creating an array of **references**, and each slot is initialized to `null`. You have **not** instantiated any `Student` objects yet!\n\nYou must explicitly instantiate each object before accessing its fields:',
                codeSnippet: `Student[] section = new Student[3];

// Initialize each element before accessing fields:
section[0] = new Student();
section[0].name = "Rahul";

// Or initialize using a loop:
for (int i = 0; i < section.length; i++) {
    section[i] = new Student();
}`,
                upvotes: ['usr_demo_4'],
                isBestAnswer: false,
                createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
            }
        ]
    },
    {
        id: 'doubt_7',
        title: 'How to properly connect HTML, CSS, and JavaScript in a project?',
        description: 'I am building my first Web Development mini-project with `index.html`, `style.css`, and `script.js`. My styles are applying, but when I click my button, the JavaScript function says `Uncaught ReferenceError: myButton is not defined` or the script executes before DOM loads. What is the recommended way to link them?',
        language: 'Web Development',
        codeSnippet: `<!-- index.html snippet -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="style.css">
    <script src="script.js"></script> <!-- Included in head -->
    <title>My Project</title>
</head>
<body>
    <button id="submitBtn">Click Me</button>
</body>
</html>`,
        errorMessage: 'Uncaught TypeError: Cannot read properties of null (reading "addEventListener")',
        screenshot: null,
        isAnonymous: false,
        authorId: 'usr_demo_1',
        authorName: 'Arjun Sharma',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        upvotes: ['usr_demo_2'],
        createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
        isSolved: false,
        answers: [
            {
                id: 'ans_7_1',
                authorId: 'usr_demo_2',
                authorName: 'Priya Patel',
                authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
                text: 'The error `Cannot read properties of null` happens because your `<script>` is in the `<head>` without `defer`! When the browser executes `document.getElementById("submitBtn")`, the HTML parser hasn\'t created the `<button>` yet, returning `null`.\n\nYou have two clean solutions:\n\n1. **Modern standard (Best):** Add the `defer` attribute to the `<script>` tag in `<head>`.\n2. **Or:** Place the `<script>` tag right before the closing `</body>` tag.',
                codeSnippet: `<!-- Method 1: Recommended modern syntax in <head> -->
<head>
    <link rel="stylesheet" href="style.css">
    <script src="script.js" defer></script>
</head>

<!-- In script.js: -->
const btn = document.getElementById('submitBtn');
btn.addEventListener('click', () => {
    alert('Connected successfully!');
});`,
                upvotes: ['usr_demo_1'],
                isBestAnswer: false,
                createdAt: new Date(Date.now() - 1800000).toISOString()
            }
        ]
    }
];

const DEFAULT_NOTIFICATIONS = [
    {
        id: 'notif_1',
        userId: 'usr_demo_1',
        title: 'New answer on your doubt',
        message: 'Priya Patel replied to "Why is i <= 5 out of bounds in C?"',
        doubtId: 'doubt_1',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        isRead: false
    },
    {
        id: 'notif_2',
        userId: 'usr_demo_1',
        title: 'Upvote received',
        message: 'Rohan Mehta upvoted your answer on DSA traversal',
        doubtId: 'doubt_2',
        timestamp: new Date(Date.now() - 3600000 * 14).toISOString(),
        isRead: false
    },
    {
        id: 'notif_3',
        userId: 'usr_demo_1',
        title: 'Best Answer marked! 🏆',
        message: 'Your explanation on Python Indentation was marked as the Best Answer!',
        doubtId: 'doubt_3',
        timestamp: new Date(Date.now() - 3600000 * 9).toISOString(),
        isRead: true
    }
];

// ==========================================
// 2. Storage Initialization Engine
// ==========================================
const Storage = {
    /**
     * Initialize seed data in LocalStorage if not already present.
     * Note: Does NOT force an auto-login so students can register/log in independently.
     * 
     * BACKEND ARCHITECTURE NOTE:
     * This module serves as an abstraction layer over localStorage for this prototype.
     * For future production deployment, each method here maps directly to Firebase Firestore:
     * - getUsers() -> db.collection('users').get()
     * - getDoubts() -> db.collection('doubts').orderBy('createdAt', 'desc').onSnapshot()
     * - saveDoubt() -> db.collection('doubts').add(...)
     * - addAnswer() -> db.collection('doubts').doc(id).collection('answers').add(...)
     */
    init() {
        if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
            localStorage.setItem(STORAGE_KEYS.DOUBTS, JSON.stringify(DEFAULT_DOUBTS));
            localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(DEFAULT_NOTIFICATIONS));
            
            // Per-user bookmarks mapping: { [userId]: [doubtId, ...] }
            const initialBookmarks = {
                'usr_demo_1': ['doubt_1', 'doubt_4'],
                'usr_demo_2': ['doubt_1']
            };
            localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(initialBookmarks));
            
            // Mark as initialized without setting a permanent auto-login
            localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
        }
    },

    // ------------------------------------------
    // Real-Time Event Notifier
    // ------------------------------------------
    notifyDataChange(type, payload) {
        window.dispatchEvent(new CustomEvent('campusconnect:data_changed', {
            detail: { type, payload }
        }));
    },

    // ------------------------------------------
    // Route Protection Guard
    // ------------------------------------------
    requireAuth(returnUrl) {
        const user = this.getCurrentUser();
        if (!user) {
            const currentPath = returnUrl || window.location.pathname.split('/').pop() + window.location.search;
            const target = currentPath ? `login.html?redirect=${encodeURIComponent(currentPath)}` : 'login.html';
            window.location.href = target;
            return false;
        }
        return true;
    },

    // ------------------------------------------
    // User & Authentication Methods
    // ------------------------------------------
    getUsers() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
        } catch (e) {
            return DEFAULT_USERS;
        }
    },

    getCurrentUser() {
        try {
            const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
            return userStr ? JSON.parse(userStr) : null;
        } catch (e) {
            return null;
        }
    },

    setCurrentUser(user) {
        if (!user) {
            localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        } else {
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        }
        this.notifyDataChange('user_session', user);
    },

    login(email, password) {
        const users = this.getUsers();
        const found = users.find(u => u.email.toLowerCase().trim() === email.toLowerCase().trim() && u.password === password);
        if (found) {
            this.setCurrentUser(found);
            return { success: true, user: found };
        }
        return { success: false, message: 'Invalid college email or password. Please try again.' };
    },

    register(userData) {
        const users = this.getUsers();
        const existing = users.find(u => u.email.toLowerCase().trim() === userData.email.toLowerCase().trim());
        if (existing) {
            return { success: false, message: 'An account with this college email already exists.' };
        }

        const newUser = {
            id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
            name: userData.name,
            email: userData.email,
            password: userData.password,
            branch: userData.branch || 'B.Tech First Year',
            year: userData.year || '1st Year B.Tech',
            rollNo: userData.rollNo || '24' + Math.floor(1000 + Math.random() * 9000),
            bio: userData.bio || 'Eager engineering student ready to collaborate and debug.',
            avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=3b82f6&color=fff`,
            joinedDate: new Date().toISOString(),
            isVerified: true
        };

        users.push(newUser);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        this.setCurrentUser(newUser);

        // Add a welcome notification
        this.addNotification({
            userId: newUser.id,
            title: 'Welcome to CampusConnect! 🎉',
            message: 'Ask your first coding doubt or explore questions from peer students.',
            doubtId: null
        });

        this.notifyDataChange('user_registered', newUser);
        return { success: true, user: newUser };
    },

    logout() {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        this.notifyDataChange('logout', null);
    },

    updateUserProfile(updatedFields) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return false;

        const users = this.getUsers();
        const index = users.findIndex(u => u.id === currentUser.id);
        if (index !== -1) {
            users[index] = { ...users[index], ...updatedFields };
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
            this.setCurrentUser(users[index]);
            return true;
        }
        return false;
    },

    // ------------------------------------------
    // Doubts CRUD Methods
    // ------------------------------------------
    getDoubts() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.DOUBTS)) || [];
        } catch (e) {
            return [];
        }
    },

    getDoubtById(id) {
        const doubts = this.getDoubts();
        return doubts.find(d => d.id === id) || null;
    },

    saveDoubt(doubtData) {
        const doubts = this.getDoubts();
        const currentUser = this.getCurrentUser();

        const newDoubt = {
            id: 'doubt_' + Date.now(),
            title: doubtData.title,
            description: doubtData.description,
            language: doubtData.language,
            codeSnippet: doubtData.codeSnippet || '',
            errorMessage: doubtData.errorMessage || '',
            screenshot: doubtData.screenshot || null,
            isAnonymous: Boolean(doubtData.isAnonymous),
            authorId: currentUser ? currentUser.id : 'usr_anon',
            authorName: doubtData.isAnonymous ? 'Anonymous Student' : (currentUser ? currentUser.name : 'Guest Student'),
            authorAvatar: doubtData.isAnonymous 
                ? 'https://ui-avatars.com/api/?name=Anonymous+Student&background=64748b&color=fff' 
                : (currentUser ? currentUser.avatar : 'https://ui-avatars.com/api/?name=Student&background=3b82f6&color=fff'),
            upvotes: [],
            createdAt: new Date().toISOString(),
            isSolved: false,
            answers: []
        };

        doubts.unshift(newDoubt);
        localStorage.setItem(STORAGE_KEYS.DOUBTS, JSON.stringify(doubts));
        this.notifyDataChange('doubt_created', newDoubt);
        return newDoubt;
    },

    deleteDoubt(doubtId) {
        let doubts = this.getDoubts();
        const currentUser = this.getCurrentUser();
        const target = doubts.find(d => d.id === doubtId);
        if (!target) return false;

        // Verify authorization
        if (currentUser && (target.authorId === currentUser.id || currentUser.email.includes('admin'))) {
            doubts = doubts.filter(d => d.id !== doubtId);
            localStorage.setItem(STORAGE_KEYS.DOUBTS, JSON.stringify(doubts));
            this.notifyDataChange('doubt_deleted', doubtId);
            return true;
        }
        return false;
    },

    // ------------------------------------------
    // Upvotes Engine
    // ------------------------------------------
    toggleUpvoteDoubt(doubtId) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return { success: false, message: 'Please log in to upvote.' };

        const doubts = this.getDoubts();
        const doubt = doubts.find(d => d.id === doubtId);
        if (!doubt) return { success: false, message: 'Doubt not found.' };

        if (!Array.isArray(doubt.upvotes)) doubt.upvotes = [];

        const index = doubt.upvotes.indexOf(currentUser.id);
        let hasUpvoted = false;

        if (index > -1) {
            doubt.upvotes.splice(index, 1);
            hasUpvoted = false;
        } else {
            doubt.upvotes.push(currentUser.id);
            hasUpvoted = true;

            // Notify question author if someone else upvoted
            if (doubt.authorId !== currentUser.id && doubt.authorId !== 'usr_anon') {
                this.addNotification({
                    userId: doubt.authorId,
                    title: 'Your question received an upvote! 🚀',
                    message: `${currentUser.name} upvoted your question: "${doubt.title.substring(0, 30)}..."`,
                    doubtId: doubt.id
                });
            }
        }

        localStorage.setItem(STORAGE_KEYS.DOUBTS, JSON.stringify(doubts));
        this.notifyDataChange('upvote_doubt', { doubtId, hasUpvoted, count: doubt.upvotes.length });
        return { success: true, upvoted: hasUpvoted, count: doubt.upvotes.length };
    },

    toggleUpvoteAnswer(doubtId, answerId) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return { success: false, message: 'Please log in to upvote answers.' };

        const doubts = this.getDoubts();
        const doubt = doubts.find(d => d.id === doubtId);
        if (!doubt) return { success: false, message: 'Doubt not found.' };

        const answer = doubt.answers.find(a => a.id === answerId);
        if (!answer) return { success: false, message: 'Answer not found.' };

        if (!Array.isArray(answer.upvotes)) answer.upvotes = [];

        const index = answer.upvotes.indexOf(currentUser.id);
        let hasUpvoted = false;

        if (index > -1) {
            answer.upvotes.splice(index, 1);
            hasUpvoted = false;
        } else {
            answer.upvotes.push(currentUser.id);
            hasUpvoted = true;

            // Notify answer author
            if (answer.authorId !== currentUser.id) {
                this.addNotification({
                    userId: answer.authorId,
                    title: 'Helpful answer upvoted! ⭐',
                    message: `${currentUser.name} found your explanation helpful.`,
                    doubtId: doubt.id
                });
            }
        }

        localStorage.setItem(STORAGE_KEYS.DOUBTS, JSON.stringify(doubts));
        this.notifyDataChange('upvote_answer', { doubtId, answerId, hasUpvoted, count: answer.upvotes.length });
        return { success: true, upvoted: hasUpvoted, count: answer.upvotes.length };
    },

    // ------------------------------------------
    // Answers & Best Answer Engine
    // ------------------------------------------
    addAnswer(doubtId, answerData) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return { success: false, message: 'Please log in to submit an answer.' };

        if (!answerData || !answerData.text || !answerData.text.trim()) {
            return { success: false, message: 'Answer content cannot be empty. Please provide your explanation.' };
        }

        const doubts = this.getDoubts();
        const doubt = doubts.find(d => d.id === doubtId);
        if (!doubt) return { success: false, message: 'Doubt not found.' };

        const newAnswer = {
            id: 'ans_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
            authorId: currentUser.id,
            authorName: currentUser.name,
            authorAvatar: currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=3b82f6&color=fff`,
            text: answerData.text.trim(),
            codeSnippet: answerData.codeSnippet ? answerData.codeSnippet.trim() : null,
            upvotes: [],
            isBestAnswer: false,
            createdAt: new Date().toISOString()
        };

        if (!Array.isArray(doubt.answers)) doubt.answers = [];
        doubt.answers.push(newAnswer);
        localStorage.setItem(STORAGE_KEYS.DOUBTS, JSON.stringify(doubts));

        // Send notification to doubt author
        if (doubt.authorId !== currentUser.id && doubt.authorId !== 'usr_anon') {
            this.addNotification({
                userId: doubt.authorId,
                title: 'New answer from classmate!',
                message: `${currentUser.name} answered: "${doubt.title.substring(0, 32)}..."`,
                doubtId: doubt.id
            });
        }

        this.notifyDataChange('answer_added', { doubtId, answer: newAnswer });
        return { success: true, answer: newAnswer };
    },

    toggleBestAnswer(doubtId, answerId) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return { success: false, message: 'Please log in.' };

        const doubts = this.getDoubts();
        const doubt = doubts.find(d => d.id === doubtId);
        if (!doubt) return { success: false, message: 'Doubt not found.' };

        // Only the student who posted the doubt can mark the best answer
        if (doubt.authorId !== currentUser.id) {
            return { success: false, message: 'Only the student who asked this doubt can mark the Best Answer.' };
        }

        const answer = doubt.answers.find(a => a.id === answerId);
        if (!answer) return { success: false, message: 'Answer not found.' };

        const currentlyBest = Boolean(answer.isBestAnswer);

        // Reset all answers
        doubt.answers.forEach(a => a.isBestAnswer = false);

        if (!currentlyBest) {
            answer.isBestAnswer = true;
            doubt.isSolved = true;

            // Notify answer author
            if (answer.authorId !== currentUser.id) {
                this.addNotification({
                    userId: answer.authorId,
                    title: 'Your answer was marked as Best Answer! 🏆',
                    message: `${currentUser.name} accepted your answer as the verified solution.`,
                    doubtId: doubt.id
                });
            }
        } else {
            // Unmarked
            doubt.isSolved = doubt.answers.some(a => a.isBestAnswer);
        }

        localStorage.setItem(STORAGE_KEYS.DOUBTS, JSON.stringify(doubts));
        this.notifyDataChange('best_answer_toggled', { doubtId, answerId, isBestAnswer: answer.isBestAnswer, isSolved: doubt.isSolved });
        return { success: true, isBestAnswer: answer.isBestAnswer, isSolved: doubt.isSolved };
    },

    // ------------------------------------------
    // Bookmarks / Saved Doubts (Per User)
    // ------------------------------------------
    getBookmarks() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return [];

        try {
            const raw = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKS)) || {};
            if (Array.isArray(raw)) {
                return raw; // Migration support
            }
            return Array.isArray(raw[currentUser.id]) ? raw[currentUser.id] : [];
        } catch (e) {
            return [];
        }
    },

    toggleBookmark(doubtId) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return { success: false, message: 'Please log in to save questions.' };

        try {
            let raw = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKS)) || {};
            if (Array.isArray(raw)) {
                const temp = {};
                temp[currentUser.id] = raw;
                raw = temp;
            }

            if (!Array.isArray(raw[currentUser.id])) {
                raw[currentUser.id] = [];
            }

            const userBookmarks = raw[currentUser.id];
            const index = userBookmarks.indexOf(doubtId);
            let saved = false;

            if (index > -1) {
                userBookmarks.splice(index, 1);
                saved = false;
            } else {
                userBookmarks.push(doubtId);
                saved = true;
            }

            raw[currentUser.id] = userBookmarks;
            localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(raw));
            this.notifyDataChange('bookmark_toggled', { doubtId, saved });
            return { success: true, saved };
        } catch (e) {
            return { success: false, message: 'Failed to update bookmarks.' };
        }
    },

    isBookmarked(doubtId) {
        const bookmarks = this.getBookmarks();
        return bookmarks.includes(doubtId);
    },

    // ------------------------------------------
    // Notifications Engine
    // ------------------------------------------
    getNotifications() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return [];

        try {
            const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) || [];
            return all.filter(n => n.userId === currentUser.id);
        } catch (e) {
            return [];
        }
    },

    addNotification(notifData) {
        try {
            const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) || [];
            const newNotif = {
                id: 'notif_' + Date.now() + Math.random().toString(36).substring(2, 5),
                userId: notifData.userId,
                title: notifData.title,
                message: notifData.message,
                doubtId: notifData.doubtId || null,
                timestamp: new Date().toISOString(),
                isRead: false
            };
            all.unshift(newNotif);
            localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
            return newNotif;
        } catch (e) {
            return null;
        }
    },

    markNotificationsRead() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return;

        try {
            const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) || [];
            all.forEach(n => {
                if (n.userId === currentUser.id) n.isRead = true;
            });
            localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
        } catch (e) {}
    },

    // ------------------------------------------
    // Analytics & Stats Engine
    // ------------------------------------------
    getStats() {
        const doubts = this.getDoubts();
        const users = this.getUsers();

        const totalDoubts = doubts.length;
        const solvedDoubts = doubts.filter(d => d.isSolved).length;
        const unansweredDoubts = doubts.filter(d => !d.answers || d.answers.length === 0).length;
        const totalMembers = users.length + 348; // Base student cohort demo counter

        return {
            totalDoubts,
            solvedDoubts,
            unansweredDoubts,
            totalMembers
        };
    },

    getUserStats(userId) {
        const doubts = this.getDoubts();
        
        let doubtsAsked = 0;
        let answersGiven = 0;
        let upvotesReceived = 0;
        let solvedCount = 0;

        doubts.forEach(d => {
            if (d.authorId === userId) {
                doubtsAsked++;
                upvotesReceived += (d.upvotes ? d.upvotes.length : 0);
                if (d.isSolved) solvedCount++;
            }

            if (Array.isArray(d.answers)) {
                d.answers.forEach(a => {
                    if (a.authorId === userId) {
                        answersGiven++;
                        upvotesReceived += (a.upvotes ? a.upvotes.length : 0);
                        if (a.isBestAnswer) solvedCount++;
                    }
                });
            }
        });

        return {
            doubtsAsked,
            answersGiven,
            upvotesReceived,
            solvedCount
        };
    },

    // Reset database to initial state
    resetToDemoData() {
        localStorage.clear();
        this.init();
    }
};

// ==========================================
// 3. UI Helpers (Toasts, Date Formatting, HTML Escaping)
// ==========================================

function showToast(message, type = 'info', icon = '') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-check-circle';
    if (type === 'error') iconClass = 'fa-exclamation-circle';
    if (type === 'warning') iconClass = 'fa-triangle-exclamation';

    toast.innerHTML = `
        <div class="toast-content">
            <i class="fa-solid ${icon || iconClass} toast-icon"></i>
            <span class="toast-message">${escapeHtml(message)}</span>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
        toast.classList.add('toast-fadeout');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function formatTimeAgo(isoString) {
    if (!isoString) return 'Just now';
    const date = new Date(isoString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Auto-initialize storage on script load
Storage.init();

// Cross-tab Synchronization: propagate storage updates across multiple browser tabs
window.addEventListener('storage', (e) => {
    if (Object.values(STORAGE_KEYS).includes(e.key)) {
        window.dispatchEvent(new CustomEvent('campusconnect:data_changed', {
            detail: { key: e.key, newValue: e.newValue }
        }));
    }
});


