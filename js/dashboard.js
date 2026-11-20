/**
 * CampusConnect – Doubt Exchange
 * dashboard.js - Student Dashboard Analytics, Dynamic Doubts Feed, & Tab Switching
 */

document.addEventListener('DOMContentLoaded', () => {
    initDashboard();

    // Real-time synchronization within window and cross-tabs
    window.addEventListener('campusconnect:data_changed', () => {
        renderDashboardStats();
        renderDashboardDoubts(currentDashboardFilter);
    });
});

function initDashboard() {
    const currentUser = Storage.getCurrentUser();
    if (!currentUser) {
        // Redirect to login if unauthenticated on dashboard
        window.location.href = 'login.html';
        return;
    }

    renderWelcomeBanner(currentUser);
    renderDashboardStats();
    renderDashboardDoubts('recent');
    initDashboardTabs();
}

// ------------------------------------------
// 1. Welcome Greeting & Time of Day
// ------------------------------------------
function renderWelcomeBanner(user) {
    const greetingEl = document.getElementById('dashboard-greeting');
    const userRoleEl = document.getElementById('dashboard-user-role');

    if (!greetingEl) return;

    const hour = new Date().getHours();
    let timeGreeting = 'Good day';
    if (hour < 12) timeGreeting = 'Good morning';
    else if (hour < 18) timeGreeting = 'Good afternoon';
    else timeGreeting = 'Good evening';

    greetingEl.textContent = `${timeGreeting}, ${user.name}! 👋`;
    if (userRoleEl) {
        userRoleEl.textContent = `${user.year} • ${user.branch}`;
    }
}

// ------------------------------------------
// 2. Dashboard Analytics Counter Cards
// ------------------------------------------
function renderDashboardStats() {
    const stats = Storage.getStats();

    const totalEl = document.getElementById('stat-total-doubts');
    const solvedEl = document.getElementById('stat-solved-doubts');
    const unansweredEl = document.getElementById('stat-unanswered-doubts');
    const membersEl = document.getElementById('stat-total-members');

    if (totalEl) totalEl.textContent = stats.totalDoubts;
    if (solvedEl) solvedEl.textContent = stats.solvedDoubts;
    if (unansweredEl) unansweredEl.textContent = stats.unansweredDoubts;
    if (membersEl) membersEl.textContent = stats.totalMembers;
}

// ------------------------------------------
// 3. Render Doubts List with Filter Tabs
// ------------------------------------------
let currentDashboardFilter = 'recent';

function initDashboardTabs() {
    const tabButtons = document.querySelectorAll('.dashboard-tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterType = btn.getAttribute('data-filter') || 'recent';
            currentDashboardFilter = filterType;
            renderDashboardDoubts(filterType);
        });
    });
}

function renderDashboardDoubts(filterType = 'recent') {
    const container = document.getElementById('dashboard-doubts-feed');
    if (!container) return;

    let doubts = Storage.getDoubts();
    const currentUser = Storage.getCurrentUser();

    // Filter & sort logic
    if (filterType === 'recent') {
        doubts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filterType === 'trending') {
        // Trending based on combined upvotes and answers
        doubts.sort((a, b) => {
            const scoreB = ((b.upvotes ? b.upvotes.length : 0) * 2) + ((b.answers ? b.answers.length : 0) * 3);
            const scoreA = ((a.upvotes ? a.upvotes.length : 0) * 2) + ((a.answers ? a.answers.length : 0) * 3);
            return scoreB - scoreA;
        });
    } else if (filterType === 'unanswered') {
        doubts = doubts.filter(d => !d.answers || d.answers.length === 0);
    }

    if (doubts.length === 0) {
        container.innerHTML = `
            <div class="empty-state-card" style="padding: 2.5rem 1rem;">
                <div class="empty-state-icon">
                    <i class="fa-solid fa-code"></i>
                </div>
                <h4 class="empty-state-title">No doubts found in this view</h4>
                <p class="empty-state-desc">Got a coding bug or assignment problem? Be the first to ask!</p>
                <a href="ask-doubt.html" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-plus"></i> Ask a Doubt Now
                </a>
            </div>
        `;
        return;
    }

    // Limit to 5 on the dashboard feed
    const displayDoubts = doubts.slice(0, 5);

    container.innerHTML = displayDoubts.map(doubt => {
        const isUpvoted = currentUser && Array.isArray(doubt.upvotes) && doubt.upvotes.includes(currentUser.id);
        const isBookmarked = Storage.isBookmarked(doubt.id);
        const upvoteCount = doubt.upvotes ? doubt.upvotes.length : 0;
        const answerCount = doubt.answers ? doubt.answers.length : 0;
        const langClass = getLangBadgeClass(doubt.language);

        return `
            <div class="doubt-card" id="card-${doubt.id}">
                <div class="doubt-card-top">
                    <div class="doubt-card-tags">
                        <span class="lang-badge ${langClass}">${escapeHtml(doubt.language)}</span>
                        ${doubt.isSolved ? '<span class="badge badge-solved"><i class="fa-solid fa-circle-check"></i> Solved</span>' : '<span class="badge badge-warning"><i class="fa-regular fa-clock"></i> Unsolved</span>'}
                        ${doubt.isAnonymous ? '<span class="badge badge-anon"><i class="fa-solid fa-user-secret"></i> Anonymous</span>' : ''}
                    </div>
                    <span style="font-size: 0.8rem; color: var(--text-subtle);">
                        <i class="fa-regular fa-clock"></i> ${formatTimeAgo(doubt.createdAt)}
                    </span>
                </div>

                <h3 class="doubt-card-title" onclick="openDoubtDetails('${doubt.id}')">
                    ${escapeHtml(doubt.title)}
                </h3>

                <p class="doubt-card-desc">
                    ${escapeHtml(doubt.description)}
                </p>

                <div class="doubt-card-footer">
                    <div class="doubt-author-info">
                        <img src="${doubt.authorAvatar}" alt="${escapeHtml(doubt.authorName)}" class="doubt-author-avatar">
                        <span class="doubt-author-name">${escapeHtml(doubt.authorName)}</span>
                    </div>

                    <div class="doubt-stats-actions">
                        <span class="doubt-stat-pill">
                            <i class="fa-regular fa-comment-dots"></i> ${answerCount} ${answerCount === 1 ? 'answer' : 'answers'}
                        </span>

                        <button class="doubt-action-btn ${isUpvoted ? 'active' : ''}" onclick="handleDashboardUpvote('${doubt.id}')" title="Upvote">
                            <i class="${isUpvoted ? 'fa-solid' : 'fa-regular'} fa-thumbs-up"></i>
                            <span id="dash-upvotes-${doubt.id}">${upvoteCount}</span>
                        </button>

                        <button class="doubt-action-btn ${isBookmarked ? 'bookmarked' : ''}" onclick="handleDashboardBookmark('${doubt.id}')" title="Bookmark">
                            <i class="${isBookmarked ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
                        </button>

                        <a href="doubt-details.html?id=${doubt.id}" class="btn btn-primary btn-sm" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">
                            View Discussion <i class="fa-solid fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function openDoubtDetails(doubtId) {
    window.location.href = `doubt-details.html?id=${doubtId}`;
}

function handleDashboardUpvote(doubtId) {
    const res = Storage.toggleUpvoteDoubt(doubtId);
    if (!res.success) {
        showToast(res.message, 'warning');
        return;
    }

    // Refresh doubt feed silently
    renderDashboardDoubts(currentDashboardFilter);
    showToast(res.upvoted ? 'Upvoted question! 🚀' : 'Upvote removed', 'info');
}

function handleDashboardBookmark(doubtId) {
    const res = Storage.toggleBookmark(doubtId);
    renderDashboardDoubts(currentDashboardFilter);
    showToast(res.saved ? 'Saved to bookmarks' : 'Removed from bookmarks', 'info');
}

function getLangBadgeClass(lang) {
    if (!lang) return 'lang-c';
    const l = lang.toLowerCase();
    if (l.includes('c++') || l.includes('cpp')) return 'lang-cpp';
    if (l === 'c') return 'lang-c';
    if (l.includes('python')) return 'lang-python';
    if (l.includes('java') && !l.includes('script')) return 'lang-java';
    if (l.includes('dsa') || l.includes('struct') || l.includes('algo')) return 'lang-dsa';
    if (l.includes('web') || l.includes('html') || l.includes('css') || l.includes('js')) return 'lang-web';
    return 'lang-c';
}

