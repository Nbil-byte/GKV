var map;
var markers = [];
var markerCluster;
var currentYear = 2013;
const minYear = 2013;
const maxYear = 2022;

function initMap() {
    map = L.map('map').setView([-6.914744, 107.609810], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Initialize the marker cluster group
    markerCluster = L.markerClusterGroup();

    loadCSVData(currentYear);
    setupLegend();
    map.addLayer(markerCluster); // Add the marker cluster group to the map
}

function loadCSVData(year) {
  fetch(`data_mangga_${year}.csv`)
      .then(response => response.text())
      .then(csvText => {
          Papa.parse(csvText, {
              header: true,
              complete: function(results) {
                  clearMarkers();
                  var data = results.data;
                  data.forEach(function(row) {
                      var location = {
                          name: row.nama_kabupaten_kota,
                          lat: parseFloat(row.titik_latitude),
                          lng: parseFloat(row.titik_longitude),
                          value: parseInt(row.produksi_mangga)
                      };
                      if (!isNaN(location.lat) && !isNaN(location.lng)) {
                          addMarker(location);
                      } else {
                          console.error(`Invalid LatLng for ${location.name}: (${location.lat}, ${location.lng})`);
                      }
                  });
                  document.getElementById('yearLabel').textContent = year;
                  updateYearLabel(year); // Update the year label on the map
              },
              error: function(error) {
                  console.error("Error parsing CSV:", error);
              }
          });
      })
      .catch(error => console.error("Error fetching CSV:", error));
}

function clearMarkers() {
    markerCluster.clearLayers();
}

function addMarker(location) {
  var marker = L.circleMarker([location.lat, location.lng], {
      radius: 30,  // Set the radius to a fixed size
      fillColor: getColorByValue(location.value),
      fillOpacity: 0.7,  // Maintain fill opacity
      color: '#000',
      weight: 1
  });

  var formattedValue = location.value.toLocaleString('id-ID');  // Format the number with thousand separators
  var popupContent = '<div><strong>' + location.name + '</strong><br>Produksi: ' + formattedValue + ' kuintal</div>';

  marker.bindPopup(popupContent);

  marker.on('mouseover', function (e) {
      this.openPopup();
  });

  marker.on('mouseout', function (e) {
      this.closePopup();
  });

  markers.push(marker);
  markerCluster.addLayer(marker);  // Add the marker to the marker cluster group
}


function getColorByValue(value) {
  let hue;
  let saturation;
  let lightness;

  if (value < 50000) {
      // Interpolasi linear antara putih (0, 0%, 100%) dan hijau (120, 100%, 50%)
      hue = 120; // Hijau
      saturation = (value / 50000) * 100; // Saturasi dari 0% hingga 100%
      lightness = 100 - ((value / 50000) * 50); // Lightness dari 100% ke 50%
  } else if (value >= 50000 && value <= 200000) {
      // Interpolasi linear antara hijau (120) dan kuning (60)
      hue = 120 + (60 - 120) * ((value - 50000) / (200000 - 50000));
      saturation = 100; // Saturasi tetap 100%
      lightness = 50; // Lightness tetap 50%
  } else {
      // Interpolasi linear antara kuning (60) dan merah (0)
      hue = 60 + (0 - 60) * ((value - 200000) / (900000 - 200000)); // 706435 bisa disesuaikan sesuai nilai maksimum yang diharapkan
      saturation = 100; // Saturasi tetap 100%
      lightness = 50; // Lightness tetap 50%
  }

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}


function setupLegend() {
    const legend = document.getElementById('legend');
    legend.style.display = 'block';
    
    // Update legend with consistent colors
    legend.innerHTML = '<h3>Legenda Produksi Mangga</h3>' +
                       '<div><span style="height: 10px; width: 10px; background-color: hsl(120, 100%, 50%); display: inline-block;"></span> Rendah (&lt; 50.000 kw)</div>' +
                       '<div><span style="height: 10px; width: 10px; background-color: hsl(60, 100%, 50%); display: inline-block;"></span> Sedang (50.000 - 200.000 kw)</div>' +
                       '<div><span style="height: 10px; width: 10px; background-color: hsl(0, 100%, 50%); display: inline-block;"></span> Tinggi (&gt; 200.000 kw)</div>';
    
    var legendControl = L.control({position: 'bottomright'});

    legendControl.onAdd = function (map) {
        return legend;
    };

    legendControl.addTo(map);
}

function loadNextYear() {
    if (currentYear < maxYear) {
        currentYear++;
        loadCSVData(currentYear);
    }
}

function loadPreviousYear() {
    if (currentYear > minYear) {
        currentYear--;
        loadCSVData(currentYear);
    }
}

function setupYearLabel() {
  const yearLabel = L.control({ position: 'topright' });

  yearLabel.onAdd = function (map) {
      const div = L.DomUtil.create('div', 'info');
      div.innerHTML = `Produksi Mangga Jawa Barat Tahun <span id="mapYearLabel">${currentYear}</span>`;
      return div;
  };

  yearLabel.addTo(map);
}

function updateYearLabel(year) {
  document.getElementById('mapYearLabel').textContent = year;
}
