/**
 * CampusConnect – Doubt Exchange
 * main.js - Shared UI Logic, Navigation, Notifications, & Global Helpers
 */

document.addEventListener('DOMContentLoaded', () => {
    initAppNavbar();
    initNotificationDropdown();
    initCodeCopyButtons();
    initMobileSidebarToggle();
});

// ------------------------------------------
// 1. Navigation & Current User Status Sync
// ------------------------------------------
function initAppNavbar() {
    const currentUser = Storage.getCurrentUser();
    
    // Update public navbar user action buttons if on landing page
    const publicNavActions = document.getElementById('public-nav-actions');
    if (publicNavActions) {
        if (currentUser) {
            publicNavActions.innerHTML = `
                <a href="dashboard.html" class="btn btn-secondary btn-sm">
                    <i class="fa-solid fa-gauge"></i> Dashboard
                </a>
                <a href="ask-doubt.html" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-plus"></i> Ask Doubt
                </a>
                <button onclick="handleLogout()" class="btn btn-ghost btn-sm" title="Log Out">
                    <i class="fa-solid fa-right-from-bracket"></i>
                </button>
            `;
        } else {
            publicNavActions.innerHTML = `
                <a href="login.html" class="btn btn-ghost btn-sm">Log In</a>
                <a href="signup.html" class="btn btn-primary btn-sm">Sign Up</a>
            `;
        }
    }

    // Update app sidebar user card if present
    const sidebarUserCard = document.getElementById('sidebar-user-info');
    if (sidebarUserCard && currentUser) {
        sidebarUserCard.innerHTML = `
            <img src="${currentUser.avatar}" alt="${escapeHtml(currentUser.name)}" class="sidebar-user-avatar">
            <div class="sidebar-user-info">
                <div class="sidebar-user-name">${escapeHtml(currentUser.name)}</div>
                <div class="sidebar-user-branch">${escapeHtml(currentUser.year)} • ${escapeHtml(currentUser.branch.split(' ')[0])}</div>
            </div>
        `;
    }

    // Update top header user pill if present
    const headerUserPill = document.getElementById('header-user-pill');
    if (headerUserPill && currentUser) {
        headerUserPill.innerHTML = `
            <img src="${currentUser.avatar}" alt="${escapeHtml(currentUser.name)}" class="header-user-img">
            <span class="header-user-name">${escapeHtml(currentUser.name)}</span>
            <i class="fa-solid fa-chevron-right" style="font-size: 0.75rem; color: var(--text-subtle);"></i>
        `;
        headerUserPill.onclick = () => window.location.href = 'profile.html';
    }
}

// ------------------------------------------
// 2. Notifications System Dropdown
// ------------------------------------------
function initNotificationDropdown() {
    const bellBtn = document.getElementById('notif-bell-btn');
    const dropdown = document.getElementById('notif-dropdown');
    const badge = document.getElementById('notif-badge');
    const list = document.getElementById('notif-list');

    if (!bellBtn || !dropdown) return;

    // Load initial count and items
    const refreshNotifications = () => {
        const notifs = Storage.getNotifications();
        const unreadCount = notifs.filter(n => !n.isRead).length;

        if (badge) {
            if (unreadCount > 0) {
                badge.style.display = 'flex';
                badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
            } else {
                badge.style.display = 'none';
            }
        }

        if (list) {
            if (notifs.length === 0) {
                list.innerHTML = `
                    <div class="notif-empty">
                        <i class="fa-regular fa-bell-slash" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
                        No notifications yet.
                    </div>
                `;
            } else {
                list.innerHTML = notifs.map(n => `
                    <li class="notif-item ${!n.isRead ? 'unread' : ''}" onclick="handleNotifClick('${n.doubtId || ''}')">
                        <div class="notif-item-title">${escapeHtml(n.title)}</div>
                        <div class="notif-item-desc">${escapeHtml(n.message)}</div>
                        <div class="notif-item-time">${formatTimeAgo(n.timestamp)}</div>
                    </li>
                `).join('');
            }
        }
    };

    refreshNotifications();

    bellBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
        if (dropdown.classList.contains('show')) {
            Storage.markNotificationsRead();
            if (badge) badge.style.display = 'none';
        }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== bellBtn) {
            dropdown.classList.remove('show');
        }
    });
}

function handleNotifClick(doubtId) {
    if (doubtId) {
        window.location.href = `doubt-details.html?id=${doubtId}`;
    }
}

// ------------------------------------------
// 3. Mobile Sidebar / Navbar Drawer
// ------------------------------------------
function initMobileSidebarToggle() {
    // Public landing navbar mobile toggle
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // App internal sidebar mobile toggle
    const sidebarToggle = document.getElementById('sidebar-toggle-btn');
    const appSidebar = document.getElementById('app-sidebar');
    if (sidebarToggle && appSidebar) {
        sidebarToggle.addEventListener('click', () => {
            appSidebar.classList.toggle('open');
        });

        // Close on tap outside
        document.addEventListener('click', (e) => {
            if (!appSidebar.contains(e.target) && e.target !== sidebarToggle && !sidebarToggle.contains(e.target)) {
                appSidebar.classList.remove('open');
            }
        });
    }
}

// ------------------------------------------
// 4. Code Blocks Copy Feature
// ------------------------------------------
function initCodeCopyButtons() {
    document.addEventListener('click', (e) => {
        const copyBtn = e.target.closest('.copy-code-btn');
        if (!copyBtn) return;

        const codeContainer = copyBtn.closest('.code-container');
        if (!codeContainer) return;

        const codeBlock = codeContainer.querySelector('code') || codeContainer.querySelector('pre');
        if (!codeBlock) return;

        const codeText = codeBlock.innerText;
        navigator.clipboard.writeText(codeText).then(() => {
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
            copyBtn.style.color = 'var(--success)';
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.style.color = '';
            }, 2000);
        }).catch(() => {
            showToast('Unable to copy to clipboard', 'error');
        });
    });
}

// ------------------------------------------
// 5. Global Logout Handler
// ------------------------------------------
function handleLogout() {
    if (confirm('Are you sure you want to log out of CampusConnect?')) {
        Storage.logout();
        showToast('Logged out successfully', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 600);
    }
}

