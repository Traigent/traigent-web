import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { trackEvent } from "../lib/analytics";
import ConsentGate from "./ConsentGate";
import ConsentCheckbox from "./ConsentCheckbox";

// HubSpot Forms API config — values from the embed snippet in HubSpot.
// These are PUBLIC (already in the public embed code), so it's fine to inline.
const HUBSPOT = {
  portalId: "148486827",
  formId: "b60362d8-a1d8-4cfc-86ed-3034c4549665",
};

// HubSpot's classic v2 submission endpoint. We use this instead of the
// JSON-based v3 integration/submit endpoint because v2 accepts
// application/x-www-form-urlencoded — which is a "simple" CORS request
// that doesn't trigger a preflight OPTIONS check. That makes it the
// reliable choice for in-browser cross-origin submissions.
const HUBSPOT_API = `https://forms.hubspot.com/uploads/form/v2/${HUBSPOT.portalId}/${HUBSPOT.formId}`;

// Field names MUST match the internal field names in the HubSpot form.
// The Traigent form has exactly 4 fields: firstname, lastname, email, message.
// (No company field — HubSpot rejects unknown field names.)
const FIELDS = {
  firstname: "firstname",
  lastname: "lastname",
  email: "email",
  message: "message",
};

// Block submissions from personal/consumer email providers.
const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com", "googlemail.com",
  "yahoo.com", "yahoo.co.uk", "yahoo.fr", "yahoo.de", "yahoo.co.in",
  "hotmail.com", "hotmail.co.uk", "hotmail.fr",
  "outlook.com", "live.com", "msn.com",
  "aol.com",
  "icloud.com", "me.com", "mac.com",
  "protonmail.com", "proton.me", "pm.me",
  "mail.com",
  "gmx.com", "gmx.de", "gmx.net",
  "yandex.com", "yandex.ru",
  "zoho.com",
  "fastmail.com", "fastmail.fm",
  "tutanota.com", "tuta.io",
  "inbox.com", "rediffmail.com",
  "qq.com", "163.com", "126.com",
  "walla.com", "walla.co.il",
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateBusinessEmail(email) {
  if (!email) return "Email is required.";
  if (!EMAIL_RE.test(email)) return "Please enter a valid email address.";
  const domain = email.split("@")[1].toLowerCase();
  if (FREE_EMAIL_DOMAINS.has(domain)) {
    return "Please use your business email — personal addresses (gmail, yahoo, outlook, etc.) are not accepted.";
  }
  return null;
}

export default function ContactSection() {
  const sectionRef = useRef(null);
  const [form, setForm] = useState({ firstname: "", lastname: "", email: "", message: "" });
  const [agreed, setAgreed] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  // Fire viewed event once for engagement attribution.
  useEffect(() => {
    if (!sectionRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackEvent("contact_section_viewed");
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Belt-and-suspenders: the GDPR checkbox already disables the submit
    // button, but reject any submit that slips through (autofill, JS poke,
    // browser extension) so we never POST a lead without consent on file.
    if (!agreed) {
      trackEvent("contact_form_validation_failed", { reason: "no_consent" });
      return;
    }
    const err = validateBusinessEmail(form.email);
    if (err) {
      setEmailError(err);
      trackEvent("contact_form_validation_failed", { reason: "personal_email" });
      return;
    }
    setEmailError("");
    setSubmitError("");
    setSending(true);

    // Build form-encoded body (URLSearchParams ⇒ Content-Type:
    // application/x-www-form-urlencoded, a "simple" CORS request — no preflight).
    const body = new URLSearchParams();
    body.append(FIELDS.firstname, form.firstname);
    body.append(FIELDS.lastname, form.lastname);
    body.append(FIELDS.email, form.email);
    body.append(FIELDS.message, form.message);
    // hs_context carries page metadata so HubSpot records where the lead came from.
    body.append(
      "hs_context",
      JSON.stringify({
        pageUri: typeof window !== "undefined" ? window.location.href : "",
        pageName: typeof document !== "undefined" ? document.title : "Traigent",
      })
    );

    try {
      const res = await fetch(HUBSPOT_API, {
        method: "POST",
        body,
      });
      // v2 returns 204 No Content (or sometimes 302) on success.
      if (res.ok || res.status === 204 || res.status === 302) {
        trackEvent("contact_form_submitted");
        setSent(true);
        setForm({ firstname: "", lastname: "", email: "", message: "" });
      } else {
        trackEvent("contact_form_error", { reason: "server", status: res.status });
        setSubmitError(
          "Something went wrong sending your message. Please email us directly at amir@traigent.ai."
        );
      }
    } catch {
      trackEvent("contact_form_error", { reason: "network" });
      setSubmitError(
        "Network error sending your message. Please email us directly at amir@traigent.ai."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-20 bg-[#080808] border-t border-slate-800/50 scroll-mt-20"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Contact Us</h2>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Optimizing AI agents? Let's talk. Use your business email — we typically reply within one business day.
          </p>
        </motion.div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-slate-900/60 border border-emerald-500/40 rounded-2xl p-8 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
              <Send className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Message sent</h3>
            <p className="text-slate-400">
              Thanks for reaching out. We'll get back to you at the email you provided within one business day.
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-6 text-sm text-slate-400 hover:text-white transition-colors underline underline-offset-4"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <ConsentGate>
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 md:p-8 space-y-5"
          >
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="firstname" className="block text-sm font-medium text-slate-300 mb-2">First name</label>
                <input
                  id="firstname"
                  type="text"
                  required
                  value={form.firstname}
                  onChange={update("firstname")}
                  placeholder="Jane"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#1A6BF5] focus:ring-1 focus:ring-[#1A6BF5]/40 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="lastname" className="block text-sm font-medium text-slate-300 mb-2">Last name</label>
                <input
                  id="lastname"
                  type="text"
                  value={form.lastname}
                  onChange={update("lastname")}
                  placeholder="Doe"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#1A6BF5] focus:ring-1 focus:ring-[#1A6BF5]/40 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Business Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  if (emailError) setEmailError("");
                }}
                placeholder="jane@company.com"
                className={`w-full bg-slate-950 border rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 transition-colors ${
                  emailError
                    ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/40"
                    : "border-slate-700 focus:border-[#1A6BF5] focus:ring-[#1A6BF5]/40"
                }`}
              />
              {emailError ? (
                <p className="text-red-400 text-xs mt-2">{emailError}</p>
              ) : (
                <p className="text-slate-500 text-xs mt-2">
                  Please use your company email — gmail, yahoo, outlook, etc. won't be accepted.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">Message</label>
              <textarea
                id="message"
                rows={5}
                required
                value={form.message}
                onChange={update("message")}
                placeholder="Tell us about your agents and what you're trying to optimize..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#1A6BF5] focus:ring-1 focus:ring-[#1A6BF5]/40 transition-colors resize-y"
              />
            </div>

            {submitError && (
              <div className="bg-red-500/10 border border-red-500/40 text-red-300 text-sm rounded-lg px-4 py-3">
                {submitError}
              </div>
            )}

            <ConsentCheckbox
              id="contact-consent"
              checked={agreed}
              onChange={setAgreed}
            />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
              <p className="text-xs text-slate-500">
                {sending ? "Sending..." : "Submissions land in our HubSpot CRM."}
              </p>
              <button
                type="submit"
                disabled={sending || !agreed}
                className="inline-flex items-center justify-center bg-[#1A6BF5] hover:bg-[#4D8EF8] disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap"
              >
                <Send className="w-4 h-4 mr-2" />
                {sending ? "Sending..." : "Send Message"}
              </button>
            </div>
          </motion.form>
          </ConsentGate>
        )}
      </div>
    </section>
  );
}
