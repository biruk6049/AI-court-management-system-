document.addEventListener('DOMContentLoaded', () => {
    const calendarEl = document.getElementById('calendar');
    const hearingForm = document.getElementById('new-hearing-form');
    const caseSelect = document.getElementById('hearing-case-id');
    
    let schedule = Storage.get('court_schedule');
    let cases = Storage.get('court_cases');

    // Populate Case Dropdown
    if (caseSelect) {
        cases.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = `${c.id} - ${c.title}`;
            caseSelect.appendChild(opt);
        });
    }

    // Initialize FullCalendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: schedule.map(s => ({
            id: s.id,
            title: `${s.caseId}: ${s.type}`,
            start: `${s.date}T${s.time}`,
            extendedProps: {
                room: s.room,
                caseId: s.caseId
            },
            backgroundColor: s.type === 'Trial' ? '#f43f5e' : '#6366f1',
            borderColor: 'transparent'
        })),
        eventClick: (info) => {
            alert(`Event: ${info.event.title}\nCourtroom: ${info.event.extendedProps.room}\nCase ID: ${info.event.extendedProps.caseId}`);
        },
        dateClick: (info) => {
            const dateInput = document.getElementById('hearing-date');
            if (dateInput) {
                dateInput.value = info.dateStr;
                App.showModal('new-hearing-modal');
            }
        }
    });

    calendar.render();

    // Handle New Hearing Submission
    if (hearingForm) {
        hearingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const caseId = document.getElementById('hearing-case-id').value;
            const type = document.getElementById('hearing-type').value;
            const date = document.getElementById('hearing-date').value;
            const time = document.getElementById('hearing-time').value;
            const room = document.getElementById('hearing-room').value;

            const newEvent = {
                id: `H-${Date.now()}`,
                caseId,
                type,
                date,
                time,
                start: `${date}T${time}`, // Standardized ISO format for notifications
                room,
                title: `${caseId}: ${type}`
            };

            // Save to Storage
            schedule.push(newEvent);
            Storage.set('court_schedule', schedule);
            App.addNotification("Hearing Scheduled", `A new ${type} has been scheduled for case ${caseId} in ${room} on ${date} at ${time}.`);

            // Update associated case's next hearing date
            const caseIdx = cases.findIndex(c => c.id === caseId);
            if (caseIdx !== -1) {
                cases[caseIdx].nextHearing = date;
                cases[caseIdx].timeline.push({
                    event: `Scheduled ${type} in ${room}`,
                    date: date
                });
                Storage.set('court_cases', cases);
            }

            // Update Calendar UI
            calendar.addEvent({
                id: newEvent.id,
                title: `${caseId}: ${type}`,
                start: newEvent.start,
                backgroundColor: type === 'Trial' ? '#f43f5e' : '#6366f1',
                borderColor: 'transparent'
            });

            App.closeModal('new-hearing-modal');
            hearingForm.reset();
        });
    }
});
