import { Helmet } from "react-helmet-async";
import AgreementText from "../components/AgreementText";

/**
 * The Access & Evaluation Agreement page — the click-through IP/
 * confidentiality agreement accepted on every gated surface (Start Now /
 * SDK, Portal, Academy). The body lives in components/AgreementText.jsx
 * (shared with the in-gate scroll boxes); bump AGREEMENT_VERSION in
 * src/lib/accessAgreement.js when the text changes materially.
 */
export default function AccessAgreement() {
  return (
    <>
      <Helmet>
        <title>Access &amp; Evaluation Agreement · Traigent</title>
        <meta
          name="description"
          content="The Traigent Access & Evaluation Agreement governing access to the Traigent Portal, Academy, and gated materials."
        />
      </Helmet>
      <section className="bg-[#080808] text-white min-h-screen py-14 md:py-20">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Traigent Access &amp; Evaluation Agreement
          </h1>
          <AgreementText />
        </article>
      </section>
    </>
  );
}
