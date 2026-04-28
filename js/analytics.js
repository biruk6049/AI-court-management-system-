document.addEventListener('DOMContentLoaded', () => {
    const cases = Storage.get('court_cases');
    
    // 1. Case Type Distribution Chart
    const types = {};
    cases.forEach(c => types[c.type] = (types[c.type] || 0) + 1);
    
    const typeChart = document.getElementById('case-type-chart');
    if (typeChart) {
        const max = Math.max(...Object.values(types), 1);
        Object.entries(types).forEach(([label, value]) => {
            const height = (value / max) * 150;
            const bar = document.createElement('div');
            bar.className = 'bar-item';
            bar.style.height = `${height}px`;
            bar.innerHTML = `
                <span class="bar-value">${value}</span>
                <span class="bar-label">${label}</span>
            `;
            typeChart.appendChild(bar);
        });
    }

    // 2. Status Percentages
    const statuses = {};
    cases.forEach(c => statuses[c.status] = (statuses[c.status] || 0) + 1);
    const statusContainer = document.getElementById('status-stats');
    if (statusContainer) {
        const total = cases.length;
        Object.entries(statuses).forEach(([label, value]) => {
            const pct = Math.round((value / total) * 100);
            const row = document.createElement('div');
            row.className = 'd-flex justify-between align-center';
            row.innerHTML = `
                <span style="font-size: 0.85rem; color: var(--text-muted);">${label} Cases</span>
                <span style="font-weight: 700; color: var(--primary);">${pct}% (${value})</span>
            `;
            statusContainer.appendChild(row);
        });
    }

    // 3. Judge Performance Table
    const judges = {};
    cases.forEach(c => {
        if (!judges[c.judge]) judges[c.judge] = { total: 0, pending: 0 };
        judges[c.judge].total++;
        if (c.status === 'Pending') judges[c.judge].pending++;
    });
    
    const judgeTbody = document.getElementById('judge-stats-tbody');
    if (judgeTbody) {
        Object.entries(judges).forEach(([name, stats]) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${name}</td>
                <td>${stats.total}</td>
                <td>${stats.pending}</td>
            `;
            judgeTbody.appendChild(tr);
        });
    }

    // 4. Priority Distribution Chart
    const priorities = { 'High': 0, 'Medium': 0, 'Low': 0 };
    cases.forEach(c => {
        if (priorities[c.priority] !== undefined) priorities[c.priority]++;
    });
    
    const priorityChart = document.getElementById('priority-chart');
    if (priorityChart) {
        const max = Math.max(...Object.values(priorities), 1);
        Object.entries(priorities).forEach(([label, value]) => {
            const height = (value / max) * 150;
            const bar = document.createElement('div');
            bar.className = 'bar-item';
            bar.style.height = `${height}px`;
            // Color mapping
            if (label === 'High') bar.style.background = 'linear-gradient(to top, var(--accent), #fb7185)';
            if (label === 'Medium') bar.style.background = 'linear-gradient(to top, var(--warning), #fbbf24)';
            
            bar.innerHTML = `
                <span class="bar-value">${value}</span>
                <span class="bar-label">${label}</span>
            `;
            priorityChart.appendChild(bar);
        });
    }
});
