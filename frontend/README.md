# RespiraCare Frontend

Next.js 16 + Tailwind CSS 4. Visual style follows the Figma export (rounded green UI, AQI hero card, five-colour scale).

## Run

```bash
pnpm install
pnpm dev     # http://localhost:3000
pnpm build
```

## Routes

| Route | Figma screen |
| :-- | :-- |
| `/` | 00 Splash |
| `/peta` | 01 Peta Publik Warga, 08 state kosong (pilih Kel. Sungai Baru) |
| `/lapor` | 02 Form Lapor Gejala |
| `/lapor/memproses` | 09 State loading |
| `/lapor/konfirmasi` | 03 Konfirmasi AI |
| `/lapor/hasil` | 04 Kartu Hasil |
| `/lapor/kendala` | 10 State error GPS / jaringan |
| `/klinik` | Tab Klinik (tanpa desain Figma, memakai gaya kartu yang sama) |
| `/petugas/login` | 05 Login Petugas |
| `/petugas` | 06 Dasbor mobile, D01 Dasbor desktop (>= 1024px) |
| `/petugas/klaster/[id]` | 07 Detail Klaster |

## Data

Semua data masih contoh lokal di `src/lib/data.ts`. Titik sambung ke backend:

- Login petugas: `signInOfficer` di `src/lib/officer-session.ts` (ganti dengan `POST /api/auth/login`).
- Klasifikasi gejala: `classifyStory` di `src/lib/symptoms.ts` (ganti dengan `POST /api/ai/classify`).
- Kirim laporan: tombol Konfirmasi di `src/app/lapor/konfirmasi/page.tsx` (ganti dengan `POST /api/reports`).
- Peta: `src/components/map-canvas.tsx` berupa ilustrasi SVG; kontrak marker bisa dipindah ke Leaflet atau MapLibre.

## Brand

Logo ada di `public/logo*.png`, ikon aplikasi di `src/app/icon.png` dan `apple-icon.png`. Font: Nunito (paket `@fontsource-variable/nunito`, tanpa request ke Google Fonts).
