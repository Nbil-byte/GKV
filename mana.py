import pandas as pd
from io import StringIO

# Mengubah data string menjadi DataFrame
df = pd.read_csv('data_koordinat.csv')

# Mengambil kolom yang diperlukan
result = df[['bps_kode_kabupaten_kota', 'titik_longitude', 'titik_latitude']]

# Menghapus duplikasi kode kabupaten (jika diperlukan)
result = result.drop_duplicates(subset='bps_kode_kabupaten_kota')

# Menyimpan hasil ke CSV baru (jika diperlukan)
result.to_csv('kode_kabupaten_koordinat.csv', index=False)

# Menampilkan hasil
print(result)
