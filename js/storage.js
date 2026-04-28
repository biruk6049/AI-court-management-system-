// Utility to handle LocalStorage and Mock Data initialization
const Storage = {
    init: async () => {
        // Versioning helps force a data refresh when we update the mock data structure
        const DATA_VERSION = '2.0'; 
        if (localStorage.getItem('court_data_version') !== DATA_VERSION) {
            localStorage.removeItem('court_data_initialized');
        }

        if (!localStorage.getItem('court_data_initialized')) {
            try {
                const response = await fetch('data/mockData.json');
                const data = await response.json();
                localStorage.setItem('court_cases', JSON.stringify(data.cases));
                localStorage.setItem('court_schedule', JSON.stringify(data.schedule));
                localStorage.setItem('court_users', JSON.stringify(data.users));
                localStorage.setItem('court_data_initialized', 'true');
                localStorage.setItem('court_data_version', DATA_VERSION);
            } catch (e) {
                console.error("Failed to load mock data, fallback to defaults.", e);
                // Fallback in case fetch fails
                const defaultCases = [
                    { id: "C-2026-001", title: "State vs. Doe", type: "Criminal", status: "Active", priority: "High", nextHearing: "2026-05-15", judge: "Hon. Smith", description: "Robbery charges in the 1st degree.", timeline: [], lawyers: [], documents: [] },
                    { id: "C-2026-002", title: "TechCorp vs. InnovateLLC", type: "Civil", status: "Pending", priority: "Medium", nextHearing: "2026-06-02", judge: "Hon. Davis", description: "Patent infringement dispute over AI algorithms.", timeline: [], lawyers: [], documents: [] }
                ];
                const defaultUsers = [
                    { id: "U-1", username: "admin", password: "password", role: "Admin", name: "Admin User" },
                    { id: "U-2", username: "judge_smith", password: "password", role: "Judge", name: "Hon. Smith" },
                    { id: "U-3", username: "lawyer_wick", password: "password", role: "Lawyer", name: "John Wick" },
                    { id: "U-4", username: "clerk_lee", password: "password", role: "Clerk", name: "Lee Clerk" }
                ];
                localStorage.setItem('court_cases', JSON.stringify(defaultCases));
                localStorage.setItem('court_schedule', JSON.stringify([]));
                localStorage.setItem('court_users', JSON.stringify(defaultUsers));
                localStorage.setItem('court_data_initialized', 'true');
                localStorage.setItem('court_data_version', DATA_VERSION);
            }
        }
    },
    get: (key) => JSON.parse(localStorage.getItem(key) || '[]'),
    set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
};

// Initialize immediately so data is ready for other scripts
Storage.init();
