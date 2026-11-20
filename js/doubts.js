/**
 * CampusConnect – Doubt Exchange
 * doubts.js - Explore Doubts, Search & Filter, Ask Doubt, Doubt Details & Discussion, and Profile Tabs
 */

document.addEventListener('DOMContentLoaded', () => {
    initExplorePage();
    initAskDoubtPage();
    initDoubtDetailsPage();
    initProfilePage();

    // Real-time synchronization across events & browser tabs
    window.addEventListener('campusconnect:data_changed', () => {
        if (document.getElementById('explore-doubts-feed')) {
            renderExploreDoubts();
        }
        if (document.getElementById('doubt-details-container') && currentDoubtId) {
            renderDoubtDetails();
        }
        if (document.getElementById('profile-view-wrap')) {
            const currentUser = Storage.getCurrentUser();
            if (currentUser) {
                renderProfileStats(currentUser.id);
                renderProfileTabContent(currentUser, currentProfileTab);
            }
        }
    });
});

// Helper: Language CSS classes
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

// ==========================================
// 1. Explore Doubts (Search & Filter)
// ==========================================
let exploreSearchTerm = '';
let exploreSelectedCategory = 'All';
let exploreSelectedStatus = 'all';

function initExplorePage() {
    const exploreContainer = document.getElementById('explore-doubts-feed');
    if (!exploreContainer) return;

    // Route Protection: must be logged in to view doubts
    if (!Storage.requireAuth('explore.html')) {
        return;
    }

    const searchInput = document.getElementById('explore-search-input');
    const searchClearBtn = document.getElementById('search-clear-btn');
    const categoryPills = document.querySelectorAll('.cat-pill');
    const statusSelect = document.getElementById('status-filter-select');

    // Check URL parameters for pre-selected filter or search
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('category')) {
        exploreSelectedCategory = urlParams.get('category');
    }
    if (urlParams.get('search')) {
        exploreSearchTerm = urlParams.get('search');
        if (searchInput) searchInput.value = exploreSearchTerm;
        if (searchClearBtn) searchClearBtn.classList.add('visible');
    }

    // Category pills click handler
    categoryPills.forEach(pill => {
        const cat = pill.getAttribute('data-cat');
        if (cat.toLowerCase() === exploreSelectedCategory.toLowerCase()) {
            pill.classList.add('active');
        } else {
            pill.classList.remove('active');
        }

        pill.addEventListener('click', () => {
            categoryPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            exploreSelectedCategory = pill.getAttribute('data-cat');
            renderExploreDoubts();
        });
    });

    // Search input handler
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            exploreSearchTerm = e.target.value.trim().toLowerCase();
            if (searchClearBtn) {
                if (exploreSearchTerm.length > 0) {
                    searchClearBtn.classList.add('visible');
                } else {
                    searchClearBtn.classList.remove('visible');
                }
            }
            renderExploreDoubts();
        });
    }

    // Clear search button
    if (searchClearBtn) {
        searchClearBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            exploreSearchTerm = '';
            searchClearBtn.classList.remove('visible');
            renderExploreDoubts();
        });
    }

    // Status select filter
    if (statusSelect) {
        statusSelect.addEventListener('change', (e) => {
            exploreSelectedStatus = e.target.value;
            renderExploreDoubts();
        });
    }

    renderExploreDoubts();
}

function renderExploreDoubts() {
    const container = document.getElementById('explore-doubts-feed');
    const resultCountEl = document.getElementById('explore-results-count');
    if (!container) return;

    let doubts = Storage.getDoubts();
    const currentUser = Storage.getCurrentUser();

    // 1. Filter by category
    if (exploreSelectedCategory && exploreSelectedCategory !== 'All') {
        const cat = exploreSelectedCategory.toLowerCase();
        doubts = doubts.filter(d => {
            const dLang = d.language.toLowerCase();
            if (cat === 'c' && dLang === 'c') return true;
            if (cat === 'python' && dLang.includes('python')) return true;
            if (cat === 'java' && dLang.includes('java') && !dLang.includes('script')) return true;
            if (cat === 'dsa' && (dLang.includes('dsa') || dLang.includes('struct') || dLang.includes('algo'))) return true;
            if (cat === 'web development' && (dLang.includes('web') || dLang.includes('html') || dLang.includes('css') || dLang.includes('js'))) return true;
            return dLang.includes(cat);
        });
    }

    // 2. Filter by status (solved / unsolved)
    if (exploreSelectedStatus === 'solved') {
        doubts = doubts.filter(d => d.isSolved);
    } else if (exploreSelectedStatus === 'unsolved') {
        doubts = doubts.filter(d => !d.isSolved);
    }

    // 3. Search filter (across title, description, language, and error trace!)
    if (exploreSearchTerm) {
        const query = exploreSearchTerm.toLowerCase();
        doubts = doubts.filter(d => {
            const matchTitle = d.title.toLowerCase().includes(query);
            const matchDesc = d.description.toLowerCase().includes(query);
            const matchLang = d.language.toLowerCase().includes(query);
            const matchError = d.errorMessage ? d.errorMessage.toLowerCase().includes(query) : false;
            return matchTitle || matchDesc || matchLang || matchError;
        });
    }

    if (resultCountEl) {
        resultCountEl.textContent = `Showing ${doubts.length} ${doubts.length === 1 ? 'doubt' : 'doubts'}`;
    }

    if (doubts.length === 0) {
        container.innerHTML = `
            <div class="empty-state-card">
                <div class="empty-state-icon">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </div>
                <h3 class="empty-state-title">No doubts match your search</h3>
                <p class="empty-state-desc">Try checking for spelling errors, clearing category filters, or be the first classmate to ask this question!</p>
                <a href="ask-doubt.html" class="btn btn-primary">
                    <i class="fa-solid fa-plus"></i> Ask This Doubt Now
                </a>
            </div>
        `;
        return;
    }

    container.innerHTML = doubts.map(doubt => {
        const isUpvoted = currentUser && Array.isArray(doubt.upvotes) && doubt.upvotes.includes(currentUser.id);
        const isBookmarked = Storage.isBookmarked(doubt.id);
        const upvoteCount = doubt.upvotes ? doubt.upvotes.length : 0;
        const answerCount = doubt.answers ? doubt.answers.length : 0;
        const langClass = getLangBadgeClass(doubt.language);

        return `
            <div class="doubt-card">
                <div class="doubt-card-top">
                    <div class="doubt-card-tags">
                        <span class="lang-badge ${langClass}">${escapeHtml(doubt.language)}</span>
                        ${doubt.isSolved ? '<span class="badge badge-solved"><i class="fa-solid fa-circle-check"></i> Solved</span>' : '<span class="badge badge-warning"><i class="fa-regular fa-clock"></i> Unsolved</span>'}
                        ${doubt.isAnonymous ? '<span class="badge badge-anon"><i class="fa-solid fa-user-secret"></i> Anonymous Student</span>' : ''}
                    </div>
                    <span style="font-size: 0.8rem; color: var(--text-subtle);">
                        <i class="fa-regular fa-clock"></i> ${formatTimeAgo(doubt.createdAt)}
                    </span>
                </div>

                <h3 class="doubt-card-title" onclick="window.location.href='doubt-details.html?id=${doubt.id}'">
                    ${escapeHtml(doubt.title)}
                </h3>

                <p class="doubt-card-desc">
                    ${escapeHtml(doubt.description)}
                </p>

                ${doubt.errorMessage ? `
                    <div style="font-family: var(--font-code); font-size: 0.8rem; background: #fff1f2; color: #be123c; padding: 0.35rem 0.65rem; border-radius: var(--radius-sm); border: 1px solid #fecdd3; display: flex; align-items: center; gap: 0.5rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <span>${escapeHtml(doubt.errorMessage)}</span>
                    </div>
                ` : ''}

                <div class="doubt-card-footer">
                    <div class="doubt-author-info">
                        <img src="${doubt.authorAvatar}" alt="${escapeHtml(doubt.authorName)}" class="doubt-author-avatar">
                        <span class="doubt-author-name">${escapeHtml(doubt.authorName)}</span>
                    </div>

                    <div class="doubt-stats-actions">
                        <span class="doubt-stat-pill">
                            <i class="fa-regular fa-comment-dots"></i> ${answerCount} ${answerCount === 1 ? 'answer' : 'answers'}
                        </span>

                        <button class="doubt-action-btn ${isUpvoted ? 'active' : ''}" onclick="handleExploreUpvote('${doubt.id}')" title="Upvote">
                            <i class="${isUpvoted ? 'fa-solid' : 'fa-regular'} fa-thumbs-up"></i>
                            <span>${upvoteCount}</span>
                        </button>

                        <button class="doubt-action-btn ${isBookmarked ? 'bookmarked' : ''}" onclick="handleExploreBookmark('${doubt.id}')" title="Bookmark">
                            <i class="${isBookmarked ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
                        </button>

                        <a href="doubt-details.html?id=${doubt.id}" class="btn btn-primary btn-sm" style="padding: 0.35rem 0.85rem; font-size: 0.82rem;">
                            <i class="fa-regular fa-comments"></i> View Discussion
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function handleExploreUpvote(doubtId) {
    const res = Storage.toggleUpvoteDoubt(doubtId);
    if (!res.success) {
        showToast(res.message, 'warning');
        return;
    }
    renderExploreDoubts();
    showToast(res.upvoted ? 'Upvoted question! 🚀' : 'Upvote removed', 'info');
}

function handleExploreBookmark(doubtId) {
    const res = Storage.toggleBookmark(doubtId);
    renderExploreDoubts();
    showToast(res.saved ? 'Saved to bookmarks' : 'Removed from bookmarks', 'info');
}

// ==========================================
// 2. Ask a Doubt Page
// ==========================================
let uploadedScreenshotDataUrl = null;

function initAskDoubtPage() {
    const form = document.getElementById('ask-doubt-form');
    if (!form) return;

    // Route Protection: must be logged in to ask a doubt
    if (!Storage.requireAuth('ask-doubt.html')) {
        return;
    }
    const currentUser = Storage.getCurrentUser();

    // Image file upload & preview
    const fileInput = document.getElementById('screenshot-file-input');
    const dropzone = document.getElementById('screenshot-dropzone');
    const previewWrap = document.getElementById('image-preview-wrapper');
    const previewImg = document.getElementById('image-preview-img');
    const removeImgBtn = document.getElementById('remove-image-btn');

    if (dropzone && fileInput) {
        dropzone.addEventListener('click', (e) => {
            if (e.target !== removeImgBtn) {
                fileInput.click();
            }
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Validate image type
            if (!file.type.startsWith('image/')) {
                showToast('Please select a valid image file (PNG, JPG, JPEG).', 'error');
                return;
            }

            // Max size 3MB
            if (file.size > 3 * 1024 * 1024) {
                showToast('Image file size must be under 3MB.', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                uploadedScreenshotDataUrl = event.target.result;
                if (previewImg) previewImg.src = uploadedScreenshotDataUrl;
                if (previewWrap) previewWrap.style.display = 'inline-block';
                if (dropzone) dropzone.style.display = 'none';
            };
            reader.readAsDataURL(file);
        });
    }

    if (removeImgBtn) {
        removeImgBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            uploadedScreenshotDataUrl = null;
            if (fileInput) fileInput.value = '';
            if (previewWrap) previewWrap.style.display = 'none';
            if (dropzone) dropzone.style.display = 'block';
        });
    }

    // Anonymous toggle indicator
    const anonCheckbox = document.getElementById('anonymous-toggle');
    const anonAuthorPreview = document.getElementById('anon-author-preview');
    if (anonCheckbox && anonAuthorPreview) {
        anonCheckbox.addEventListener('change', () => {
            if (anonCheckbox.checked) {
                anonAuthorPreview.textContent = 'Posting as: Anonymous Student (Your identity is protected)';
                anonAuthorPreview.style.color = 'var(--text-muted)';
            } else {
                anonAuthorPreview.textContent = `Posting as: ${currentUser.name} (${currentUser.branch})`;
                anonAuthorPreview.style.color = 'var(--primary)';
            }
        });
    }

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const titleInput = document.getElementById('doubt-title');
        const langInput = document.getElementById('doubt-language');
        const descInput = document.getElementById('doubt-description');
        const codeInput = document.getElementById('doubt-code');
        const errorInput = document.getElementById('doubt-error');
        const isAnon = anonCheckbox ? anonCheckbox.checked : false;

        const title = titleInput.value.trim();
        const language = langInput.value;
        const description = descInput.value.trim();
        const codeSnippet = codeInput ? codeInput.value.trim() : '';
        const errorMessage = errorInput ? errorInput.value.trim() : '';

        // Validation
        if (!title || !language || !description) {
            showToast('Please fill in the title, language, and description.', 'error');
            return;
        }

        if (title.length < 10) {
            showToast('Question title should be at least 10 characters long.', 'warning');
            return;
        }

        const newDoubt = Storage.saveDoubt({
            title,
            language,
            description,
            codeSnippet,
            errorMessage,
            screenshot: uploadedScreenshotDataUrl,
            isAnonymous: isAnon
        });

        showToast('Your doubt has been posted to classmates! 🚀', 'success');
        setTimeout(() => {
            window.location.href = `doubt-details.html?id=${newDoubt.id}`;
        }, 800);
    });
}

// ==========================================
// 3. Doubt Details & Discussion Page
// ==========================================
let currentDoubtId = null;

function initDoubtDetailsPage() {
    const detailsContainer = document.getElementById('doubt-details-container');
    if (!detailsContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    currentDoubtId = urlParams.get('id');

    // Route Protection: must be logged in to view doubt discussion
    if (!Storage.requireAuth(currentDoubtId ? `doubt-details.html?id=${currentDoubtId}` : 'explore.html')) {
        return;
    }

    if (!currentDoubtId) {
        showToast('No doubt specified.', 'error');
        setTimeout(() => window.location.href = 'explore.html', 800);
        return;
    }

    renderDoubtDetails();
    initAnswerForm();
}

function renderDoubtDetails() {
    const container = document.getElementById('doubt-details-container');
    const answersContainer = document.getElementById('answers-feed');
    const answersCountHeader = document.getElementById('answers-count-header');
    if (!container) return;

    const doubt = Storage.getDoubtById(currentDoubtId);
    if (!doubt) {
        container.innerHTML = `
            <div class="empty-state-card">
                <h3>Doubt not found</h3>
                <p>This doubt may have been removed.</p>
                <a href="explore.html" class="btn btn-primary btn-sm">Back to Explore</a>
            </div>
        `;
        return;
    }

    const currentUser = Storage.getCurrentUser();
    const isUpvoted = currentUser && Array.isArray(doubt.upvotes) && doubt.upvotes.includes(currentUser.id);
    const isBookmarked = Storage.isBookmarked(doubt.id);
    const upvoteCount = doubt.upvotes ? doubt.upvotes.length : 0;
    const isQuestionAuthor = currentUser && currentUser.id === doubt.authorId;
    const langClass = getLangBadgeClass(doubt.language);

    // Render Question Details
    container.innerHTML = `
        <div class="details-breadcrumb">
            <a href="explore.html"><i class="fa-solid fa-arrow-left"></i> Explore Doubts</a>
            <span>/</span>
            <span class="lang-badge ${langClass}">${escapeHtml(doubt.language)}</span>
            <span>/</span>
            <span>${doubt.isSolved ? 'Solved' : 'Unsolved'}</span>
        </div>

        <h1 class="doubt-details-title">${escapeHtml(doubt.title)}</h1>

        <div class="doubt-details-meta">
            <div class="doubt-author-info">
                <img src="${doubt.authorAvatar}" alt="${escapeHtml(doubt.authorName)}" class="doubt-author-avatar" style="width: 36px; height: 36px;">
                <div>
                    <div class="doubt-author-name" style="font-size: 0.95rem;">${escapeHtml(doubt.authorName)}</div>
                    <div style="font-size: 0.78rem; color: var(--text-subtle);">Posted ${formatTimeAgo(doubt.createdAt)}</div>
                </div>
            </div>

            <div class="doubt-card-tags">
                <span class="lang-badge ${langClass}">${escapeHtml(doubt.language)}</span>
                ${doubt.isSolved ? '<span class="badge badge-solved"><i class="fa-solid fa-circle-check"></i> Solved</span>' : '<span class="badge badge-warning"><i class="fa-regular fa-clock"></i> Unsolved</span>'}
                ${doubt.isAnonymous ? '<span class="badge badge-anon"><i class="fa-solid fa-user-secret"></i> Anonymous Student</span>' : ''}
            </div>
        </div>

        <div class="doubt-full-desc">
            ${escapeHtml(doubt.description)}
        </div>

        ${doubt.codeSnippet ? `
            <div class="code-container">
                <div class="code-header">
                    <div class="code-dots">
                        <span class="code-dot dot-red"></span>
                        <span class="code-dot dot-yellow"></span>
                        <span class="code-dot dot-green"></span>
                    </div>
                    <span>${escapeHtml(doubt.language)}</span>
                    <button class="copy-code-btn" type="button">
                        <i class="fa-regular fa-copy"></i> Copy Code
                    </button>
                </div>
                <pre class="code-body"><code>${escapeHtml(doubt.codeSnippet)}</code></pre>
            </div>
        ` : ''}

        ${doubt.errorMessage ? `
            <div class="error-trace-container">
                <div class="error-trace-title">
                    <i class="fa-solid fa-triangle-exclamation"></i> Error Output / Terminal Trace:
                </div>
                <code>${escapeHtml(doubt.errorMessage)}</code>
            </div>
        ` : ''}

        ${doubt.screenshot ? `
            <div class="doubt-screenshot-container">
                <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem;">
                    <i class="fa-solid fa-image"></i> Attached Screenshot:
                </div>
                <img src="${doubt.screenshot}" alt="Attached error screenshot" class="doubt-screenshot-img" onclick="window.open(this.src, '_blank')">
            </div>
        ` : ''}

        <div class="details-action-bar">
            <button class="btn ${isUpvoted ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="handleDetailsQuestionUpvote()">
                <i class="${isUpvoted ? 'fa-solid' : 'fa-regular'} fa-thumbs-up"></i>
                <span>${upvoteCount} Upvotes</span>
            </button>

            <button class="btn btn-secondary btn-sm" onclick="handleDetailsQuestionBookmark()">
                <i class="${isBookmarked ? 'fa-solid' : 'fa-regular'} fa-bookmark" style="${isBookmarked ? 'color: var(--secondary);' : ''}"></i>
                <span>${isBookmarked ? 'Saved' : 'Bookmark'}</span>
            </button>

            <button class="btn btn-ghost btn-sm" onclick="handleShareDoubt()">
                <i class="fa-solid fa-share-nodes"></i> Share
            </button>

            ${isQuestionAuthor ? `
                <button class="btn btn-ghost btn-sm" style="color: var(--danger); margin-left: auto;" onclick="handleDeleteQuestion()">
                    <i class="fa-regular fa-trash-can"></i> Delete
                </button>
            ` : ''}
        </div>
    `;

    // Render Answers Feed
    const answers = Array.isArray(doubt.answers) ? doubt.answers : [];
    if (answersCountHeader) {
        answersCountHeader.textContent = `${answers.length} ${answers.length === 1 ? 'Answer' : 'Answers'}`;
    }

    if (answersContainer) {
        if (answers.length === 0) {
            answersContainer.innerHTML = `
                <div class="empty-state-card" style="padding: 2.5rem 1rem;">
                    <div class="empty-state-icon">
                        <i class="fa-regular fa-comments"></i>
                    </div>
                    <h4>No answers yet</h4>
                    <p class="empty-state-desc">Know how to fix this or have a hint? Share your answer below to help your peer!</p>
                </div>
            `;
        } else {
            // Sort: Best answer first, then by upvotes
            const sortedAnswers = [...answers].sort((a, b) => {
                if (a.isBestAnswer) return -1;
                if (b.isBestAnswer) return 1;
                return (b.upvotes ? b.upvotes.length : 0) - (a.upvotes ? a.upvotes.length : 0);
            });

            answersContainer.innerHTML = sortedAnswers.map(ans => {
                const ansUpvoted = currentUser && Array.isArray(ans.upvotes) && ans.upvotes.includes(currentUser.id);
                const ansUpvotes = ans.upvotes ? ans.upvotes.length : 0;

                return `
                    <div class="answer-card ${ans.isBestAnswer ? 'best-answer' : ''}" id="ans-${ans.id}">
                        ${ans.isBestAnswer ? `
                            <div class="best-answer-banner">
                                <i class="fa-solid fa-trophy"></i> Best Answer Verified by Author
                            </div>
                        ` : ''}

                        <div class="answer-header">
                            <div class="doubt-author-info">
                                <img src="${ans.authorAvatar}" alt="${escapeHtml(ans.authorName)}" class="doubt-author-avatar">
                                <div>
                                    <div class="doubt-author-name">${escapeHtml(ans.authorName)}</div>
                                    <div style="font-size: 0.75rem; color: var(--text-subtle);">${formatTimeAgo(ans.createdAt)}</div>
                                </div>
                            </div>

                            ${isQuestionAuthor ? `
                                <button class="btn ${ans.isBestAnswer ? 'btn-success' : 'btn-outline'} btn-sm best-answer-toggle-btn" 
                                    onclick="handleToggleBestAnswer('${ans.id}')"
                                    title="${ans.isBestAnswer ? 'Unmark as best answer' : 'Mark as best answer'}">
                                    <i class="fa-solid ${ans.isBestAnswer ? 'fa-check' : 'fa-award'}"></i>
                                    ${ans.isBestAnswer ? 'Marked as Best Answer' : 'Mark as Best Answer'}
                                </button>
                            ` : ''}
                        </div>

                        <div class="answer-body">
                            ${escapeHtml(ans.text)}
                        </div>

                        ${ans.codeSnippet ? `
                            <div class="code-container">
                                <div class="code-header">
                                    <div class="code-dots">
                                        <span class="code-dot dot-red"></span>
                                        <span class="code-dot dot-yellow"></span>
                                        <span class="code-dot dot-green"></span>
                                    </div>
                                    <span>Code Solution</span>
                                    <button class="copy-code-btn" type="button">
                                        <i class="fa-regular fa-copy"></i> Copy Code
                                    </button>
                                </div>
                                <pre class="code-body"><code>${escapeHtml(ans.codeSnippet)}</code></pre>
                            </div>
                        ` : ''}

                        <div class="answer-footer">
                            <button class="btn btn-sm ${ansUpvoted ? 'btn-primary' : 'btn-secondary'}" onclick="handleAnswerUpvote('${ans.id}')">
                                <i class="${ansUpvoted ? 'fa-solid' : 'fa-regular'} fa-thumbs-up"></i>
                                <span>${ansUpvotes} Helpful</span>
                            </button>
                            <span style="font-size: 0.8rem; color: var(--text-subtle);">Peer Verified</span>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
}

function handleDetailsQuestionUpvote() {
    const res = Storage.toggleUpvoteDoubt(currentDoubtId);
    if (!res.success) {
        showToast(res.message, 'warning');
        return;
    }
    renderDoubtDetails();
    showToast(res.upvoted ? 'Upvoted question! 🚀' : 'Upvote removed', 'info');
}

function handleDetailsQuestionBookmark() {
    const res = Storage.toggleBookmark(currentDoubtId);
    renderDoubtDetails();
    showToast(res.saved ? 'Saved to bookmarks' : 'Removed from bookmarks', 'info');
}

function handleShareDoubt() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Link copied to clipboard! Share with classmates.', 'success');
    }).catch(() => {
        showToast('Could not copy link.', 'error');
    });
}

function handleDeleteQuestion() {
    if (confirm('Are you sure you want to delete this doubt? This cannot be undone.')) {
        const success = Storage.deleteDoubt(currentDoubtId);
        if (success) {
            showToast('Doubt deleted successfully.', 'info');
            setTimeout(() => window.location.href = 'explore.html', 800);
        } else {
            showToast('Unable to delete doubt.', 'error');
        }
    }
}

function handleAnswerUpvote(answerId) {
    const res = Storage.toggleUpvoteAnswer(currentDoubtId, answerId);
    if (!res.success) {
        showToast(res.message, 'warning');
        return;
    }
    renderDoubtDetails();
    showToast(res.upvoted ? 'Marked answer as helpful! ⭐' : 'Upvote removed', 'info');
}

function handleToggleBestAnswer(answerId) {
    const res = Storage.toggleBestAnswer(currentDoubtId, answerId);
    if (!res.success) {
        showToast(res.message, 'error');
        return;
    }
    renderDoubtDetails();
    showToast(res.isBestAnswer ? 'Marked as Best Answer! 🏆' : 'Unmarked as best answer', 'success');
}

function initAnswerForm() {
    const form = document.getElementById('post-answer-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const textInput = document.getElementById('answer-text');
        const codeInput = document.getElementById('answer-code');

        const text = textInput.value.trim();
        const codeSnippet = codeInput ? codeInput.value.trim() : '';

        if (!text) {
            showToast('Please type your explanation or answer.', 'error');
            return;
        }

        const res = Storage.addAnswer(currentDoubtId, { text, codeSnippet });
        if (res.success) {
            textInput.value = '';
            if (codeInput) codeInput.value = '';
            renderDoubtDetails();
            showToast('Your answer has been posted! Thanks for helping your peer. 🎉', 'success');
        } else {
            showToast(res.message, 'error');
        }
    });
}

// ==========================================
// 4. Student Profile Page
// ==========================================
let currentProfileTab = 'questions';

function initProfilePage() {
    const profileWrap = document.getElementById('profile-view-wrap');
    if (!profileWrap) return;

    // Route Protection: must be logged in to view profile
    if (!Storage.requireAuth('profile.html')) {
        return;
    }

    const currentUser = Storage.getCurrentUser();

    renderProfileHeader(currentUser);
    renderProfileStats(currentUser.id);
    renderProfileTabContent(currentUser, currentProfileTab);
    initProfileTabs();
    initEditProfileModal(currentUser);
}

function renderProfileHeader(user) {
    const nameEl = document.getElementById('profile-name');
    const emailEl = document.getElementById('profile-email');
    const branchEl = document.getElementById('profile-branch');
    const bioEl = document.getElementById('profile-bio');
    const avatarEl = document.getElementById('profile-avatar');

    if (nameEl) nameEl.textContent = user.name;
    if (emailEl) emailEl.textContent = user.email;
    if (branchEl) branchEl.textContent = `${user.year} • ${user.branch} • Roll: ${user.rollNo}`;
    if (bioEl) bioEl.textContent = user.bio;
    if (avatarEl) avatarEl.src = user.avatar;
}

function renderProfileStats(userId) {
    const stats = Storage.getUserStats(userId);

    const askedEl = document.getElementById('pstat-asked');
    const answersEl = document.getElementById('pstat-answers');
    const upvotesEl = document.getElementById('pstat-upvotes');
    const solvedEl = document.getElementById('pstat-solved');

    if (askedEl) askedEl.textContent = stats.doubtsAsked;
    if (answersEl) answersEl.textContent = stats.answersGiven;
    if (upvotesEl) upvotesEl.textContent = stats.upvotesReceived;
    if (solvedEl) solvedEl.textContent = stats.solvedCount;
}

function initProfileTabs() {
    const tabs = document.querySelectorAll('.profile-tab-item');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const tabName = tab.getAttribute('data-tab');
            currentProfileTab = tabName;
            const currentUser = Storage.getCurrentUser();
            renderProfileTabContent(currentUser, tabName);
        });
    });
}

function renderProfileTabContent(user, tabName) {
    const container = document.getElementById('profile-tab-content');
    if (!container) return;

    const doubts = Storage.getDoubts();

    if (tabName === 'questions') {
        const myDoubts = doubts.filter(d => d.authorId === user.id);
        if (myDoubts.length === 0) {
            container.innerHTML = `
                <div class="empty-state-card">
                    <h4>You haven't asked any doubts yet</h4>
                    <p class="empty-state-desc">Got stuck on code or homework? Ask your peers freely!</p>
                    <a href="ask-doubt.html" class="btn btn-primary btn-sm">Ask a Doubt</a>
                </div>
            `;
            return;
        }

        container.innerHTML = `<div class="doubts-list">${myDoubts.map(d => renderProfileDoubtCard(d)).join('')}</div>`;
    } else if (tabName === 'answers') {
        const answeredDoubts = doubts.filter(d => Array.isArray(d.answers) && d.answers.some(a => a.authorId === user.id));
        if (answeredDoubts.length === 0) {
            container.innerHTML = `
                <div class="empty-state-card">
                    <h4>No answers given yet</h4>
                    <p class="empty-state-desc">Help classmates debug their code and earn peer upvotes!</p>
                    <a href="explore.html" class="btn btn-primary btn-sm">Browse Unsolved Doubts</a>
                </div>
            `;
            return;
        }

        container.innerHTML = `<div class="doubts-list">${answeredDoubts.map(d => renderProfileDoubtCard(d)).join('')}</div>`;
    } else if (tabName === 'bookmarks') {
        const bookmarks = Storage.getBookmarks();
        const savedDoubts = doubts.filter(d => bookmarks.includes(d.id));

        if (savedDoubts.length === 0) {
            container.innerHTML = `
                <div class="empty-state-card">
                    <h4>No saved doubts</h4>
                    <p class="empty-state-desc">Click the bookmark icon on any question to save it for revision before exams.</p>
                    <a href="explore.html" class="btn btn-primary btn-sm">Explore Doubts</a>
                </div>
            `;
            return;
        }

        container.innerHTML = `<div class="doubts-list">${savedDoubts.map(d => renderProfileDoubtCard(d)).join('')}</div>`;
    }
}

function renderProfileDoubtCard(doubt) {
    const langClass = getLangBadgeClass(doubt.language);
    const answerCount = doubt.answers ? doubt.answers.length : 0;
    const upvoteCount = doubt.upvotes ? doubt.upvotes.length : 0;

    return `
        <div class="doubt-card">
            <div class="doubt-card-top">
                <div class="doubt-card-tags">
                    <span class="lang-badge ${langClass}">${escapeHtml(doubt.language)}</span>
                    ${doubt.isSolved ? '<span class="badge badge-solved"><i class="fa-solid fa-circle-check"></i> Solved</span>' : '<span class="badge badge-warning"><i class="fa-regular fa-clock"></i> Unsolved</span>'}
                </div>
                <span style="font-size: 0.8rem; color: var(--text-subtle);">${formatTimeAgo(doubt.createdAt)}</span>
            </div>

            <h3 class="doubt-card-title" onclick="window.location.href='doubt-details.html?id=${doubt.id}'">
                ${escapeHtml(doubt.title)}
            </h3>

            <p class="doubt-card-desc">${escapeHtml(doubt.description)}</p>

            <div class="doubt-card-footer">
                <span class="doubt-stat-pill">
                    <i class="fa-regular fa-comment-dots"></i> ${answerCount} answers
                </span>
                <span class="doubt-stat-pill">
                    <i class="fa-regular fa-thumbs-up"></i> ${upvoteCount} upvotes
                </span>
                <a href="doubt-details.html?id=${doubt.id}" class="btn btn-ghost btn-sm" style="margin-left: auto;">
                    View Discussion <i class="fa-solid fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `;
}

function initEditProfileModal(user) {
    const editBtn = document.getElementById('btn-edit-profile');
    const modal = document.getElementById('edit-profile-modal');
    const form = document.getElementById('edit-profile-form');
    if (!editBtn || !modal || !form) return;

    editBtn.addEventListener('click', () => {
        document.getElementById('edit-name').value = user.name;
        document.getElementById('edit-branch').value = user.branch;
        document.getElementById('edit-year').value = user.year;
        document.getElementById('edit-bio').value = user.bio;
        modal.classList.add('active');
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('edit-name').value.trim();
        const branch = document.getElementById('edit-branch').value.trim();
        const year = document.getElementById('edit-year').value;
        const bio = document.getElementById('edit-bio').value.trim();

        if (!name) {
            showToast('Name cannot be empty.', 'error');
            return;
        }

        const success = Storage.updateUserProfile({ name, branch, year, bio });
        if (success) {
            modal.classList.remove('active');
            const updated = Storage.getCurrentUser();
            renderProfileHeader(updated);
            showToast('Profile updated successfully! ✨', 'success');
        }
    });
}

function closeEditModal() {
    const modal = document.getElementById('edit-profile-modal');
    if (modal) modal.classList.remove('active');
}

