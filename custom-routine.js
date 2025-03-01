// Global variables
let originalRoutine = '';
let currentRoutine = '';

// Initialize when document loads
document.addEventListener('DOMContentLoaded', () => {
    initializeRoutineSystem();
});

function initializeRoutineSystem() {
    const modal = document.getElementById('routineModal');
    const createRoutineBtn = document.querySelector('.create-routine-btn');
    const closeBtn = document.querySelector('.close');
    const routineForm = document.getElementById('routineForm');
    const editBtn = document.getElementById('editSchedule');
    const saveBtn = document.getElementById('saveSchedule');
    const resetBtn = document.getElementById('resetSchedule');
    const routineTable = document.getElementById('routineTable');

    // Save default routine
    originalRoutine = routineTable.innerHTML;
    currentRoutine = originalRoutine;

    // Hide save/reset buttons initially
    saveBtn.style.display = 'none';
    resetBtn.style.display = 'none';

    // Event Listeners
    createRoutineBtn.onclick = () => modal.style.display = 'block';
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
    
    editBtn.onclick = () => makeRoutineEditable();
    saveBtn.onclick = () => saveRoutine();
    resetBtn.onclick = () => resetRoutine();
    
    routineForm.onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(routineForm);
        createNewRoutine(formData);
        modal.style.display = 'none';
        showNotification('নতুন রুটিন তৈরি করা হয়েছে!');
    };

    // Load saved routine if exists
    loadSavedRoutine();
}

function makeRoutineEditable() {
    const routineTable = document.getElementById('routineTable');
    const editBtn = document.getElementById('editSchedule');
    const saveBtn = document.getElementById('saveSchedule');
    const resetBtn = document.getElementById('resetSchedule');

    const cells = routineTable.querySelectorAll('tbody td');
    cells.forEach(cell => {
        if (!cell.querySelector('.duration')) {
            cell.contentEditable = true;
            cell.classList.add('editable');
        }
    });

    routineTable.classList.add('editable');
    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
    resetBtn.style.display = 'inline-block';
}

function saveRoutine() {
    const routineTable = document.getElementById('routineTable');
    const editBtn = document.getElementById('editSchedule');
    const saveBtn = document.getElementById('saveSchedule');
    const resetBtn = document.getElementById('resetSchedule');

    // Remove editable properties
    const cells = routineTable.querySelectorAll('.editable');
    cells.forEach(cell => {
        cell.contentEditable = false;
        cell.classList.remove('editable');
    });

    routineTable.classList.remove('editable');

    // Update current routine and save to localStorage
    currentRoutine = routineTable.innerHTML;
    originalRoutine = currentRoutine;
    localStorage.setItem('savedRoutine', currentRoutine);

    // Update button visibility
    editBtn.style.display = 'inline-block';
    saveBtn.style.display = 'none';
    resetBtn.style.display = 'none';

    showNotification('রুটিন সেভ করা হয়েছে!');
}

function resetRoutine() {
    const routineTable = document.getElementById('routineTable');
    const editBtn = document.getElementById('editSchedule');
    const saveBtn = document.getElementById('saveSchedule');
    const resetBtn = document.getElementById('resetSchedule');

    routineTable.innerHTML = currentRoutine;

    editBtn.style.display = 'inline-block';
    saveBtn.style.display = 'none';
    resetBtn.style.display = 'none';

    showNotification('রুটিন রিসেট করা হয়েছে!');
}

function loadSavedRoutine() {
    const routineTable = document.getElementById('routineTable');
    const savedRoutine = localStorage.getItem('savedRoutine');
    
    if (savedRoutine) {
        routineTable.innerHTML = savedRoutine;
        currentRoutine = savedRoutine;
    }
}

function createNewRoutine(formData) {
    const routineTable = document.getElementById('routineTable');
    const tbody = routineTable.querySelector('tbody');

    // Clear existing routine and local storage
    tbody.innerHTML = '';
    localStorage.removeItem('savedRoutine');

    // Get form data
    const preferences = {
        studentClass: formData.get('studentClass'),
        section: formData.get('section'),
        hardestSubjects: formData.getAll('hardestSubjects'),
        quranTime: formData.get('quranTime'),
        quranDuration: parseInt(formData.get('quranDuration')),
        fajrStudyHours: parseFloat(formData.get('fajrStudyHours')),
        noonStudyHours: parseFloat(formData.get('noonStudyHours')),
        needMCQPractice: formData.get('needMCQPractice') === 'yes',
        asrStudy: formData.get('asrStudy') === 'yes',
        nightStudy: formData.get('nightStudy') === 'yes',
        modelTestCount: parseInt(formData.get('modelTestCount')),
        subjectMinutes: {
            math: parseInt(formData.get('mathMinutes')),
            physics: parseInt(formData.get('physicsMinutes')),
            chemistry: parseInt(formData.get('chemistryMinutes')),
            biology: parseInt(formData.get('biologyMinutes')),
            english: parseInt(formData.get('englishMinutes')),
            bangla: parseInt(formData.get('banglaMinutes')),
            ict: parseInt(formData.get('ictMinutes'))
        }
    };

    // Generate new routine
    generateRoutine(tbody, preferences);

    // Save as current routine
    currentRoutine = routineTable.innerHTML;
    originalRoutine = currentRoutine;
    localStorage.setItem('savedRoutine', currentRoutine);
}

function generateRoutine(tbody, preferences) {
    // Get prayer times
    const prayerTimes = getPrayerTimes();
    
    // Add Sehri and Fajr
    addRoutineRow(tbody, prayerTimes.sehri - 30, prayerTimes.sehri, 'সেহরি', 'পুষ্টিকর খাবার');
    addRoutineRow(tbody, prayerTimes.fajr - 15, prayerTimes.fajr, 'ফজরের নামাজ', 'সুন্নত + ফরজ');

    // Add Quran time based on preference
    if (preferences.quranTime === 'fajr') {
        const startTime = prayerTimes.fajr + 15;
        addRoutineRow(tbody, startTime, startTime + preferences.quranDuration, 
            'কোরআন তিলাওয়াত', preferences.quranDuration + ' মিনিট');
    }

    // Add study blocks
    addStudyBlocks(tbody, preferences);

    // Add other prayers
    addRoutineRow(tbody, prayerTimes.dhuhr - 15, prayerTimes.dhuhr, 'যোহরের নামাজ', 'সুন্নত + ফরজ');
    addRoutineRow(tbody, prayerTimes.asr - 15, prayerTimes.asr, 'আসরের নামাজ', 'সুন্নত + ফরজ');
    addRoutineRow(tbody, prayerTimes.maghrib - 15, prayerTimes.maghrib, 'মাগরিবের নামাজ', 'সুন্নত + ফরজ');
    addRoutineRow(tbody, prayerTimes.isha - 15, prayerTimes.isha, 'ইশার নামাজ', 'সুন্নত + ফরজ');

    // Add night study if selected
    if (preferences.nightStudy) {
        addRoutineRow(tbody, prayerTimes.isha + 60, prayerTimes.isha + 120, 
            'রাতের পড়া', preferences.needMCQPractice ? 'MCQ প্র্যাকটিস' : 'রিভিশন');
    }
}

function addRoutineRow(tbody, startTime, endTime, activity, note) {
    const row = tbody.insertRow();
    
    const timeCell = row.insertCell(0);
    const activityCell = row.insertCell(1);
    const noteCell = row.insertCell(2);

    const startTimeStr = minutesToTime(startTime);
    const endTimeStr = minutesToTime(endTime);
    const duration = endTime - startTime;

    timeCell.innerHTML = `
        <div class="time-display">
            <span class="time-range">${startTimeStr} - ${endTimeStr}</span>
            <span class="duration">${formatDuration(duration)}</span>
        </div>
    `;
    
    activityCell.textContent = activity;
    noteCell.textContent = note;
}

function getPrayerTimes() {
    // Get prayer times from the page or use defaults
    return {
        sehri: timeToMinutes("4:00 AM"),
        fajr: timeToMinutes("4:30 AM"),
        dhuhr: timeToMinutes("1:15 PM"),
        asr: timeToMinutes("4:45 PM"),
        maghrib: timeToMinutes("6:15 PM"),
        isha: timeToMinutes("7:30 PM")
    };
}

function timeToMinutes(timeStr) {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) hours += 12;
    else if (period === 'AM' && hours === 12) hours = 0;
    
    return hours * 60 + minutes;
}

function minutesToTime(minutes) {
    let hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    
    if (hours > 12) hours -= 12;
    else if (hours === 0) hours = 12;
    
    return `${hours}:${mins.toString().padStart(2, '0')} ${period}`;
}

function formatDuration(minutes) {
    const hours = Math.floor(Math.abs(minutes) / 60);
    const mins = Math.abs(minutes) % 60;
    
    let durationText = '';
    if (hours > 0) durationText += `${hours} ঘণ্টা `;
    if (mins > 0) durationText += `${mins} মিনিট`;
    return durationText;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function addStudyBlocks(tbody, preferences) {
    const prayerTimes = getPrayerTimes();
    
    // Morning study block (after Fajr)
    let currentTime = prayerTimes.fajr + 30;
    if (preferences.quranTime === 'fajr') {
        currentTime += preferences.quranDuration;
    }
    
    // Add morning study for hardest subjects
    const morningStudyEnd = currentTime + (preferences.fajrStudyHours * 60);
    addRoutineRow(tbody, currentTime, morningStudyEnd, 
        'কঠিন বিষয়ের পড়া', preferences.hardestSubjects.join(', '));
    
    // Add rest/sleep time
    addRoutineRow(tbody, morningStudyEnd, morningStudyEnd + 90, 
        'বিশ্রাম/ঘুম', '১.৫ ঘণ্টা');
    
    // Midday study block
    const middayStudyStart = morningStudyEnd + 90;
    const middayStudyEnd = middayStudyStart + (preferences.noonStudyHours * 60);
    addRoutineRow(tbody, middayStudyStart, middayStudyEnd, 
        'সাধারণ পড়াশোনা', 'সব বিষয়ের নোট তৈরি ও রিভিশন');
    
    // Add rest before Dhuhr
    addRoutineRow(tbody, middayStudyEnd, prayerTimes.dhuhr - 15, 
        'বিশ্রাম', 'দুপুরের খাবার ও ঘুম');
    
    // Afternoon study if selected
    if (preferences.asrStudy) {
        const asrStudyStart = prayerTimes.dhuhr + 45;
        const asrStudyEnd = prayerTimes.asr - 15;
        addRoutineRow(tbody, asrStudyStart, asrStudyEnd, 
            'বিকালের পড়া', preferences.needMCQPractice ? 'MCQ প্র্যাকটিস' : 'হালকা পড়া');
    }
    
    // Add Quran time if selected for Asr
    if (preferences.quranTime === 'asr') {
        const quranStart = prayerTimes.asr + 15;
        addRoutineRow(tbody, quranStart, quranStart + preferences.quranDuration, 
            'কোরআন তিলাওয়াত', preferences.quranDuration + ' মিনিট');
    }
    
    // Evening light study
    const eveningStudyStart = prayerTimes.asr + 30;
    addRoutineRow(tbody, eveningStudyStart, prayerTimes.maghrib - 15, 
        'হালকা পড়া', 'ইংরেজি/বাংলা/ICT');
    
    // Add Quran time if selected for Maghrib
    if (preferences.quranTime === 'maghrib') {
        const quranStart = prayerTimes.maghrib + 30;
        addRoutineRow(tbody, quranStart, quranStart + preferences.quranDuration, 
            'কোরআন তিলাওয়াত', preferences.quranDuration + ' মিনিট');
    }
}

// Add styles
const style = document.createElement('style');
style.textContent = `
    .editable {
        background: rgba(52, 152, 219, 0.1);
        padding: 4px;
        border-radius: 4px;
        cursor: text;
    }
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #2ecc71;
        color: white;
        padding: 1rem 2rem;
        border-radius: 4px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease-out;
        z-index: 1000;
    }
    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
`;
document.head.appendChild(style); 