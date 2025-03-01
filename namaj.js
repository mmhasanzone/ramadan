document.addEventListener('DOMContentLoaded', function() {
    // Enable prayer time editing
    const prayerTimes = document.querySelectorAll('.prayer-card .time');
    
    prayerTimes.forEach(timeElement => {
        timeElement.addEventListener('click', function() {
            const currentTime = this.textContent;
            const newTime = prompt('নতুন সময় লিখুন (HH:MM AM/PM):', currentTime);
            
            if (newTime !== null && isValidTime(newTime)) {
                this.textContent = formatTime(newTime);
                savePrayerTimes(); // Save to localStorage
            } else if (newTime !== null) {
                alert('দুঃখিত! সঠিক ফরম্যাটে সময় লিখুন (উদাহরণ: 4:30 AM)');
            }
        });
    });

    // Validate time format
    function isValidTime(timeString) {
        const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
        return timeRegex.test(timeString.trim());
    }

    // Format time consistently
    function formatTime(timeString) {
        const [time, period] = timeString.trim().split(/\s+/);
        const [hours, minutes] = time.split(':');
        return `${parseInt(hours)}:${minutes.padStart(2, '0')} ${period.toUpperCase()}`;
    }

    // Save prayer times to localStorage
    function savePrayerTimes() {
        const times = {};
        prayerTimes.forEach(time => {
            const prayerId = time.id;
            times[prayerId] = time.textContent;
        });
        localStorage.setItem('prayerTimes', JSON.stringify(times));
    }

    // Load saved prayer times
    function loadPrayerTimes() {
        const savedTimes = localStorage.getItem('prayerTimes');
        if (savedTimes) {
            const times = JSON.parse(savedTimes);
            for (const [id, time] of Object.entries(times)) {
                const element = document.getElementById(id);
                if (element) element.textContent = time;
            }
        }
    }

    // Load saved times on page load
    loadPrayerTimes();
});