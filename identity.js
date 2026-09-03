
// ==================================================
// GET USER IDENTITY
// ==================================================
//
// Mengambil:
//
// 1. Nama pengguna
// 2. Nomor WhatsApp
//
// Jika WhatsApp memberikan @lid:
//
// 123456789@lid
//
// angka tersebut TIDAK dianggap sebagai nomor.
//
// Kita mencoba melakukan resolusi:
// LID → nomor WhatsApp
// ==================================================

async function getUserIdentity(
    client,
    message
) {

    let phoneNumber = "";
    let name = "";


    try {

        // ==========================================
        // GET CONTACT
        // ==========================================

        const contact =
            await message.getContact();


        // ==========================================
        // NAMA
        // ==========================================

        name =
            contact.pushname ||
            contact.name ||
            contact.shortName ||
            "";


        // ==========================================
        // CONTACT ID
        // ==========================================

        const contactId =
            contact.id?._serialized ||
            message.from;


        console.log(
            "🔎 Contact ID:",
            contactId
        );


        // ==========================================
        // JIKA @LID
        // ==========================================

        if (
            contactId &&
            contactId.endsWith("@lid")
        ) {

            console.log(
                "🔄 Contact menggunakan LID."
            );

            console.log(
                "🔄 Mencoba mencari nomor WhatsApp..."
            );


            try {

                const result =
                    await client.getContactLidAndPhone(
                        [contactId]
                    );


                console.log(
                    "🔎 Hasil getContactLidAndPhone:",
                    result
                );


                if (
                    result &&
                    result.length > 0
                ) {

                    const data =
                        result[0];


                    // ==================================
                    // FORMAT 1
                    // ==================================

                    if (
                        data.phoneNumber
                    ) {

                        phoneNumber =
                            String(
                                data.phoneNumber
                            )
                                .replace(
                                    "@c.us",
                                    ""
                                )
                                .replace(
                                    /\D/g,
                                    ""
                                );
                    }


                    // ==================================
                    // FORMAT 2
                    // ==================================

                    else if (
                        data.phone
                    ) {

                        phoneNumber =
                            String(
                                data.phone
                            )
                                .replace(
                                    "@c.us",
                                    ""
                                )
                                .replace(
                                    /\D/g,
                                    ""
                                );
                    }


                    // ==================================
                    // FORMAT 3
                    // ==================================

                    else if (
                        data.pn
                    ) {

                        phoneNumber =
                            String(
                                data.pn
                            )
                                .replace(
                                    "@c.us",
                                    ""
                                )
                                .replace(
                                    /\D/g,
                                    ""
                                );
                    }
                }

            } catch (error) {

                console.error(
                    "⚠️ Gagal melakukan resolusi LID → nomor:",
                    error
                );
            }
        }


        // ==========================================
        // JIKA @C.US
        // ==========================================

        else if (
            contactId &&
            contactId.endsWith("@c.us")
        ) {

            phoneNumber =
                contactId
                    .replace(
                        "@c.us",
                        ""
                    )
                    .replace(
                        /\D/g,
                        ""
                    );
        }


        // ==========================================
        // FALLBACK contact.number
        // ==========================================
        //
        // HANYA digunakan kalau bukan @lid.
        //

        if (
            !phoneNumber &&
            contact.number
        ) {

            const contactNumber =
                String(
                    contact.number
                );


            if (
                !contactNumber.includes(
                    "@lid"
                )
            ) {

                phoneNumber =
                    contactNumber
                        .replace(
                            "@c.us",
                            ""
                        )
                        .replace(
                            /\D/g,
                            ""
                        );
            }
        }


        // ==========================================
        // FALLBACK message.from
        // ==========================================

        if (
            !phoneNumber &&
            typeof message.from === "string" &&
            message.from.endsWith("@c.us")
        ) {

            phoneNumber =
                message.from
                    .replace(
                        "@c.us",
                        ""
                    )
                    .replace(
                        /\D/g,
                        ""
                    );
        }


        // ==========================================
        // FALLBACK NAMA DARI CHAT
        // ==========================================

        if (!name) {

            try {

                const chat =
                    await message.getChat();

                name =
                    chat.name ||
                    "";

            } catch (error) {

                console.log(
                    "⚠️ Tidak dapat mengambil nama chat."
                );
            }
        }

    } catch (error) {

        console.error(
            "⚠️ Gagal mengambil identitas:",
            error
        );
    }


    // ==========================================
    // HASIL
    // ==========================================

    return {

        phoneNumber:
            phoneNumber ||
            "Nomor tidak tersedia",

        name:
            name ||
            "Nama tidak tersedia"
    };
}


module.exports = {
    getUserIdentity
};

