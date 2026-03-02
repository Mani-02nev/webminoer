import emailjs from '@emailjs/browser';

// Service ID and Template IDs from EmailJS
// You must set these in your .env file
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID_REGISTRATION = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_REG;
const TEMPLATE_ID_CERTIFICATE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CERT;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const triggerRegistrationEmail = async (recipient) => {
    console.log("📨 Attempting to send Registration Email via EmailJS...");

    if (!SERVICE_ID || !PUBLIC_KEY) {
        console.warn("⚠️ EmailJS Keys missing! Using Mock Fallback.");
        return mockRegistrationEmail(recipient);
    }

    console.log("📨 Sending Registration Email To:", recipient.email);
    console.log("📨 Payload being sent:", {
        to_email: recipient.email,
        name: recipient.name,
        from_name: "Tech Stack Support"
    });

    try {
        const response = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID_REGISTRATION,
            {
                // REQUIRED: Matches {{to_email}} in the "To Email" field
                to_email: recipient.email,

                // REQUIRED: Matches {{name}} in the template body ("Hello {{name}}")
                name: recipient.name,

                // REQUIRED: Matches {{date}} in the template body
                date: "Feb 15, 2026",

                // REQUIRED: Matches {{reply_to}} in the "Reply To" field
                reply_to: recipient.email,

                // OPTIONAL: Matches {{from_name}} if you use it in "From Name" field
                from_name: "Tech Stack Support",

                // OPTIONAL: Matches {{webinar_time}} if used
                webinar_time: "7:00 PM IST",

                // OPTIONAL: Matches {{message}} if used
                message: "You have successfully registered for the 'React Roadmap to Students' webinar on Feb 15, 2026 at 7:00 PM IST.",
            },
            PUBLIC_KEY
        );
        console.log("✅ Email Sent Successfully!", response.status, response.text);
        return { success: true };
    } catch (error) {
        console.error("❌ Email Sending Failed:", error);
        return { success: false, error };
    }
};

export const triggerCertificateEmail = async (recipient, certificateId) => {
    console.log("📧 Attempting to send Certificate Email via EmailJS...");

    if (!SERVICE_ID || !PUBLIC_KEY) {
        console.warn("⚠️ EmailJS Keys missing! Using Mock Fallback.");
        return mockCertificateEmail(recipient, certificateId);
    }

    try {
        const response = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID_CERTIFICATE,
            {
                // REQUIRED: Matches {{to_email}} in "To Email"
                to_email: recipient.email,

                // REQUIRED: Matches {{name}} in body
                name: recipient.name,

                // REQUIRED: Matches {{reply_to}} in "Reply To"
                reply_to: recipient.email,

                // OPTIONAL: Matches {{from_name}} in "From Name"
                from_name: "Tech Stack Support",

                // Certificate Specifics

                // Template Variables matching your provided HTML
                certificate_link: `${window.location.origin}/certificate/${certificateId}?download=true`,
                verify_link: `${window.location.origin}/verify/${certificateId}`,
                date: "Feb 15, 2026",
                certificate_id: certificateId,

                download_label: "Download Certificate",
                message: `Congratulations ${recipient.name}! Your certificate for the "React Roadmap to Students" webinar is ready.`
            },
            PUBLIC_KEY
        );
        console.log("✅ Certificate Email Sent!", response.status, response.text);
        return { success: true };
    } catch (error) {
        console.error("❌ Certificate Email Failed:", error);
        return { success: false, error };
    }
};

export const triggerWhatsAppMessage = async (recipient) => {
    // WhatsApp Automatic Sending is NOT possible without a Business API ($$$).
    // We log it here, and the UI provides a "Click to Chat" link.
    console.log("------------------------------------------");
    console.log("📱 [WHATSAPP LOG]: System cannot auto-send to WhatsApp.");
    console.log("Action: User must click the WhatsApp button on confirmation page.");
    console.log("------------------------------------------");
};

// --- MOCK FALLBACKS (Used if no keys) ---

const mockRegistrationEmail = async (recipient) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`[MOCK EMAIL] To: ${recipient.email} - "Registration Confirmed"`);
    return { success: true, mock: true };
};

const mockCertificateEmail = async (recipient, certificateId) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`[MOCK EMAIL] To: ${recipient.email} - "Certificate: ${certificateId}"`);
    return { success: true, mock: true };
};
