# Security Spec — Ibadah Perayaan Natal Bersama 2026 (Firestore)

## 1. Data Invariants
1. **Default-Deny Baseline**: Seluruh path yang tidak didefinisikan eksplisit ditolak (`allow read, write: if false`).
2. **PII Isolation**: Data pribadi tamu (`namaLengkap`, `nomorHp`, `alamat`, `namaPendamping`) di `/rsvps/{phoneHash}` hanya dapat dibaca (`get`, `list`) oleh panitia terautentikasi dengan email terverifikasi (`jufrontamoama@gmail.com`). Tamu publik tidak dapat membaca atau melakukan `list` terhadap koleksi `/rsvps`.
3. **Duplicate Phone Prevention & Atomicity**: Nomor HP kanonik di-hash (SHA-256 hex 64 karakter) sebagai ID dokumen `/rsvp_phones/{phoneHash}` dan `/rsvps/{phoneHash}`. Pembuatan kedua dokumen wajib dilakukan dalam satu batch atomik (`existsAfter` timbal balik), dan `update`/`delete` dinonaktifkan (`if false`) agar satu nomor HP tidak pernah dapat menimpa atau mengirim ulang data.
4. **No Enumeration on Phone Locks**: Koleksi `/rsvp_phones` memblokir operasi `list` (`if false`) dan hanya mengizinkan `get` untuk ID hash 64 karakter hex yang valid.
5. **Strict Schema & Size Bounds**: Seluruh string memiliki batas panjang eksplisit, `jumlahPeserta` dibatasi integer `1..10`, `namaPendamping` wajib memiliki panjang tepat `jumlahPeserta - 1`, `sumberUndangan` dibatasi pada enum resmi, dan `createdAt == request.time`.

## 2. Dirty Dozen Payloads (All Must Result in PERMISSION_DENIED)
1. **Unauthenticated List PII**: Tamu publik memanggil `getDocs(collection(db, "rsvps"))`.
2. **Unauthenticated Get PII**: Tamu publik memanggil `getDoc(doc(db, "rsvps", validHash))`.
3. **Email Spoofing Panitia**: Akun dengan email panitia tetapi `email_verified: false` mencoba `list` `/rsvps`.
4. **Unauthorized Authenticated User**: Akun Google non-panitia dengan `email_verified: true` mencoba `list` `/rsvps`.
5. **Shadow Key Injection**: Mengirim dokumen `/rsvps/{phoneHash}` dengan field tambahan `isAdmin: true`.
6. **Orphaned RSVP Without Phone Lock**: Membuat dokumen `/rsvps/{phoneHash}` tanpa menyertakan `/rsvp_phones/{phoneHash}` dalam batch atomik yang sama.
7. **Orphaned Phone Lock Without RSVP**: Membuat dokumen `/rsvp_phones/{phoneHash}` tanpa menyertakan `/rsvps/{phoneHash}` dalam batch atomik yang sama.
8. **Duplicate Overwrite Attempt**: Mencoba `setDoc`/`updateDoc` pada `/rsvps/{phoneHash}` yang sudah ada.
9. **Client Timestamp Forgery**: Mengirim `createdAt` berupa timestamp manual bukan `serverTimestamp()` (`request.time`).
10. **ID Poisoning**: Mengirim ID dokumen non-hex atau panjang > 64 karakter ke `/rsvps/{id}` atau `/rsvp_phones/{id}`.
11. **Guest Count / Array Mismatch**: Mengirim `jumlahPeserta: 3` dengan `namaPendamping: ["Budi"]` (panjang tidak sama dengan `jumlahPeserta - 1`) atau `jumlahPeserta: 99`.
12. **List Enumeration on Phone Locks**: Memanggil `getDocs(collection(db, "rsvp_phones"))`.
