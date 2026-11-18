/**
 * CampusConnect – Doubt Exchange
 * auth.js - Student Authentication, Registration, & Simulated College Email Verification
 */

document.addEventListener('DOMContentLoaded', () => {
    initLoginForm();
    initSignupForm();
    initQuickDemoFill();
    initPasswordVisibilityToggles();
});

// ------------------------------------------
// 1. Password Visibility Toggle
// ------------------------------------------
function initPasswordVisibilityToggles() {
    document.querySelectorAll('.password-toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const input = btn.previousElementSibling;
            if (!input) return;

            if (input.type === 'password') {
                input.type = 'text';
                btn.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
            } else {
                input.type = 'password';
                btn.innerHTML = '<i class="fa-regular fa-eye"></i>';
            }
        });
    });
}

// ------------------------------------------
// 2. Login Form Handling
// ------------------------------------------
function initLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailInput = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password');
        const errorFeedback = document.getElementById('login-error');

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Reset errors
        if (errorFeedback) {
            errorFeedback.classList.remove('visible');
            errorFeedback.textContent = '';
        }

        if (!email || !password) {
            if (errorFeedback) {
                errorFeedback.textContent = 'Please fill in both your college email and password.';
                errorFeedback.classList.add('visible');
            }
            return;
        }

        const result = Storage.login(email, password);
        if (result.success) {
            showToast(`Welcome back, ${result.user.name}! 👋`, 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 800);
        } else {
            if (errorFeedback) {
                errorFeedback.textContent = result.message;
                errorFeedback.classList.add('visible');
            }
            showToast(result.message, 'error');
        }
    });
}

// ------------------------------------------
// 3. Quick Demo Fill (Helper for Evaluators)
// ------------------------------------------
function initQuickDemoFill() {
    const quickFillBtn = document.getElementById('btn-quick-demo');
    if (!quickFillBtn) return;

    quickFillBtn.addEventListener('click', () => {
        const emailInput = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password');

        if (emailInput && passwordInput) {
            emailInput.value = 'arjun.btech24@college.edu';
            passwordInput.value = 'password123';
            showToast('Demo credentials filled for Arjun Sharma (1st Year CSE)', 'info');
        }
    });
}

// ------------------------------------------
// 4. Registration & Simulated OTP Verification
// ------------------------------------------
let pendingSignupData = null;

function initSignupForm() {
    const signupForm = document.getElementById('signup-form');
    if (!signupForm) return;

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('signup-name');
        const emailInput = document.getElementById('signup-email');
        const branchInput = document.getElementById('signup-branch');
        const yearInput = document.getElementById('signup-year');
        const passInput = document.getElementById('signup-password');
        const confirmPassInput = document.getElementById('signup-confirm-password');
        const errorFeedback = document.getElementById('signup-error');

        // Reset errors
        if (errorFeedback) {
            errorFeedback.classList.remove('visible');
            errorFeedback.textContent = '';
        }

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const branch = branchInput.value;
        const year = yearInput.value;
        const password = passInput.value;
        const confirmPassword = confirmPassInput.value;

        // Validation rules
        if (!name || !email || !password || !confirmPassword) {
            showError('Please fill in all required fields.');
            return;
        }

        if (name.length < 2) {
            showError('Please enter your full student name.');
            return;
        }

        if (!email.includes('@') || !email.includes('.')) {
            showError('Please enter a valid email address.');
            return;
        }

        if (password.length < 6) {
            showError('Password must be at least 6 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            showError('Passwords do not match. Please verify.');
            return;
        }

        // Store pending registration data & trigger simulated college verification
        pendingSignupData = {
            name,
            email,
            branch,
            year,
            password
        };

        openVerificationModal(email);
    });

    function showError(msg) {
        const errorFeedback = document.getElementById('signup-error');
        if (errorFeedback) {
            errorFeedback.textContent = msg;
            errorFeedback.classList.add('visible');
        }
        showToast(msg, 'error');
    }
}

// Modal handling for simulated OTP verification
function openVerificationModal(email) {
    const modal = document.getElementById('verification-modal');
    const targetEmailEl = document.getElementById('modal-target-email');
    if (!modal) return;

    if (targetEmailEl) targetEmailEl.textContent = email;
    modal.classList.add('active');

    // Auto-focus first digit
    const firstDigit = document.querySelector('.otp-digit');
    if (firstDigit) {
        firstDigit.focus();
        firstDigit.value = '2';
        const d2 = document.getElementById('otp-2');
        const d3 = document.getElementById('otp-3');
        const d4 = document.getElementById('otp-4');
        if (d2) d2.value = '0';
        if (d3) d3.value = '2';
        if (d4) d4.value = '6';
    }
}

function closeVerificationModal() {
    const modal = document.getElementById('verification-modal');
    if (modal) modal.classList.remove('active');
}

function confirmVerification() {
    if (!pendingSignupData) {
        showToast('Registration session expired. Please submit again.', 'error');
        closeVerificationModal();
        return;
    }

    const result = Storage.register(pendingSignupData);
    if (result.success) {
        closeVerificationModal();
        showToast('College verification successful! Welcome aboard 🎉', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 900);
    } else {
        showToast(result.message, 'error');
    }
}

