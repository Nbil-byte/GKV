google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(initialize);

let currentYearIndex = 9; // Index untuk tahun 2021 (produksi_2021)
let data;
const yearKeys = ['produksi_2013', 'produksi_2014', 'produksi_2015', 'produksi_2016', 'produksi_2017', 'produksi_2018', 'produksi_2019', 'produksi_2020', 'produksi_2021', 'produksi_2022'];

function initialize() {
    d3.csv('Data_Produksi_Mangga_Terpivot.csv').then(function(loadedData) {
        data = loadedData;
        drawChart();

        document.getElementById('prevBtn').addEventListener('click', () => changeYear(-1));
        document.getElementById('nextBtn').addEventListener('click', () => changeYear(1));
    }).catch(function(error) {
        console.error('Error loading the CSV file:', error);
    });
}

function changeYear(offset) {
    if (currentYearIndex + offset >= 1 && currentYearIndex + offset < yearKeys.length) {
        currentYearIndex += offset;
        drawChart();
    }
}

function drawChart() {
    let chartData = [['Kabupaten/Kota', yearKeys[currentYearIndex - 1].split('_')[1], yearKeys[currentYearIndex].split('_')[1]]];
    data.forEach(row => {
        chartData.push([row.nama_kabupaten_kota, parseInt(row[yearKeys[currentYearIndex - 1]]), parseInt(row[yearKeys[currentYearIndex]])]);
    });

    var dataTable = google.visualization.arrayToDataTable(chartData);

    var options = {
        title: `Perbandingan Produksi Mangga Setiap Kabupaten/Kota (${yearKeys[currentYearIndex - 1].split('_')[1]} vs ${yearKeys[currentYearIndex].split('_')[1]})`,
        chartArea: {width: '50%'},
        colors: ['#2D4059', '#F07B3F'],
        hAxis: {
            title: 'Produksi (Kuintal)',
            minValue: 0,
            textStyle: {
                bold: true,
                fontSize: 12,
                color: '#4d4d4d'
            },
            titleTextStyle: {
                bold: true,
                fontSize: 18,
                color: '#4d4d4d'
            }
        },
        vAxis: {
            title: 'Kabupaten/Kota',
            textStyle: {
                fontSize: 14,
                bold: true,
                color: '#848484'
            },
            titleTextStyle: {
                fontSize: 14,
                bold: true,
                color: '#848484'
            }
        }
    };

    var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
    chart.draw(dataTable, options);
}
