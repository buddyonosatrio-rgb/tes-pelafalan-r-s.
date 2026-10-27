# LEOCE — Lion Pronunciation Challenge

Website MVP untuk merekam latihan pelafalan R/S, menyimpan rekaman secara lokal, memberi skor manual, melihat riwayat, dan mengekspor data.

## Isi paket
- `index.html` — halaman website.
- `styles.css` — desain merah-kuning, responsif.
- `app.js` — permainan, perekam audio, IndexedDB, riwayat, CSV, dashboard.
- `netlify.toml` — konfigurasi Netlify.
- `netlify/functions/analyze-pronunciation.js` — endpoint transkripsi opsional; hasil tetap harus ditinjau penguji.

## Cara menjalankan di GitHub + Netlify
1. Unggah semua file dan folder sesuai struktur di atas ke repositori GitHub.
2. Pastikan `netlify.toml` berada di folder utama dan function ada di `netlify/functions/analyze-pronunciation.js`.
3. Di Netlify, impor proyek dari GitHub. Publish directory: `.`. Build command dapat dikosongkan. Folder functions sudah ditentukan di `netlify.toml`.
4. Deploy. Gunakan alamat HTTPS Netlify untuk akses mikrofon.
5. Jika ingin mengaktifkan endpoint transkripsi, buka Site configuration / Environment variables lalu tambahkan `OPENAI_API_KEY`. Jangan pernah menaruh API key di `app.js` atau file publik.
6. Deploy ulang setelah mengubah environment variable.

## Cara menggunakan
1. Buka website melalui HTTPS.
2. Mulai tantangan, isi kode siswa dan pilih level.
3. Izinkan akses mikrofon, rekam siswa membaca teks, lalu simpan setiap rekaman.
4. Pada halaman hasil, penguji dapat memberi skor manual R dan S: 1 = sangat jelas, 5 = sangat tidak jelas.
5. Buka Riwayat Tes untuk memutar audio dan ekspor CSV.
6. Buka Analisis untuk melihat rata-rata skor dari sesi yang telah diberi nilai.

## Penting: penyimpanan
Versi ini menyimpan sesi dan audio di IndexedDB pada browser/perangkat yang digunakan. Data tidak otomatis tersinkron ke perangkat lain dan dapat hilang jika data situs dihapus. Ekspor CSV hanya berisi metadata/skor; cadangan JSON saat ini berisi metadata dan tidak menyertakan berkas audio. Untuk penelitian, buat cadangan audio secara terpisah dan pindahkan ke penyimpanan terproteksi. Jangan simpan data identitas atau rekaman anak tanpa persetujuan yang sesuai.

## Batasan penilaian
Versi ini tidak memberi skor otomatis AI untuk cadel. Transkripsi ucapan saja tidak cukup untuk menilai artikulasi bunyi R/S secara akurat. Skor manual harus ditetapkan penguji berdasarkan rubrik yang konsisten, dan temuan bukan diagnosis medis. Endpoint opsional hanya memberi transkripsi sebagai bantuan peninjauan.

## Saran sebelum penelitian
- Gunakan ID samaran.
- Dapatkan persetujuan orang tua/wali dan persetujuan sekolah sesuai kebutuhan.
- Tetapkan protokol tes dan rubrik penilaian sebelum mengumpulkan data.
- Batasi akses audio dan hapus data sesuai jadwal retensi penelitian.
