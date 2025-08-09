# Aplikasi Project Management Cerdas

Aplikasi ini adalah antarmuka frontend untuk sebuah sistem manajemen proyek modern yang dirancang untuk menjadi partner strategis bagi tim. Dibangun dengan Vue.js dan Tailwind CSS, aplikasi ini berfokus pada UI/UX yang bersih, interaktivitas, dan fungsionalitas cerdas.

## Pilar Utama
[cite_start]Proyek ini dikembangkan berdasarkan tiga pilar utama[cite: 11]:
1.  [cite_start]**Cerdas & Proaktif**: Tidak hanya sebagai alat pencatat, tetapi juga sebagai asisten AI yang membantu tim mengidentifikasi risiko dan mengoptimalkan alur kerja. [cite: 12]
2.  [cite_start]**Kolaborasi**: Dirancang agar dapat digunakan bersama oleh semua anggota tim secara optimal dan andal. [cite: 13]
3.  [cite_start]**Berpusat pada Manusia**: Memprioritaskan manajemen beban kerja dan kesejahteraan tim untuk mencegah *burnout*. [cite: 14, 15]

## Fitur Unggulan
* **Layout Interaktif**: Sidebar yang bisa di-minimize dengan ikon dan header yang bersih. 
* [cite_start]**Dashboard Eksekutif**: Tampilan ringkasan proyek dengan kartu statistik dan 4 jenis grafik yang informatif (Doughnut & Bar). [cite: 61, 62]
* **Filter Canggih & Interdependent**: Filter *multi-select* yang saling terhubung dengan fitur *search* dan *select all*.
* **Manajemen Tugas Lengkap**: Halaman daftar tugas dengan fungsionalitas CRUD penuh melalui modal, *sorting* di setiap kolom, dan paginasi.
* [cite_start]**Manajemen Pengguna & Peran**: Antarmuka *tab* untuk mengelola pengguna dan hak akses (izin) untuk setiap peran. [cite: 56]
* **Notifikasi Toast**: Umpan balik visual modern untuk setiap aksi pengguna.
* [cite_start]**Integrasi AI (Simulasi)**: Indikator risiko pada tugas dan rekomendasi cerdas di dalam modal. [cite: 20, 21]

## Teknologi yang Digunakan
* **Framework**: Vue.js 3 (Composition API dengan `<script setup>`)
* **Build Tool**: Vite
* **Styling**: Tailwind CSS
* **State Management**: Pinia
* **HTTP Client**: Axios
* **Library Tambahan**:
    * `@vueform/multiselect` untuk filter canggih.
    * `vue-toastification` untuk notifikasi.
    * [cite_start]`chart.js` & `vue-chartjs` untuk visualisasi data. [cite: 44]
    * `@heroicons/vue` untuk ikonografi.
    * [cite_start]`date-fns` untuk manipulasi tanggal. [cite: 44]

## Instalasi dan Setup (Frontend)
1.  Pastikan Node.js terinstal.
2.  Navigasi ke folder `frontend`.
    ```bash
    cd frontend
    ```
3.  Instal semua dependensi.
    ```bash
    npm install
    ```
4.  Jalankan server pengembangan.
    ```bash
    npm run dev
    ```
5.  Buka aplikasi di `http://localhost:5173`.