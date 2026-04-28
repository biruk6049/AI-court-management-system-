document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Trim and convert to lowercase for case-insensitive matching
            const usernameInput = document.getElementById('username').value.trim().toLowerCase();
            const passwordInput = document.getElementById('password').value;
            const roleInput = document.getElementById('role').value;
            const errorMsg = document.getElementById('login-error');

            const users = Storage.get('court_users');
            const user = users.find(u => 
                u.username.toLowerCase() === usernameInput && 
                u.password === passwordInput && 
                u.role === roleInput
            );

            if (user) {
                // Securely store (mock) session with role
                localStorage.setItem('court_currentUser', JSON.stringify({
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    role: user.role
                }));
                window.location.href = 'dashboard.html';
            } else {
                errorMsg.style.display = 'block';
                errorMsg.textContent = 'Invalid credentials for the selected role. Make sure username and role match.';
            }
        });
    }
});
