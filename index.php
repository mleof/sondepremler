<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deprem Bilgisi</title>
    <link rel="stylesheet" href="styles.css">
	<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
</head>
<body>
    <header>
        <h1>Mleof v1.0 Son Depremler</h1>
    </header>
 <div id="alarm" class="hidden">
        <p id="alarm-message"></p>
        <audio id="alarm-sound" src="alarm.mp3" preload="auto"></audio>
    </div>
  <div id="map"></div>
     <div id="earthquake-info-container">
    <div class="info-box" id="info-1">
        <span class="color-box" style="background-color: #5d5d5d;"></span>
        <span>1+ Büyüklüğünde Depremler</span>
    </div>
    <div class="info-box" id="info-3">
        <span class="color-box" style="background-color: #473f23;"></span>
        <span>3+ Büyüklüğünde Depremler</span>
    </div>
    <div class="info-box" id="info-4">
        <span class="color-box" style="background-color: #352242;"></span>
        <span>4+ Büyüklüğünde Depremler</span>
    </div>
    <div class="info-box" id="info-5">
        <span class="color-box" style="background-color: #ff0101;"></span>
        <span>5+ Büyüklüğünde Depremler</span>
    </div>
</div>
    <div id="earthquake-container"></div>
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="script.js"></script>
</body>
</html>
