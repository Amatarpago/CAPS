
// ==================================================
// CONFIGURATION
// ==================================================

// Nomor WhatsApp admin yang menerima rangkuman.
const ADMIN_NUMBER = "6285798188591@c.us";


// ==================================================
// SESSION
// ==================================================

// Session berakhir setelah 1 jam tidak ada aktivitas.
//
// 60 detik
// × 60 menit
// = 1 jam
const SESSION_TIMEOUT = 60 * 60 * 1000;


// ==================================================
// LINK FORMULIR
// ==================================================

const ETAMU_URL =
    "https://e-tamu-bpsgumas.glide.page/";


// ==================================================
// LINK KATALOG PUBLIKASI
// ==================================================

const PUBLICATION_URL =
    "https://gumaskab.bps.go.id/id/publication";


// ==================================================
// EXPORT
// ==================================================

module.exports = {
    ADMIN_NUMBER,
    SESSION_TIMEOUT,
    ETAMU_URL,
    PUBLICATION_URL
};

