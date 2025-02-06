document.addEventListener('DOMContentLoaded', function () {
    var map = L.map('map').setView([36.8, 26.0], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'by Mleof.com',
    }).addTo(map);

    let markers = [];
    let earthquakes = [];
    let lastTimestamp = null;
    let wakeLock = null;

    async function requestWakeLock() {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Ekran uyandırıldı');
        } catch (err) {
            console.error('Wake Lock API kullanılamıyor:', err);
        }
    }

    requestWakeLock();

    fetch('data.php')
        .then(response => response.json())
        .then(data => {
            earthquakes = data.data;
            updateEarthquakeBoxes(earthquakes);
        })
        .catch(error => {
            console.error("Veri alınırken bir hata oluştu:", error);
        });

    function addEarthquakeBox(earthquake, marker) {
        const container = document.getElementById('earthquake-container');
        const box = document.createElement('div');
        box.classList.add('earthquake-box');
        
        let color = "#5d5d5d";
        if (earthquake.ml > 5) color = "#ff0101";
        else if (earthquake.ml > 4) color = "#352242";
        else if (earthquake.ml > 3) color = "#473f23";

        box.style.backgroundColor = color;
        box.classList.add(`magnitude-${earthquake.ml}`);
        box.innerHTML = ` 
            <strong>${earthquake.ml}</strong> ${earthquake.location.full} 
            <br> Tarih & Saat: ${earthquake.time.date} ${earthquake.time.time} 
            <br> Konum: ${earthquake.geolocation} 
            <br> Derinlik: ${earthquake.depth} km
        `;

        box.addEventListener('click', () => {
            map.setView([earthquake.geolocation.split(',')[0], earthquake.geolocation.split(',')[1]], 10);
            marker.openPopup(); 
        });

        container.appendChild(box);
    }

    function updateEarthquakeBoxes(filteredEarthquakes) {
        const container = document.getElementById('earthquake-container');
        container.innerHTML = '';

        filteredEarthquakes.forEach(earthquake => {
            const [lat, lon] = earthquake.geolocation.split(',');
            let marker = L.circleMarker([lat, lon], {
                radius: earthquake.ml >= 5 ? 10 : earthquake.ml >= 4 ? 8 : 6, 
                color: earthquake.ml > 5 ? '#ff0101' : earthquake.ml > 4 ? '#352242' : '#929292',
                fillOpacity: 0.7
            }).addTo(map)
                .bindPopup(`<b>${earthquake.location.full}</b><br>Büyüklük: <b>${earthquake.ml}</b> <br> Tarih: ${earthquake.time.date} ${earthquake.time.time}`);

            markers.push(marker);
            addEarthquakeBox(earthquake, marker);
        });

        const latestEarthquake = filteredEarthquakes[0];
        const latestTimestamp = new Date(`${latestEarthquake.time.date} ${latestEarthquake.time.time}`).getTime();

        if (!lastTimestamp || latestTimestamp > lastTimestamp) {
            lastTimestamp = latestTimestamp;
            
            if (latestEarthquake.ml >= 5) {
                triggerAlarm(latestEarthquake);
            }
        }
    }

    function triggerAlarm(earthquake) {
        const alarmBox = document.createElement('div');
        alarmBox.classList.add('alarm-box');
        alarmBox.innerHTML = `
            <h2>Alarm: Yeni Deprem!</h2>
            <p><strong>Büyüklük:</strong> ${earthquake.ml}</p>
            <p><strong>Konum:</strong> ${earthquake.location.full}</p>
            <p><strong>Tarih:</strong> ${earthquake.time.date} ${earthquake.time.time}</p>
        `;

        document.body.appendChild(alarmBox);
        
        const alarmSound = document.getElementById('alarm-sound');
        alarmSound.volume = 0.1;  
        alarmSound.play();  

        setTimeout(() => {
            alarmBox.remove();
        }, 10000);  
    }

    setInterval(() => {
        fetch('data.php')
            .then(response => response.json())
            .then(data => {
                earthquakes = data.data;
                updateEarthquakeBoxes(earthquakes);
            })
            .catch(error => {
                console.error("Veri alınırken bir hata oluştu:", error);
            });
    }, 10000); 
});
