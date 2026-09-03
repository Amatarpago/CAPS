const {
createSession,
getSession,
updateActivity,
addHistory
} = require("./sessionManager");

const {
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


} = require("./menus");

const {
getUserIdentity
} = require("./identity");

// ==================================================
// HANDLE MESSAGE
// ==================================================

async function handleMessage(
client,
message
) {


try {

    // ==========================================
    // IGNORE BOT MESSAGE
    // ==========================================

    if (message.fromMe) return;


    // ==========================================
    // IGNORE EMPTY MESSAGE
    // ==========================================

    if (!message.body) return;


    const text =
        message.body.trim();

    const lowerText =
        text.toLowerCase();


    // ==========================================
    // INTERNAL USER ID
    // ==========================================
    //
    // Bisa @c.us atau @lid.
    //
    // Hanya untuk session internal.
    //
    // TIDAK dikirim ke admin.
    // ==========================================

    const user =
        message.from;


    console.log(
        `📩 Pesan masuk: ${text}`
    );


    // ==========================================
    // GET SESSION
    // ==========================================

    let session =
        getSession(user);


    // ==========================================
    // USER BARU
    // ==========================================

    if (!session) {

        const identity =
            await getUserIdentity(
                client,
                message
            );


        createSession(
            user,
            identity
        );


        session =
            getSession(user);


        console.log(
            `👤 Pengguna baru: ${identity.name}`
        );

        console.log(
            `📱 Nomor: ${identity.phoneNumber}`
        );


        // --------------------------------------
        // USER BARU → TAMPILKAN MENU
        // --------------------------------------

        await showMainMenu(
            client,
            user,
            session
        );

        return;
    }


    // ==========================================
    // UPDATE IDENTITAS
    // ==========================================

    try {

        const identity =
            await getUserIdentity(
                client,
                message
            );


        if (
            identity.phoneNumber &&
            identity.phoneNumber !==
            "Nomor tidak tersedia"
        ) {

            session.phoneNumber =
                identity.phoneNumber;
        }


        if (
            identity.name &&
            identity.name !==
            "Nama tidak tersedia"
        ) {

            session.name =
                identity.name;
        }

    } catch (error) {

        console.log(
            "⚠️ Identitas tidak dapat diperbarui."
        );
    }


    // ==========================================
    // UPDATE ACTIVITY
    // ==========================================

    updateActivity(user);


    // ==========================================
    // COMMAND MENU
    // ==========================================

    if (
        [
            "0",
            "menu",
            "menu utama",
            "kembali"
        ].includes(lowerText)
    ) {

        await showMainMenu(
            client,
            user,
            session
        );

        return;
    }


    // ==================================================
    // WAITING DETAIL
    // ==================================================

    if (
        session.state ===
        "waitingDetail"
    ) {

        const service =
            session.pendingService;


        // --------------------------------------
        // SIMPAN RIWAYAT
        // --------------------------------------

        addHistory(
            user,
            service,
            text
        );


        // --------------------------------------
        // KIRIM RESPONSE
        // --------------------------------------

        await sendFreeTextResponse(
            client,
            user,
            service,
            text
        );


        // --------------------------------------
        // TANYA BANTUAN LAIN
        // --------------------------------------

        await askMoreHelp(
            client,
            user,
            session
        );

        return;
    }


    // ==================================================
    // ASK MORE
    // ==================================================

    if (
        session.state ===
        "askMore"
    ) {


        // ======================================
        // YA
        // ======================================

        if (
            [
                "1",
                "ya",
                "iya",
                "iya ada",
                "yes"
            ].includes(lowerText)
        ) {

            await showMainMenu(
                client,
                user,
                session
            );

            return;
        }


        // ======================================
        // TIDAK
        // ======================================

        if (
            [
                "2",
                "tidak",
                "tidak ada",
                "nggak",
                "ngga",
                "enggak",
                "engga",
                "no",
                "selesai"
            ].includes(lowerText)
        ) {

            await finishSession(
                client,
                user,
                session,
                "Pengguna menyatakan tidak membutuhkan bantuan lagi"
            );

            return;
        }


        // ======================================
        // INVALID
        // ======================================

        await client.sendMessage(
            user,


`❌ Pilihan tidak tersedia.

Mohon balas:

1️⃣ Ya
2️⃣ Tidak`
);


        return;
    }


    // ==================================================
    // MAIN MENU
    // ==================================================

    if (
        session.state ===
        "main"
    ) {

        switch (lowerText) {

            // ==================================
            // 1. INFORMASI UMUM
            // ==================================

            case "1":

                await showInfoMenu(
                    client,
                    user,
                    session
                );

                break;


            // ==================================
            // 2. PERMINTAAN DATA
            // ==================================

            case "2":

                await showDataMenu(
                    client,
                    user,
                    session
                );

                break;


            // ==================================
            // 3. PETUGAS MITRA
            // ==================================

            case "3":

                addHistory(
                    user,
                    "Petugas Mitra"
                );


                await sendPartnerInfo(
                    client,
                    user
                );


                await askMoreHelp(
                    client,
                    user,
                    session
                );

                break;


            // ==================================
            // 4. LAINNYA
            // ==================================

            case "4":

                await askOtherRequest(
                    client,
                    user,
                    session
                );

                break;


            // ==================================
            // INVALID
            // ==================================

            default:

                await client.sendMessage(
                    user,


`❌ Pilihan tidak tersedia.

Silakan balas dengan angka *1 sampai 4*.`
);


                break;
        }

        return;
    }


    // ==================================================
    // MENU 1 - INFORMASI UMUM
    // ==================================================

    if (
        session.state ===
        "menu1"
    ) {

        switch (lowerText) {


            // ==================================
            // PROFIL
            // ==================================

            case "1":

                addHistory(
                    user,
                    "Informasi Umum - Profil Kami"
                );


                await sendProfile(
                    client,
                    user
                );


                await askMoreHelp(
                    client,
                    user,
                    session
                );

                break;


            // ==================================
            // ALAMAT
            // ==================================

            case "2":

                addHistory(
                    user,
                    "Informasi Umum - Alamat BPS"
                );


                await sendAddress(
                    client,
                    user
                );


                await askMoreHelp(
                    client,
                    user,
                    session
                );

                break;


            // ==================================
            // JAM PELAYANAN
            // ==================================

            case "3":

                addHistory(
                    user,
                    "Informasi Umum - Jam Pelayanan Kantor"
                );


                await sendOfficeHours(
                    client,
                    user
                );


                await askMoreHelp(
                    client,
                    user,
                    session
                );

                break;


            // ==================================
            // KONTAK
            // ==================================

            case "4":

                addHistory(
                    user,
                    "Informasi Umum - Kontak BPS"
                );


                await sendContact(
                    client,
                    user
                );


                await askMoreHelp(
                    client,
                    user,
                    session
                );

                break;


            // ==================================
            // INVALID
            // ==================================

            default:

                await client.sendMessage(
                    user,


`❌ Pilihan tidak tersedia.

Silakan balas dengan angka *1 sampai 4*.`
);


                break;
        }

        return;
    }


    // ==================================================
    // MENU 2 - PERMINTAAN DATA
    // ==================================================

    if (
        session.state ===
        "menu2"
    ) {

        switch (lowerText) {


            // ==================================
            // PERMINTAAN DATA
            // ==================================

            case "1":

                await askDataRequest(
                    client,
                    user,
                    session
                );

                break;


            // ==================================
            // KONSULTASI DATA
            // ==================================

            case "2":

                await askDataConsultation(
                    client,
                    user,
                    session
                );

                break;


            // ==================================
            // KATALOG
            // ==================================

            case "3":

                addHistory(
                    user,
                    "Permintaan Data - Katalog Publikasi"
                );


                await sendPublication(
                    client,
                    user
                );


                await askMoreHelp(
                    client,
                    user,
                    session
                );

                break;


            // ==================================
            // INVALID
            // ==================================

            default:

                await client.sendMessage(
                    user,


`❌ Pilihan tidak tersedia.

Silakan balas dengan angka *1 sampai 3*.`
);


                break;
        }

        return;
    }

} catch (error) {

    console.error(
        "❌ Error handleMessage:",
        error
    );
}


}

// ==================================================
// FINISH SESSION
// ==================================================

async function finishSession(
client,
user,
session,
reason
) {


// ==============================================
// IMPORT DI SINI UNTUK MENGHINDARI
// CIRCULAR DEPENDENCY
// ==============================================

const {
    createSummary,
    deleteSession
} = require("./sessionManager");

const {
    ADMIN_NUMBER
} = require("./config");


// ==============================================
// SUMMARY
// ==============================================

const summary =
    createSummary(session);


// ==============================================
// IDENTITAS
// ==============================================

const phoneNumber =
    session.phoneNumber ||
    "Nomor tidak tersedia";

const name =
    session.name ||
    "Nama tidak tersedia";


// ==============================================
// KIRIM PESAN SELESAI KE USER
// ==============================================

try {

    await client.sendMessage(
        user,


`🙏 *Terima kasih telah menggunakan Layanan Informasi BPS Kabupaten Gunung Mas.*

Semoga informasi yang kami berikan dapat membantu.

Sampai jumpa kembali 👋`
);


} catch (error) {

    console.error(
        "⚠️ Gagal mengirim pesan selesai:",
        error
    );
}


// ==============================================
// KIRIM RANGKUMAN KE ADMIN
// ==============================================

try {

    await client.sendMessage(
        ADMIN_NUMBER,


`📋 *RINGKASAN LAYANAN CAPS*

👤 *Nama Pengguna*
${name}

📱 *Nomor WhatsApp*
${phoneNumber}

📌 *Layanan yang Dibutuhkan*

${summary}

🔚 *Status*
${reason}`
);


    console.log(
        `✅ Rangkuman berhasil dikirim ke admin.`
    );


} catch (error) {

    console.error(
        "❌ Gagal mengirim rangkuman ke admin:",
        error
    );
}


// ==============================================
// HAPUS SESSION
// ==============================================

deleteSession(user);


}

module.exports = {
handleMessage,
finishSession
};


