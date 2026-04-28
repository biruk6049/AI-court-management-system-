// Common application logic
const App = {
    // API Configuration
    apiConfig: {
        key: "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",
        model: "llama-3.1-8b-instant", // Latest instant model on Groq
        baseUrl: "https://api.groq.com/openai/v1/chat/completions",
        referer: "http://localhost:5173",
        title: "Astraea AI Court System"
    },
    checkAuth: () => {
        const currentUser = localStorage.getItem('court_currentUser');
        const path = window.location.pathname;
        const isAuthPage = path.includes('login.html') || path.includes('index.html') || path.endsWith('/');
        
        if (!currentUser && !isAuthPage) {
            window.location.href = 'login.html';
        } else if (currentUser) {
            const user = JSON.parse(currentUser);
            App.updateUserInfo(user);
            App.applyRoleRestrictions(user.role);
        }
    },
    logout: () => {
        localStorage.removeItem('court_currentUser');
        window.location.href = 'login.html';
    },
    updateUserInfo: (user) => {
        const userNameEls = document.querySelectorAll('.user-name');
        userNameEls.forEach(el => el.textContent = user.name);
        
        const userAvatarEls = document.querySelectorAll('.user-avatar');
        userAvatarEls.forEach(el => {
            el.textContent = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        });
        
        const roleEls = document.querySelectorAll('.user-role');
        roleEls.forEach(el => el.textContent = user.role);
    },
    applyRoleRestrictions: (role) => {
        // Simple UI restriction logic based on requirements
        // Judge can: View cases, Add decision
        // Clerk can: Create case, Schedule hearing
        // Lawyer can: View assigned cases
        
        if (role === 'Lawyer') {
            document.querySelectorAll('.clerk-only').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.judge-only').forEach(el => el.style.display = 'none');
        } else if (role === 'Judge') {
            document.querySelectorAll('.clerk-only').forEach(el => el.style.display = 'none');
        } else if (role === 'Clerk') {
            document.querySelectorAll('.judge-only').forEach(el => el.style.display = 'none');
        }
    },
    setupNavigation: () => {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                App.logout();
            });
        }
        
        // Theme Toggle Logic
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', App.toggleTheme);
            App.initTheme();
        }

        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && window.location.href.includes(href) && href !== '#') {
                link.classList.add('active');
            }
        });
    },
    initTheme: () => {
        const theme = localStorage.getItem('astraea_theme') || 'dark';
        if (theme === 'light') {
            document.body.classList.add('light-mode');
            const icon = document.querySelector('#theme-toggle i');
            if (icon) icon.className = 'fa-solid fa-moon';
        }
    },
    toggleTheme: () => {
        const isLight = document.body.classList.toggle('light-mode');
        localStorage.setItem('astraea_theme', isLight ? 'light' : 'dark');
        const icon = document.querySelector('#theme-toggle i');
        if (icon) icon.className = isLight ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    },
    // UI Utility: Modal control
    openModal: (modalId) => {
        document.getElementById(modalId)?.classList.add('active');
    },
    showModal: (modalId) => { // Adding alias for consistency
        App.openModal(modalId);
    },
    closeModal: (modalId) => {
        document.getElementById(modalId)?.classList.remove('active');
    },
    // Notification System
    addNotification: (title, message) => {
        const notifications = JSON.parse(localStorage.getItem('court_notifications') || '[]');
        notifications.unshift({
            id: Date.now(),
            title,
            message,
            time: new Date().toISOString(),
            read: false
        });
        localStorage.setItem('court_notifications', JSON.stringify(notifications.slice(0, 20))); // Keep last 20
        App.updateNotificationBadge();
        
        // Visual Feedback (Simple alert as fallback for browser notification)
        console.log(`Notification: ${title} - ${message}`);
        
        // Browser toast notification
        if ("Notification" in window) {
            if (Notification.permission === "granted") {
                new Notification(title, { body: message, icon: 'favicon.ico' });
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission();
            }
        }
    },
    updateNotificationBadge: () => {
        const notifications = JSON.parse(localStorage.getItem('court_notifications') || '[]');
        const unreadCount = notifications.filter(n => !n.read).length;
        const badges = document.querySelectorAll('.notification-badge');
        badges.forEach(badge => {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        });
    },
    initNotifications: () => {
        App.updateNotificationBadge();
        // Check schedules every minute
        setInterval(App.checkSchedules, 60000);
        App.checkSchedules(); // Run once at start
    },
    checkSchedules: () => {
        const schedules = JSON.parse(localStorage.getItem('court_schedule') || '[]');
        const now = new Date();
        let updated = false;
        
        schedules.forEach(s => {
            if (!s.start) return;
            const schedDate = new Date(s.start);
            const diff = schedDate - now;
            
            // If scheduled time is within the next 5 minutes and we haven't notified yet
            if (diff > 0 && diff < 300000 && !s.notified) {
                App.addNotification("Upcoming Hearing", `Hearing for ${s.title} is starting soon at ${new Date(s.start).toLocaleTimeString()}.`);
                s.notified = true;
                updated = true;
            }
        });
        
        if (updated) {
            localStorage.setItem('court_schedule', JSON.stringify(schedules));
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.checkAuth();
    App.setupNavigation();
    App.initNotifications();
});
