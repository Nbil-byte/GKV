var map;
      var markers = [];
      var currentYear = 2013; // Tahun awal
      var minYear = 2013; // Tahun terawal
      var maxYear = 2022; // Tahun terakhir

      function initMap() {
        // Inisialisasi peta
        map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: -6.914744, lng: 107.609810 }, // Pusat peta di Jawa Barat
          zoom: 8
        });

        // Membaca file CSV awal
        readCSVFile(currentYear);
      }

      function readCSVFile(year) {
        var filename = `data_mangga_${year}.csv`;
        fetch(filename)
          .then(response => response.text())
          .then(csvText => {
            // Parsing CSV menggunakan PapaParse
            Papa.parse(csvText, {
              header: true,
              complete: function (results) {
                var data = results.data;
                // Loop melalui setiap baris data
                data.forEach(function (row) {
                  // Ambil data yang diperlukan
                  var location = {
                    name: row.nama_kabupaten_kota,
                    lat: parseFloat(row.titik_latitude),
                    lng: parseFloat(row.titik_longitude),
                    value: parseInt(row.produksi_mangga)
                  };
                  // Tambahkan marker ke peta
                  addMarker(location);
                });
              },
              error: function (error) {
                console.error("Error parsing CSV:", error);
              }
            });
          })
          .catch(error => console.error("Error fetching CSV:", error));
      }

      function addMarker(location) {
        var marker = new google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: map,
          title: location.name + ': ' + location.value,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: 'red',
            fillOpacity: 0.7,
            strokeWeight: 0,
            scale: Math.sqrt(location.value) * 5 // Atur ukuran bubble sesuai dengan nilai
          }
        });

        var infowindow = new google.maps.InfoWindow({
          content: `<strong>${location.name}</strong><br>Produksi: ${location.value}`
        });

        marker.addListener('mouseover', function() {
          infowindow.open(map, marker);
        });

        marker.addListener('mouseout', function() {
          infowindow.close();
        });

        markers.push(marker);
      }

      function updateCSVFile(year) {
        // Hapus semua marker yang ada
        markers.forEach(marker => marker.setMap(null));
        markers = [];

        // Baca file CSV yang baru
        readCSVFile(year);
      }

      function previousYear() {
        if (currentYear > minYear) {
          currentYear--;
          updateCSVFile(currentYear);
        } else {
          alert('Data for previous years is not available.');
        }
      }

      function nextYear() {
        if (currentYear < maxYear) {
          currentYear++;
          updateCSVFile(currentYear);
        } else {
          alert('Data for next years is not available.');
        }
      }

      // Panggil fungsi initMap saat halaman dimuat
      function loadScript() {
        var script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }

      window.onload = loadScript;