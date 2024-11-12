$(document).ready(function () {


    // State management
    const state = {
        isLoggedIn: false,
        currentUser: null,
        currentView: 'login',
        quotes: JSON.parse(localStorage.getItem('quotes') || '[]'),
        users: JSON.parse(localStorage.getItem('users') || JSON.stringify({
            demo: {
                username: 'demo',
                password: 'demo123',
                joinDate: new Date().toISOString()
            }
        }))
    };

    // Initialize app
    renderLoginForm();
    setupEventListeners();

    // Event Listeners Setup
    function setupEventListeners() {
        // Navigation
        $('.nav-item, .mobile-nav-item').click(function () {
            if (!state.isLoggedIn) return;
            const tab = $(this).data('tab');
            $('html, body').animate({ scrollTop: 0 }, 300);
            updateNavigation(tab);
            updateUI(tab);
        });

        // Mobile menu
        $('#hamburger-btn').click(function () {
            $('.mobile-menu').addClass('active');
            $('body').addClass('menu-open');
        });

        $('#close-menu').click(function () {
            $('.mobile-menu').removeClass('active');
            $('body').removeClass('menu-open');
        });

        // Close mobile menu when clicking outside
        $(document).on('click', function (e) {
            if (
                $('.mobile-menu').hasClass('active') &&
                !$(e.target).closest('.mobile-menu').length &&
                !$(e.target).closest('#hamburger-btn').length
            ) {
                $('.mobile-menu').removeClass('active');
                $('body').removeClass('menu-open');
            }
        });

        // Auth tabs
        $(document).on('click', '#login-tab', function (e) {
            e.preventDefault();
            $(this).addClass('active').siblings().removeClass('active');
            renderLoginForm();
        });

        $(document).on('click', '#register-tab', function (e) {
            e.preventDefault();
            $(this).addClass('active').siblings().removeClass('active');
            renderRegisterForm();
        });

        // Form submissions
        $(document).on('submit', '#login-form', handleLogin);
        $(document).on('submit', '#register-form', handleRegister);
        $(document).on('submit', '#quote-form', handleAddQuote);

        // Logout handlers
        $('#logout-btn, #mobile-logout-btn').click(handleLogout);
    }

    // Render Functions
    function renderLoginForm() {
        const html = `
            <div class="auth-container">
                <div class="text-center mb-8">
                    <h1 class="text-4xl font-serif font-bold text-gray-800 mb-2">The Quotebook</h1>
                    <p class="text-gray-600 font-serif">Share your favorite quotes</p>
                </div>
                <div class="auth-card">
                    <div class="auth-tabs">
                        <button id="login-tab" class="auth-tab active">Login</button>
                        <button id="register-tab" class="auth-tab">Register</button>
                    </div>
                    <form id="login-form" class="form-stack">
                        <div class="form-group">
                            <input type="text" id="username" placeholder="Username (try: demo)" class="input-field" required>
                        </div>
                        <div class="form-group">
                            <input type="password" id="password" placeholder="Password (try: demo123)" class="input-field" required>
                        </div>
                        <button type="submit" class="btn">Login</button>
                    </form>
                </div>
            </div>
        `;
        $('#auth-content').html(html);
    }

    function renderRegisterForm() {
        const html = `
            <div class="auth-container">
                <div class="text-center mb-8">
                    <h1 class="text-4xl font-serif font-bold text-gray-800 mb-2">The Quotebook</h1>
                    <p class="text-gray-600 font-serif">Share your favorite quotes</p>
                </div>
                <div class="auth-card">
                    <div class="auth-tabs">
                        <button id="login-tab" class="auth-tab">Login</button>
                        <button id="register-tab" class="auth-tab active">Register</button>
                    </div>
                    <form id="register-form" class="form-stack">
                        <div class="form-group">
                            <input type="text" id="reg-username" placeholder="Choose Username" class="input-field" required>
                        </div>
                        <div class="form-group">
                            <input type="password" id="reg-password" placeholder="Choose Password" class="input-field" required>
                        </div>
                        <div class="form-group">
                            <input type="password" id="reg-confirm-password" placeholder="Confirm Password" class="input-field" required>
                        </div>
                        <button type="submit" class="btn">Create Account</button>
                    </form>
                </div>
            </div>
        `;
        $('#auth-content').html(html);
    }

    function renderHomePage() {
        const html = `
            <div class="content-card">
                <div class="space-y-8">
                    <div class="space-y-4">
                        <h2 class="text-2xl font-serif font-semibold text-gray-800">Add New Quote</h2>
                        <form id="quote-form" class="space-y-4">
                            <textarea id="quote-text" placeholder="Enter your quote" class="input-field input-textarea" required></textarea>
                            <div class="space-y-3">
                                <input type="text" id="quote-author" placeholder="Who said it?" class="input-field" required>
                                <div class="flex items-center space-x-2">
                                    <input type="checkbox" id="anonymous" class="w-4 h-4">
                                    <label for="anonymous" class="font-serif text-gray-700">Post anonymously</label>
                                </div>
                            </div>
                            <button type="submit" class="btn">Post Quote</button>
                        </form>
                    </div>

                    <div class="space-y-4">
                        <h2 class="text-2xl font-serif font-semibold text-gray-800">Quote Feed</h2>
                        <div id="quote-feed">
                            ${renderQuotes()}
                        </div>
                    </div>
                </div>
            </div>
        `;
        $('#home-section').html(html).removeClass('hidden');
        $('#auth-section, #profile-section, #about-section').addClass('hidden');
    }

    function renderQuotes() {
        return state.quotes.length ? state.quotes.map(quote => `
            <div class="quote-card">
                <p class="quote-text">"${quote.text}"</p>
                <div class="quote-meta">
                    <p class="quote-author">— ${quote.author}</p>
                    <p class="quote-username">Posted by: ${quote.username}</p>
                </div>
            </div>
        `).join('') : '<p class="text-center text-gray-500">No quotes yet. Be the first to share!</p>';
    }

    function renderProfilePage() {
        const userQuotes = state.quotes.filter(q => q.username === state.currentUser.username);
        const html = `
            <div class="content-card">
                <div class="space-y-6">
                    <div class="flex items-center space-x-4">
                        <div class="bg-gray-800 text-white p-4 rounded-full">
                            <span class="text-2xl font-serif">
                                ${state.currentUser.username.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h2 class="text-2xl font-serif font-bold text-gray-800">${state.currentUser.username}</h2>
                            <p class="text-gray-600 font-serif">
                                Member since ${new Date(state.currentUser.joinDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div class="border-t pt-6">
                        <h3 class="text-xl font-serif font-semibold text-gray-800 mb-4">Your Quotes</h3>
                        ${userQuotes.length ? userQuotes.map(quote => `
                            <div class="quote-card">
                                <p class="quote-text">"${quote.text}"</p>
                                <div class="quote-meta">
                                    <p class="quote-author">— ${quote.author}</p>
                                    <p class="quote-username">
                                        Posted on ${new Date(quote.timestamp).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        `).join('') : '<p class="text-center text-gray-500">No quotes yet. Start sharing!</p>'}
                    </div>
                </div>
            </div>
        `;
        $('#profile-section').html(html).removeClass('hidden');
        $('#auth-section, #home-section, #about-section').addClass('hidden');
    }

    // Event Handlers
    function handleLogin(e) {
        e.preventDefault();
        const username = $('#username').val().trim();
        const password = $('#password').val().trim();

        if (state.users[username]?.password === password) {
            state.isLoggedIn = true;
            state.currentUser = state.users[username];
            $('#main-nav').removeClass('hidden');
            updateUI('home');
        } else {
            alert('Invalid credentials. Try demo/demo123');
        }
    }

    function handleRegister(e) {
        e.preventDefault();
        const username = $('#reg-username').val().trim();
        const password = $('#reg-password').val().trim();
        const confirmPassword = $('#reg-confirm-password').val().trim();

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (state.users[username]) {
            alert('Username already exists!');
            return;
        }

        const newUser = {
            username: username,
            password: password,
            joinDate: new Date().toISOString()
        };

        state.users[username] = newUser;
        localStorage.setItem('users', JSON.stringify(state.users));

        state.isLoggedIn = true;
        state.currentUser = newUser;

        $('#main-nav').removeClass('hidden');
        updateUI('home');
    }

    function handleLogout() {
        state.isLoggedIn = false;
        state.currentUser = null;
        $('#main-nav').addClass('hidden');
        $('.mobile-menu').removeClass('active');
        $('body').removeClass('menu-open');
        updateUI('login');
    }

    function handleAddQuote(e) {
        e.preventDefault();
        const newQuote = {
            text: $('#quote-text').val(),
            author: $('#anonymous').prop('checked') ? 'Anonymous' : $('#quote-author').val(),
            username: state.currentUser.username,
            timestamp: new Date().toISOString(),
            isAnonymous: $('#anonymous').prop('checked')
        };

        state.quotes.unshift(newQuote);
        localStorage.setItem('quotes', JSON.stringify(state.quotes));

        $('#quote-form')[0].reset();
        $('#quote-feed').html(renderQuotes());
    }

    function updateNavigation(tab) {
        $('.nav-item, .mobile-nav-item').removeClass('active');
        $(`.nav-item[data-tab="${tab}"], .mobile-nav-item[data-tab="${tab}"]`).addClass('active');
        $('.mobile-menu').removeClass('active');
        $('body').removeClass('menu-open');
    }

    function updateUI(view) {
        state.currentView = view;
        $('.content-section').addClass('hidden');

        switch (view) {
            case 'home':
                renderHomePage();
                break;
            case 'profile':
                renderProfilePage();
                break;
            case 'about':
                $('#about-section').removeClass('hidden');
                break;
            default:
                $('#auth-section').removeClass('hidden');
        }
    }
});