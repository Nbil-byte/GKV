import pandas as pd

# Membaca file CSV
df = pd.read_csv('data_mangga_dengan_koordinat.csv')

# Mendapatkan daftar tahun unik dari kolom 'tahun'
unique_years = df['tahun'].unique()

# Memisahkan data berdasarkan tahun
for year in unique_years:
    # Filter data berdasarkan tahun
    filtered_data = df[df['tahun'] == year]
    
    # Menyimpan data ke file CSV
    file_name = f'data_mangga_{year}.csv'
    filtered_data.to_csv(file_name, index=False)

    print(f"Data untuk tahun {year} telah disimpan ke dalam file {file_name}")
