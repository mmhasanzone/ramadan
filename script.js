// Ramadan Schedule Data
const ramadanSchedule = [
    { day: 1, date: "March 2", sehriEnds: "5:03 AM", iftarTime: "6:00 PM" },
    { day: 2, date: "March 3", sehriEnds: "5:02 AM", iftarTime: "6:01 PM" },
    { day: 3, date: "March 4", sehriEnds: "5:01 AM", iftarTime: "6:01 PM" },
    { day: 4, date: "March 5", sehriEnds: "5:00 AM", iftarTime: "6:02 PM" },
    { day: 5, date: "March 6", sehriEnds: "4:59 AM", iftarTime: "6:02 PM" },
    { day: 6, date: "March 7", sehriEnds: "4:58 AM", iftarTime: "6:03 PM" },
    { day: 7, date: "March 8", sehriEnds: "4:57 AM", iftarTime: "6:03 PM" },
    { day: 8, date: "March 9", sehriEnds: "4:56 AM", iftarTime: "6:04 PM" },
    { day: 9, date: "March 10", sehriEnds: "4:55 AM", iftarTime: "6:04 PM" },
    { day: 10, date: "March 11", sehriEnds: "4:54 AM", iftarTime: "6:05 PM" },
    { day: 11, date: "March 12", sehriEnds: "4:53 AM", iftarTime: "6:05 PM" },
    { day: 12, date: "March 13", sehriEnds: "4:52 AM", iftarTime: "6:05 PM" },
    { day: 13, date: "March 14", sehriEnds: "4:51 AM", iftarTime: "6:06 PM" },
    { day: 14, date: "March 15", sehriEnds: "4:50 AM", iftarTime: "6:06 PM" },
    { day: 15, date: "March 16", sehriEnds: "4:50 AM", iftarTime: "6:06 PM" },
    { day: 16, date: "March 17", sehriEnds: "4:49 AM", iftarTime: "6:07 PM" },
    { day: 17, date: "March 18", sehriEnds: "4:47 AM", iftarTime: "6:07 PM" },
    { day: 18, date: "March 19", sehriEnds: "4:46 AM", iftarTime: "6:08 PM" },
    { day: 19, date: "March 20", sehriEnds: "4:45 AM", iftarTime: "6:08 PM" },
    { day: 20, date: "March 21", sehriEnds: "4:44 AM", iftarTime: "6:09 PM" },
    { day: 21, date: "March 22", sehriEnds: "4:43 AM", iftarTime: "6:09 PM" },
    { day: 22, date: "March 23", sehriEnds: "4:42 AM", iftarTime: "6:09 PM" },
    { day: 23, date: "March 24", sehriEnds: "4:41 AM", iftarTime: "6:10 PM" },
    { day: 24, date: "March 25", sehriEnds: "4:40 AM", iftarTime: "6:10 PM" },
    { day: 25, date: "March 26", sehriEnds: "4:39 AM", iftarTime: "6:11 PM" },
    { day: 26, date: "March 27", sehriEnds: "4:38 AM", iftarTime: "6:11 PM" },
    { day: 27, date: "March 28", sehriEnds: "4:37 AM", iftarTime: "6:12 PM" },
    { day: 28, date: "March 29", sehriEnds: "4:36 AM", iftarTime: "6:12 PM" },
    { day: 29, date: "March 30", sehriEnds: "4:35 AM", iftarTime: "6:12 PM" },
    { day: 30, date: "March 31", sehriEnds: "4:34 AM", iftarTime: "6:13 PM" }
];

// Populate Ramadan Schedule Table
function populateRamadanSchedule() {
    const tableBody = document.getElementById('schedule-body');
    ramadanSchedule.forEach(day => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${day.day}</td>
            <td>${day.date}</td>
            <td>${day.sehriEnds}</td>
            <td>${day.iftarTime}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Convert time to minutes (e.g., "4:30 AM" -> 270)
function timeToMinutes(timeStr) {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) {
        hours += 12;
    } else if (period === 'AM' && hours === 12) {
        hours = 0;
    }
    
    return hours * 60 + minutes;
}

// Convert minutes to time string (e.g., 270 -> "4:30 AM")
function minutesToTime(minutes) {
    let hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    
    if (hours > 12) {
        hours -= 12;
    } else if (hours === 0) {
        hours = 12;
    }
    
    return `${hours}:${mins.toString().padStart(2, '0')} ${period}`;
}

// Update Prayer Times based on current date
function updatePrayerTimes() {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1;
    
    // Check if today is in Ramadan
    const todaySchedule = ramadanSchedule.find(day => {
        const [month, date] = day.date.split(" ");
        return parseInt(date) === currentDay && getMonthNumber(month) === currentMonth;
    });

    // Update prayer times display
    const prayerTimes = {
        'fajr-time': '4:30 AM',
        'dhuhr-time': '1:15 PM',
        'asr-time': '4:45 PM',
        'maghrib-time': '6:15 PM',
        'isha-time': '7:30 PM'
    };

    // Convert and display all prayer times in minutes
    Object.entries(prayerTimes).forEach(([id, time]) => {
        const minutes = timeToMinutes(time);
        document.getElementById(id).textContent = `${minutes} মিনিট (${time})`;
    });

    // Only show Sehri and Iftar times during Ramadan
    const fajrNote = document.querySelector('.prayer-card.fajr .note');
    const maghribNote = document.querySelector('.prayer-card.maghrib .note');

    if (todaySchedule) {
        const sehriMinutes = timeToMinutes(todaySchedule.sehriEnds);
        const iftarMinutes = timeToMinutes(todaySchedule.iftarTime);
        
        fajrNote.textContent = `সেহরি শেষ: ${sehriMinutes} মিনিট (${todaySchedule.sehriEnds})`;
        maghribNote.textContent = `ইফতার: ${iftarMinutes} মিনিট (${todaySchedule.iftarTime})`;
        
        // Save to localStorage
        localStorage.setItem('lastUpdatedSchedule', JSON.stringify(todaySchedule));
    } else {
        // Hide Sehri and Iftar times if not Ramadan
        fajrNote.style.display = 'none';
        maghribNote.style.display = 'none';
    }

    // Highlight current prayer time
    const currentMinutes = timeToMinutes(new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: true 
    }));

    const prayerCards = document.querySelectorAll('.prayer-card');
    prayerCards.forEach(card => {
        const timeElement = card.querySelector('.time');
        const timeText = timeElement.textContent.split('(')[1].slice(0, -1); // Extract time from parentheses
        const cardMinutes = timeToMinutes(timeText);
        
        if (Math.abs(currentMinutes - cardMinutes) <= 30) { // Within 30 minutes
            card.style.backgroundColor = '#e8f4f8';
            card.style.borderLeft = '4px solid #3498db';
        } else {
            card.style.backgroundColor = '';
            card.style.borderLeft = '';
        }
    });
}

function getMonthNumber(month) {
    const months = {
        'January': 1,
        'February': 2,
        'March': 3,
        'April': 4,
        'May': 5,
        'June': 6,
        'July': 7,
        'August': 8,
        'September': 9,
        'October': 10,
        'November': 11,
        'December': 12
    };
    return months[month];
}

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    populateRamadanSchedule();
    updatePrayerTimes();
    
    // Update prayer times every minute
    setInterval(updatePrayerTimes, 60000);
    
    // Highlight current date in Ramadan schedule
    const currentDate = new Date();
    const rows = document.querySelectorAll('#schedule-body tr');
    rows.forEach(row => {
        const dateCell = row.cells[1].textContent;
        if (dateCell.includes(currentDate.getDate())) {
            row.style.backgroundColor = '#e8f4f8';
        }
    });
});
