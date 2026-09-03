const {
Client,
LocalAuth
} = require("whatsapp-web.js");

const qrcode =
require("qrcode-terminal");

// ==================================================
// IMPORT
// ==================================================

const {
SESSION_TIMEOUT,
ADMIN_NUMBER
} = require("./config");

const {
getAllSessions
} = require("./sessionManager");

const {
finishSession
} = require("./messageHandler");

// ==================================================
// CREATE CLIENT
// ==================================================

const client =
new Client({


    authStrategy:
        new LocalAuth({
            clientId:
                "caps-bps-gunung-mas"
        }),

    puppeteer: {

        headless: true,

        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox"
        ]
    }
});


// ==================================================
// QR CODE
// ==================================================

client.on(
"qr",
(qr) => {


    console.log(
        "\n=============================================="
    );

    console.log(
        "📱 QR CODE DITERIMA"
    );

    console.log(
        "==============================================\n"
    );


    qrcode.generate(
        qr,
        {
            small: true
        }
    );


    console.log(
        "\n📲 Scan QR Code menggunakan WhatsApp."
    );

    console.log(
        "⏳ Menunggu proses login...\n"
    );
}


);

// ==================================================
// AUTHENTICATED
// ==================================================

client.on(
"authenticated",
() => {

    console.log(
        "🔐 WhatsApp berhasil diautentikasi."
    );
}


);

// ==================================================
// READY
// ==================================================

client.on(
"ready",
() => {


    console.log(
        "\n=============================================="
    );

    console.log(
        "🤖 BOT CAPS BPS KABUPATEN GUNUNG MAS"
    );

    console.log(
        "=============================================="
    );

    console.log(
        "✅ WhatsApp berhasil terhubung!"
    );

    console.log(
        `📱 Admin: ${ADMIN_NUMBER}`
    );

    console.log(
        "⏰ Session timeout: 1 jam"
    );

    console.log(
        "==============================================\n"
    );
}


);

// ==================================================
// AUTH FAILURE
// ==================================================

client.on(
"auth_failure",
(message) => {


    console.error(
        "❌ Autentikasi WhatsApp gagal:"
    );

    console.error(
        message
    );
}


);

// ==================================================
// DISCONNECTED
// ==================================================

client.on(
"disconnected",
(reason) => {


    console.log(
        "⚠️ WhatsApp terputus:"
    );

    console.log(
        reason
    );
}


);

// ==================================================
// MESSAGE HANDLER
// ==================================================

const {
handleMessage
} = require("./messageHandler");

client.on(
"message",
async (message) => {


    await handleMessage(
        client,
        message
    );
}


);

// ==================================================
// SESSION TIMEOUT
// ==================================================
//
// Dicek setiap 1 menit.
//
// Jika user tidak melakukan aktivitas
// selama 1 jam:
//
// 1. Bot mengirim pesan timeout
// 2. Rangkuman dikirim ke admin
// 3. Session dihapus
//
// ==================================================

setInterval(
async () => {


    const now =
        Date.now();


    for (
        const [user, session]
        of getAllSessions()
    ) {

        const inactiveTime =
            now -
            session.lastActivity;


        if (
            inactiveTime >=
            SESSION_TIMEOUT
        ) {

            console.log(
                `⏰ Session timeout: ${user}`
            );


            try {

                await client.sendMessage(
                    user,


`⏰ *Sesi layanan telah berakhir.*

Tidak ada aktivitas selama 1 jam.

Jika Anda masih membutuhkan informasi, silakan kirim pesan kembali untuk memulai layanan baru.

Terima kasih 🙏`
);


            } catch (error) {

                console.error(
                    "⚠️ Gagal mengirim pesan timeout:",
                    error
                );
            }


            // ==================================
            // FINISH SESSION
            // ==================================

            await finishSession(
                client,
                user,
                session,
                "Sesi otomatis berakhir karena tidak ada aktivitas selama 1 jam"
            );
        }
    }

},
60 * 1000


);

// ==================================================
// START BOT
// ==================================================

console.log(
"\n🚀 Menjalankan Bot CAPS..."
);

console.log(
"⏳ Menunggu WhatsApp...\n"
);

client.initialize();


