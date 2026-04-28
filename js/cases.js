document.addEventListener('DOMContentLoaded', () => {
    const casesList = document.getElementById('cases-list');
    const searchInput = document.getElementById('smart-search');
    const statusFilter = document.getElementById('filter-status');
    const priorityFilter = document.getElementById('filter-priority');
    const newCaseForm = document.getElementById('new-case-form');
    
    let cases = Storage.get('court_cases');

    const renderCases = (filteredCases) => {
        if (!casesList) return;
        casesList.innerHTML = '';
        
        if (filteredCases.length === 0) {
            casesList.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No cases match your search criteria.</td></tr>';
            return;
        }

        filteredCases.forEach(c => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${c.id}</td>
                <td><strong>${c.title}</strong></td>
                <td><span class="status ${c.type.toLowerCase()}">${c.type}</span></td>
                <td><span class="priority ${c.priority.toLowerCase()}">${c.priority}</span></td>
                <td>${c.judge}</td>
                <td><span class="status ${c.status.toLowerCase()}">${c.status}</span></td>
                <td>
                    <div class="d-flex gap-1">
                        <a href="case-details.html?id=${c.id}" class="btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">
                            View
                        </a>
                        <button class="btn-secondary clerk-only" onclick="deleteCase('${c.id}')" style="padding: 0.4rem 0.8rem; font-size: 0.75rem; border-color: rgba(244,63,94,0.3); color: var(--accent);">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            casesList.appendChild(tr);
        });
        
        const user = JSON.parse(localStorage.getItem('court_currentUser'));
        if (user) App.applyRoleRestrictions(user.role);
    };

    const handleFilter = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const statusVal = statusFilter.value;
        const priorityVal = priorityFilter.value;

        const filtered = cases.filter(c => {
            const matchesSearch = 
                c.id.toLowerCase().includes(searchTerm) ||
                c.title.toLowerCase().includes(searchTerm) ||
                c.judge.toLowerCase().includes(searchTerm) ||
                c.type.toLowerCase().includes(searchTerm);
            
            const matchesStatus = !statusVal || c.status === statusVal;
            const matchesPriority = !priorityVal || c.priority === priorityVal;

            return matchesSearch && matchesStatus && matchesPriority;
        });

        renderCases(filtered);
    };

    if (searchInput) searchInput.addEventListener('input', handleFilter);
    if (statusFilter) statusFilter.addEventListener('change', handleFilter);
    if (priorityFilter) priorityFilter.addEventListener('change', handleFilter);

    renderCases(cases);

    // New Case Logic with AI Priority Detection
    if (newCaseForm) {
        newCaseForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = newCaseForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            const title = document.getElementById('new-title').value;
            const type = document.getElementById('new-type').value;
            const judge = document.getElementById('new-judge').value;
            const desc = document.getElementById('new-desc').value;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Astraea AI Analyzing...';

            // Auto-generate ID
            const newId = `C-2026-${String(cases.length + 1).padStart(3, '0')}`;
            
            // Smart AI Priority Detection using OpenRouter
            let priority = "Low";
            try {
                const { key, model, baseUrl } = App.apiConfig;
                const response = await fetch(baseUrl, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${key}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [
                            { role: "system", content: "You are a legal triage assistant. Given a case title and description, respond with ONLY one word: High, Medium, or Low to indicate its priority level based on severity (criminal/urgent = High, civil/dispute = Medium, administrative = Low)." },
                            { role: "user", content: `Title: ${title}\nDescription: ${desc}` }
                        ]
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const aiResponse = data.choices[0].message.content.trim();
                    if (["High", "Medium", "Low"].includes(aiResponse)) {
                        priority = aiResponse;
                    }
                }
            } catch (error) {
                console.warn("AI Priority Detection failed, falling back to simple logic.", error);
                // Fallback
                if (desc.toLowerCase().includes('criminal') || desc.toLowerCase().includes('urgent')) priority = "High";
            }

            const newCase = {
                id: newId,
                title: title,
                type: type,
                status: "Pending",
                priority: priority,
                nextHearing: null,
                judge: judge,
                lawyers: [],
                description: desc,
                timeline: [{event: "Case Created", date: new Date().toISOString().split('T')[0]}],
                documents: []
            };

            cases.push(newCase);
            Storage.set('court_cases', cases);
            App.addNotification("Case Created", `New case ${newId}: ${title} has been successfully registered.`);
            
            App.closeModal('new-case-modal');
            newCaseForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            renderCases(cases);
            
            alert(`Case ${newId} created successfully. Astraea AI has categorized this as ${priority} priority.`);
        });
    }

    window.deleteCase = (id) => {
        if (confirm(`Are you sure you want to delete case ${id}?`)) {
            cases = cases.filter(c => c.id !== id);
            Storage.set('court_cases', cases);
            renderCases(cases);
        }
    };
});
