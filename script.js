let sessions = [];
let studyGoal = null;

const form = document.getElementById('study-form');
const sessionsDiv = document.getElementById('sessions');
const totalTimeDiv = document.getElementById('total-time');
const goalStatusDiv = document.getElementById('goal-status');
const goalBtns = document.querySelectorAll('.goal-btn');
const clearBtn = document.getElementById('clear-sessions');

// New: Show session count and average
const statsDiv = document.createElement('div');
statsDiv.id = 'stats';
sessionsDiv.parentNode.insertBefore(statsDiv, sessionsDiv.nextSibling);

function renderSessions() {
    sessionsDiv.innerHTML = '';
    sessions.forEach((s, i) => {
        const div = document.createElement('div');
        div.textContent = `${s.subject}: ${s.hours}h`;
        // Add delete button for each session
        const delBtn = document.createElement('button');
        delBtn.textContent = '🗑️';
        delBtn.style.marginLeft = '10px';
        delBtn.style.background = 'transparent';
        delBtn.style.border = 'none';
        delBtn.style.cursor = 'pointer';
        delBtn.onclick = () => {
            sessions.splice(i, 1);
            renderSessions();
            renderTotal();
            renderStats();
        };
        div.appendChild(delBtn);
        sessionsDiv.appendChild(div);
    });
}

function renderTotal() {
    const total = sessions.reduce((sum, s) => sum + s.hours, 0);
    totalTimeDiv.textContent = `Total Time: ${total} hours`;
    if (studyGoal) {
        if (total >= studyGoal) {
            goalStatusDiv.textContent = `🎉 Goal reached! (${studyGoal}h)`;
            goalStatusDiv.style.color = 'green';
        } else {
            goalStatusDiv.textContent = `Goal: ${studyGoal}h (${(studyGoal-total).toFixed(1)}h left)`;
            goalStatusDiv.style.color = 'orange';
        }
    } else {
        goalStatusDiv.textContent = '';
    }
}

function renderStats() {
    const count = sessions.length;
    const total = sessions.reduce((sum, s) => sum + s.hours, 0);
    const avg = count ? (total / count).toFixed(2) : 0;
    statsDiv.innerHTML = `Sessions: ${count} | Average per session: ${avg}h`;
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const subject = form.subject.value.trim();
    const hours = parseFloat(form.hours.value);
    if (!subject || isNaN(hours) || hours <= 0) return;
    sessions.push({ subject, hours });
    // Save all sessions for project timer page
    localStorage.setItem('sessions', JSON.stringify(sessions));
    // Save last session for backward compatibility
    localStorage.setItem('lastSession', JSON.stringify({ subject, hours }));
    renderSessions();
    renderTotal();
    renderStats();
    form.reset();
});

goalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        studyGoal = parseFloat(btn.dataset.goal);
        renderTotal();
    });
});

clearBtn.addEventListener('click', () => {
    sessions = [];
    renderSessions();
    renderTotal();
    renderStats();
});

// --- Dashboard Study Time Calculator Logic ---
let dashboardSessions = JSON.parse(localStorage.getItem('dashboardSessions') || '[]');
let dashboardGoal = null;
const dashboardForm = document.getElementById('dashboard-study-form');
const dashboardSessionsDiv = document.getElementById('dashboard-sessions');
const dashboardTotalTimeDiv = document.getElementById('dashboard-total-time');
const dashboardGoalStatusDiv = document.getElementById('dashboard-goal-status');
const dashboardGoalBtns = dashboardForm.parentNode.querySelectorAll('.goal-btn');
const dashboardClearBtn = document.getElementById('dashboard-clear-sessions');

function renderDashboardSessions() {
    dashboardSessionsDiv.innerHTML = '';
    dashboardSessions.forEach((s, i) => {
        const div = document.createElement('div');
        div.textContent = `${s.subject}: ${s.hours}h`;
        // Add delete button for each session
        const delBtn = document.createElement('button');
        delBtn.textContent = '🗑️';
        delBtn.style.marginLeft = '10px';
        delBtn.style.background = 'transparent';
        delBtn.style.border = 'none';
        delBtn.style.cursor = 'pointer';
        delBtn.onclick = () => {
            dashboardSessions.splice(i, 1);
            localStorage.setItem('dashboardSessions', JSON.stringify(dashboardSessions));
            renderDashboardSessions();
            renderDashboardTotal();
            renderDashboardTodayProgress();
        };
        div.appendChild(delBtn);
        dashboardSessionsDiv.appendChild(div);
    });
}

function renderDashboardTotal() {
    const total = dashboardSessions.reduce((sum, s) => sum + s.hours, 0);
    dashboardTotalTimeDiv.textContent = `Total Time: ${total} hours`;
    if (dashboardGoal) {
        if (total >= dashboardGoal) {
            dashboardGoalStatusDiv.textContent = `🎉 Goal reached! (${dashboardGoal}h)`;
            dashboardGoalStatusDiv.style.color = 'green';
        } else {
            dashboardGoalStatusDiv.textContent = `Goal: ${dashboardGoal}h (${(dashboardGoal-total).toFixed(1)}h left)`;
            dashboardGoalStatusDiv.style.color = 'orange';
        }
    } else {
        dashboardGoalStatusDiv.textContent = '';
    }
}

dashboardForm.onsubmit = function(e) {
    e.preventDefault();
    const subject = document.getElementById('dashboard-subject').value.trim();
    const hours = parseFloat(document.getElementById('dashboard-hours').value);
    if (!subject || isNaN(hours) || hours <= 0) return;
    dashboardSessions.push({ subject, hours });
    localStorage.setItem('dashboardSessions', JSON.stringify(dashboardSessions));
    renderDashboardSessions();
    renderDashboardTotal();
    renderDashboardTodayProgress();
    dashboardForm.reset();
};

dashboardGoalBtns.forEach(btn => {
    btn.onclick = function() {
        dashboardGoal = parseInt(btn.getAttribute('data-goal'));
        renderDashboardTotal();
    };
});

dashboardClearBtn.onclick = function() {
    dashboardSessions = [];
    localStorage.setItem('dashboardSessions', '[]');
    renderDashboardSessions();
    renderDashboardTotal();
    renderDashboardTodayProgress();
};

// --- Dashboard Today's Progress ---
function renderDashboardTodayProgress() {
    // For demo, just use all sessions as today
    const hours = dashboardSessions.reduce((sum, s) => sum + s.hours, 0);
    const count = dashboardSessions.length;
    // For streak, use a placeholder
    document.getElementById('dashboard-today-progress').innerHTML = `Hours: <b>${hours}</b><br>Sessions: <b>${count}</b><br>Streak: <b>3</b> days`;
}

// --- Dashboard Motivation ---
const dashboardQuotes = [
    "Stay focused and never give up!",
    "Every small step counts.",
    "You are capable of amazing things.",
    "Push yourself, because no one else will do it for you.",
    "Discipline is the bridge between goals and accomplishment.",
    "Dream big, work hard, stay focused.",
    "Success is the sum of small efforts repeated.",
    "Small progress is still progress.",
    "Believe in yourself and all that you are.",
    "Great job! Keep going!"
];
document.getElementById('dashboard-motivation-btn').onclick = function() {
    const q = dashboardQuotes[Math.floor(Math.random() * dashboardQuotes.length)];
    document.getElementById('dashboard-motivation-quote').textContent = `"${q}"`;
};

// --- Dashboard Pomodoro Quick Start ---
let dashboardPomoInterval, dashboardPomoSeconds = 0;
const dashboardPomoBtn = document.getElementById('dashboard-pomodoro-btn');
const dashboardPomoStatus = document.getElementById('dashboard-pomodoro-status');
dashboardPomoBtn.onclick = function() {
    if (dashboardPomoInterval) return;
    dashboardPomoSeconds = 25 * 60;
    dashboardPomoStatus.textContent = "25:00";
    dashboardPomoBtn.disabled = true;
    dashboardPomoInterval = setInterval(() => {
        dashboardPomoSeconds--;
        let m = String(Math.floor(dashboardPomoSeconds/60)).padStart(2,'0');
        let s = String(dashboardPomoSeconds%60).padStart(2,'0');
        dashboardPomoStatus.textContent = `${m}:${s}`;
        if (dashboardPomoSeconds <= 0) {
            clearInterval(dashboardPomoInterval);
            dashboardPomoInterval = null;
            dashboardPomoStatus.textContent = "Time's up! Take a break 🎉";
            dashboardPomoBtn.disabled = false;
        }
    }, 1000);
};

// --- Dashboard Timer Area Logic ---
let dashboardTimerInterval = null;
let dashboardTimerSeconds = 0;
let dashboardTimerRunning = false;
const dashboardTimerDisplay = document.getElementById('dashboard-timer-display');
const dashboardTimerStart = document.getElementById('dashboard-timer-start');
const dashboardTimerPause = document.getElementById('dashboard-timer-pause');
const dashboardTimerResume = document.getElementById('dashboard-timer-resume');
const dashboardTimerStop = document.getElementById('dashboard-timer-stop');
const dashboardTimerStatus = document.getElementById('dashboard-timer-status');

function updateDashboardTimerDisplay() {
    let h = String(Math.floor(dashboardTimerSeconds/3600)).padStart(2,'0');
    let m = String(Math.floor((dashboardTimerSeconds%3600)/60)).padStart(2,'0');
    let s = String(dashboardTimerSeconds%60).padStart(2,'0');
    dashboardTimerDisplay.textContent = `${h}:${m}:${s}`;
}

dashboardTimerStart.onclick = function() {
    if (dashboardTimerRunning) return;
    dashboardTimerRunning = true;
    dashboardTimerStart.style.display = 'none';
    dashboardTimerPause.style.display = '';
    dashboardTimerStop.style.display = '';
    dashboardTimerResume.style.display = 'none';
    dashboardTimerStatus.textContent = 'Timer started!';
    if (!dashboardTimerInterval) {
        dashboardTimerInterval = setInterval(() => {
            dashboardTimerSeconds++;
            updateDashboardTimerDisplay();
        }, 1000);
    }
};

dashboardTimerPause.onclick = function() {
    if (!dashboardTimerRunning) return;
    dashboardTimerRunning = false;
    clearInterval(dashboardTimerInterval);
    dashboardTimerInterval = null;
    dashboardTimerPause.style.display = 'none';
    dashboardTimerResume.style.display = '';
    dashboardTimerStatus.textContent = 'Timer paused.';
};

dashboardTimerResume.onclick = function() {
    if (dashboardTimerRunning) return;
    dashboardTimerRunning = true;
    dashboardTimerPause.style.display = '';
    dashboardTimerResume.style.display = 'none';
    dashboardTimerStatus.textContent = 'Timer resumed!';
    if (!dashboardTimerInterval) {
        dashboardTimerInterval = setInterval(() => {
            dashboardTimerSeconds++;
            updateDashboardTimerDisplay();
        }, 1000);
    }
};

dashboardTimerStop.onclick = function() {
    dashboardTimerRunning = false;
    clearInterval(dashboardTimerInterval);
    dashboardTimerInterval = null;
    dashboardTimerStart.style.display = '';
    dashboardTimerPause.style.display = 'none';
    dashboardTimerResume.style.display = 'none';
    dashboardTimerStop.style.display = 'none';
    dashboardTimerStatus.textContent = 'Timer stopped.';
    dashboardTimerSeconds = 0;
    updateDashboardTimerDisplay();
};

// Initialize timer display
updateDashboardTimerDisplay();

// --- Page Timer Area Logic ---
let pageTimerInterval = null;
let pageTimerSeconds = 0;
let pageTimerRunning = false;
const pageTimerDisplay = document.getElementById('page-timer-display');
const pageTimerStart = document.getElementById('page-timer-start');
const pageTimerPause = document.getElementById('page-timer-pause');
const pageTimerResume = document.getElementById('page-timer-resume');
const pageTimerStop = document.getElementById('page-timer-stop');
const pageTimerStatus = document.getElementById('page-timer-status');

function updatePageTimerDisplay() {
    let h = String(Math.floor(pageTimerSeconds/3600)).padStart(2,'0');
    let m = String(Math.floor((pageTimerSeconds%3600)/60)).padStart(2,'0');
    let s = String(pageTimerSeconds%60).padStart(2,'0');
    pageTimerDisplay.textContent = `${h}:${m}:${s}`;
}

pageTimerStart.onclick = function() {
    if (pageTimerRunning) return;
    pageTimerRunning = true;
    pageTimerStart.style.display = 'none';
    pageTimerPause.style.display = '';
    pageTimerStop.style.display = '';
    pageTimerResume.style.display = 'none';
    pageTimerStatus.textContent = 'Timer started!';
    if (!pageTimerInterval) {
        pageTimerInterval = setInterval(() => {
            pageTimerSeconds++;
            updatePageTimerDisplay();
        }, 1000);
    }
};

pageTimerPause.onclick = function() {
    if (!pageTimerRunning) return;
    pageTimerRunning = false;
    clearInterval(pageTimerInterval);
    pageTimerInterval = null;
    pageTimerPause.style.display = 'none';
    pageTimerResume.style.display = '';
    pageTimerStatus.textContent = 'Timer paused.';
};

pageTimerResume.onclick = function() {
    if (pageTimerRunning) return;
    pageTimerRunning = true;
    pageTimerPause.style.display = '';
    pageTimerResume.style.display = 'none';
    pageTimerStatus.textContent = 'Timer resumed!';
    if (!pageTimerInterval) {
        pageTimerInterval = setInterval(() => {
            pageTimerSeconds++;
            updatePageTimerDisplay();
        }, 1000);
    }
};

pageTimerStop.onclick = function() {
    pageTimerRunning = false;
    clearInterval(pageTimerInterval);
    pageTimerInterval = null;
    pageTimerStart.style.display = '';
    pageTimerPause.style.display = 'none';
    pageTimerResume.style.display = 'none';
    pageTimerStop.style.display = 'none';
    pageTimerStatus.textContent = 'Timer stopped.';
    pageTimerSeconds = 0;
    updatePageTimerDisplay();
};

// Initialize timer display
updatePageTimerDisplay();

// --- On load ---
renderDashboardSessions();
renderDashboardTotal();
renderDashboardTodayProgress();
renderSessions();
renderTotal();
renderStats();

document.addEventListener('DOMContentLoaded', function() {
    var startSessionBtn = document.getElementById('dashboard-start-session-btn');
    if (startSessionBtn) {
        startSessionBtn.addEventListener('click', function() {
            window.location.href = 'project.html';
        });
    }
});