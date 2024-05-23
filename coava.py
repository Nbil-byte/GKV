import pandas as pd

# Membaca file data_mangga.csv
data_mangga = pd.read_csv('data_manggaril.csv')

# Membaca file kode_kabupaten_koordinat.csv
koordinat = pd.read_csv('kode_kabupaten_koordinat.csv')

# Menggabungkan kedua DataFrame berdasarkan kolom kode_kabupaten_kota
result = pd.merge(data_mangga, koordinat, on='kode_kabupaten_kota', how='left')

# Menyimpan hasil ke file CSV baru
result.to_csv('data_mangga_dengan_koordinat.csv', index=False)

# Menampilkan hasil
print(result)

