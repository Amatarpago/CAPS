
const {
    ADMIN_NUMBER
} = require("./config");


// ==================================================
// SESSION STORAGE
// ==================================================
//
// Map digunakan untuk menyimpan session setiap user.
//
// Key bisa berupa:
// 6281234567890@c.us
//
// atau:
// 123456789@lid
//
// LID hanya digunakan secara internal.
// TIDAK PERNAH dikirim ke admin.
//

const userState = new Map();


// ==================================================
// CREATE SESSION
// ==================================================

function createSession(
    user,
    identity = {}
) {

    userState.set(user, {

        // ------------------------------------------
        // State chatbot
        // ------------------------------------------

        state: "main",


        // ------------------------------------------
        // Waktu aktivitas terakhir
        // ------------------------------------------

        lastActivity: Date.now(),


        // ------------------------------------------
        // Layanan yang sedang menunggu input
        // ------------------------------------------

        pendingService: null,


        // ------------------------------------------
        // Identitas pengguna
        // ------------------------------------------

        phoneNumber:
            identity.phoneNumber ||
            "Nomor tidak tersedia",

        name:
            identity.name ||
            "Nama tidak tersedia",


        // ------------------------------------------
        // Semua riwayat selama session
        // ------------------------------------------

        history: []
    });
}


// ==================================================
// GET SESSION
// ==================================================

function getSession(user) {

    return userState.get(user);
}


// ==================================================
// UPDATE ACTIVITY
// ==================================================

function updateActivity(user) {

    const session =
        userState.get(user);

    if (!session) return;

    session.lastActivity =
        Date.now();
}


// ==================================================
// ADD HISTORY
// ==================================================

function addHistory(
    user,
    layanan,
    detail = null
) {

    const session =
        userState.get(user);

    if (!session) return;


    session.history.push({

        layanan: layanan,

        detail: detail,

        waktu:
            new Date().toLocaleString(
                "id-ID",
                {
                    timeZone: "Asia/Jakarta"
                }
            )
    });
}


// ==================================================
// CREATE SUMMARY
// ==================================================

function createSummary(session) {

    if (
        !session ||
        session.history.length === 0
    ) {

        return "Belum ada layanan yang dipilih.";
    }


    return session.history
        .map((item, index) => {

            let result =
                `${index + 1}. ${item.layanan}`;


            if (item.detail) {

                result +=
                    `\n   📝 Detail: ${item.detail}`;
            }


            result +=
                `\n   🕒 ${item.waktu}`;


            return result;

        })
        .join("\n\n");
}


// ==================================================
// DELETE SESSION
// ==================================================

function deleteSession(user) {

    userState.delete(user);
}


// ==================================================
// GET ALL SESSIONS
// ==================================================

function getAllSessions() {

    return userState.entries();
}


// ==================================================
// EXPORT
// ==================================================

module.exports = {

    userState,

    createSession,

    getSession,

    updateActivity,

    addHistory,

    createSummary,

    deleteSession,

    getAllSessions
};

