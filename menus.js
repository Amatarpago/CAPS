const {
ETAMU_URL,
PUBLICATION_URL
} = require("./config");

// ==================================================
// MAIN MENU
// ==================================================

async function showMainMenu(
client,
user,
session
) {

session.state =
    "main";

session.lastActivity =
    Date.now();

session.pendingService =
    null;


await client.sendMessage(
    user,


`👋 *Selamat Datang di Layanan Informasi BPS Kabupaten Gunung Mas*

Silakan pilih layanan berikut:

1️⃣ Informasi Umum
2️⃣ Permintaan Data
3️⃣ Petugas Mitra
4️⃣ Lainnya

✉️ Balas dengan angka pilihan Anda.`
);
}

// ==================================================
// MENU 1 - INFORMASI UMUM
// ==================================================

async function showInfoMenu(
client,
user,
session
) {


session.state =
    "menu1";


await client.sendMessage(
    user,


`📌 *Informasi Umum*

Silakan pilih informasi yang Anda butuhkan:

1️⃣ Profil Kami
2️⃣ Alamat BPS
3️⃣ Jam Pelayanan Kantor
4️⃣ Kontak BPS

0️⃣ Kembali ke Menu Utama

✉️ Balas dengan angka pilihan Anda.`
);
}

// ==================================================
// MENU 2 - PERMINTAAN DATA
// ==================================================

async function showDataMenu(
client,
user,
session
) {


session.state =
    "menu2";


await client.sendMessage(
    user,


`📊 *Permintaan Data*

Silakan pilih layanan yang Anda butuhkan:

1️⃣ Permintaan Data Statistik
2️⃣ Konsultasi Data Statistik
3️⃣ Katalog Publikasi

0️⃣ Kembali ke Menu Utama

✉️ Balas dengan angka pilihan Anda.`
);
}

// ==================================================
// ASK MORE HELP
// ==================================================

async function askMoreHelp(
client,
user,
session
) {


session.state =
    "askMore";

session.lastActivity =
    Date.now();

session.pendingService =
    null;


await client.sendMessage(
    user,


`🙏 *Apakah ada lagi yang bisa kami bantu?*

1️⃣ Ya, kembali ke Menu Utama
2️⃣ Tidak, selesai

✉️ Balas dengan angka *1* atau *2*.`
);
}

// ==================================================
// INFORMASI UMUM
// ==================================================

async function sendProfile(
client,
user
) {


await client.sendMessage(
    user,


`📌 *Profil BPS Kabupaten Gunung Mas*

Badan Pusat Statistik Kabupaten Gunung Mas adalah instansi vertikal BPS yang bertugas melaksanakan kegiatan penyediaan data dan informasi statistik, serta pembinaan statistik sektoral guna mendukung pembangunan di wilayah Kabupaten Gunung Mas.`
);
}

async function sendAddress(
client,
user
) {


await client.sendMessage(
    user,


`📍 *Alamat BPS Kabupaten Gunung Mas*

Kantor BPS Kabupaten Gunung Mas beralamat di:
Jl. Katamso No. 97, Tampang Tumbang Anjir, Kecamatan Kuala Kurun, Kabupaten Gunung Mas, Kalimantan Tengah. 74571.

Peta Lokasi Google Maps: https://maps.app.goo.gl/qRAY152EUMyzLVEY7`
);
}

async function sendOfficeHours(
client,
user
) {


await client.sendMessage(
    user,


`🕘 Jam Pelayanan Kantor

Jam Layanan PST (Pelayanan Statistik Terpadu) BPS Kabupaten Gunung Mas:
 Senin - Kamis: 08.00 - 15.30 WIB
 Jumat: 08.00 - 16.00 WIB
(Waktu Istirahat: 12.00 - 13.00 WIB)`
);
}

async function sendContact(
client,
user
) {


await client.sendMessage(
    user,


`☎️ Kontak BPS Kabupaten Gunung Mas

Anda dapat menghubungi BPS Kabupaten Gunung Mas melalui:
📲 WhatsApp PST: +62811-506-211
✉️ Email: bps6210@bps.go.id
🌐 Website Resmi: gunungmaskab.bps.go.id`
);
}

// ==================================================
// PETUGAS MITRA
// ==================================================

async function sendPartnerInfo(
client,
user
) {


await client.sendMessage(
    user,


`👥 *Petugas Mitra*

Saat ini BPS Kabupaten Gunung Mas sedang tidak membuka rekrutmen Mitra Baru.`
);
}

// ==================================================
// INPUT PERMINTAAN DATA
// ==================================================

async function askDataRequest(
client,
user,
session
) {


session.state =
    "waitingDetail";

session.pendingService =
    "Permintaan Data - Permintaan Data Statistik";


await client.sendMessage(
    user,


`📊 *Permintaan Data Statistik*

Silakan ketik data statistik yang Anda butuhkan.

Contoh:
*"Saya membutuhkan data jumlah penduduk Kabupaten Gunung Mas tahun 2025."*

✉️ Silakan ketik kebutuhan data Anda.`
);
}

// ==================================================
// INPUT KONSULTASI DATA
// ==================================================

async function askDataConsultation(
client,
user,
session
) {


session.state =
    "waitingDetail";

session.pendingService =
    "Permintaan Data - Konsultasi Data Statistik";


await client.sendMessage(
    user,


`💬 *Konsultasi Data Statistik*

Silakan ketik pertanyaan atau kebutuhan data yang ingin Anda konsultasikan.

Contoh:
*"Saya ingin berkonsultasi mengenai data kemiskinan Kabupaten Gunung Mas."*

✉️ Silakan ketik pertanyaan Anda.`
);
}

// ==================================================
// KATALOG PUBLIKASI
// ==================================================

async function sendPublication(
client,
user
) {


await client.sendMessage(
    user,


`📚 *Katalog Publikasi*

Katalog publikasi BPS Kabupaten Gunung Mas dapat diakses melalui:

${PUBLICATION_URL}`
);
}

// ==================================================
// LAINNYA
// ==================================================

async function askOtherRequest(
client,
user,
session
) {


session.state =
    "waitingDetail";

session.pendingService =
    "Lainnya";


await client.sendMessage(
    user,


`📝 *Lainnya*

Silakan ketik kebutuhan atau pertanyaan Anda.

Permintaan Anda akan dicatat dan diteruskan kepada petugas BPS Kabupaten Gunung Mas.

✉️ Silakan ketik kebutuhan Anda.`
);
}

// ==================================================
// RESPONSE INPUT BEBAS
// ==================================================

async function sendFreeTextResponse(
client,
user,
service,
text
) {


// ==============================================
// PERMINTAAN DATA
// ==============================================

if (
    service ===
    "Permintaan Data - Permintaan Data Statistik"
) {

    await client.sendMessage(
        user,


`✅ *Permintaan Anda telah dicatat.*

📝 *Data yang Anda butuhkan:*
${text}

⏳ *Permintaan anda akan diproses dalam 1x24 jam.*

Diharapkan untuk mengisi formulir di:
${ETAMU_URL}`
);


    return;
}


// ==============================================
// KONSULTASI
// ==============================================

if (
    service ===
    "Permintaan Data - Konsultasi Data Statistik"
) {

    await client.sendMessage(
        user,


`✅ *Konsultasi Anda telah dicatat.*

📝 *Pertanyaan/kebutuhan Anda:*
${text}

⏳ *Permintaan anda akan diproses dalam 1x24 jam.*

Diharapkan untuk mengisi formulir di:
${ETAMU_URL}`
);


    return;
}


// ==============================================
// LAINNYA
// ==============================================

if (
    service === "Lainnya"
) {

    await client.sendMessage(
        user,


`✅ *Permintaan Anda telah dicatat.*

📝 *Kebutuhan Anda:*
${text}

⏳ *Permintaan anda akan diproses dalam 1x24 jam.*`
);
}
}

// ==================================================
// EXPORT
// ==================================================

module.exports = {


showMainMenu,

showInfoMenu,

showDataMenu,

askMoreHelp,

sendProfile,

sendAddress,

sendOfficeHours,

sendContact,

sendPartnerInfo,

askDataRequest,

askDataConsultation,

sendPublication,

askOtherRequest,

sendFreeTextResponse


};


