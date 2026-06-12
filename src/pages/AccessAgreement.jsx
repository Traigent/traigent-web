import { Helmet } from "react-helmet-async";
import { AGREEMENT_VERSION } from "../lib/accessAgreement";

/**
 * The Access & Evaluation Agreement — the click-through IP/confidentiality
 * agreement accepted on every gated surface (Start Now / SDK, Portal,
 * Academy). The gates link here; acceptance is recorded per contact with
 * version + timestamp. Bump AGREEMENT_VERSION in src/lib/accessAgreement.js
 * when this text changes materially — every visitor is re-prompted.
 */

const H2 = ({ children }) => (
  <h2 className="text-xl font-bold text-white mt-8 mb-3">{children}</h2>
);
const P = ({ children }) => (
  <p className="text-slate-300 leading-relaxed mb-4">{children}</p>
);

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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Traigent Access &amp; Evaluation Agreement
          </h1>
          <p className="text-sm text-slate-500 mb-8 font-mono">
            Version {AGREEMENT_VERSION} · Effective upon acceptance · Last updated June 13, 2026
          </p>

          <P>
            <strong className="text-white">IMPORTANT — READ BEFORE PROCEEDING.</strong>{" "}
            By checking the acceptance box and continuing, you (&quot;<strong className="text-white">You</strong>&quot;)
            enter into this binding agreement with <strong className="text-white">Traigent Ltd.</strong>{" "}
            (&quot;<strong className="text-white">Traigent</strong>&quot;, &quot;we&quot;). If you are accessing on
            behalf of a company, you represent that you are authorized to bind that company, and
            &quot;You&quot; includes it. If you do not agree, do not proceed.
          </P>

          <H2>1. What this covers (&quot;Materials&quot;)</H2>
          <P>
            &quot;<strong className="text-white">Materials</strong>&quot; means everything Traigent makes
            available through its gated surfaces: the Traigent Portal and its features, outputs, and
            interfaces; Traigent Academy courses and workshop content; demos, videos, slides,
            documentation, datasets, benchmarks, prompts, configuration spaces, evaluation
            methodologies, and quickstart resources; access links, credentials, and access codes; and
            any non-public information disclosed to You.
          </P>
          <P>
            <strong className="text-white">Open-source carve-out.</strong> Components of the Traigent
            SDK published under an open-source license (e.g., AGPL-3.0) are governed solely by that
            license, and nothing in this Agreement limits the rights that license grants You for those
            components. This Agreement governs everything else.
          </P>

          <H2>2. Your license</H2>
          <P>
            Traigent grants You a <strong className="text-white">limited, personal, non-exclusive,
            non-transferable, revocable</strong> right to access and use the Materials solely for
            (a) evaluating Traigent&apos;s products and services for Your internal business purposes,
            and (b) Your own learning through Traigent Academy. No other rights are granted. All
            right, title, and interest in the Materials — including all intellectual-property rights —
            remain exclusively with Traigent. You acknowledge the Materials embody Traigent&apos;s
            valuable proprietary technology and trade secrets.
          </P>

          <H2>3. What You agree not to do</H2>
          <P>
            Except as expressly permitted in Section 2 or by an applicable open-source license, You
            will not, and will not permit anyone else to:
          </P>
          <ol className="list-decimal list-outside ml-6 space-y-3 text-slate-300 leading-relaxed mb-4">
            <li>
              <strong className="text-white">Share or disclose</strong> the Materials, access links,
              credentials, or access codes with or to any third party (access is individual;
              colleagues should register themselves);
            </li>
            <li>
              <strong className="text-white">Copy, republish, or redistribute</strong> the Materials,
              in whole or part, in any medium;
            </li>
            <li>
              <strong className="text-white">Reverse engineer, decompile, or disassemble</strong> any
              non-open-source software, service, or model made available to You, or attempt to derive
              its source code, architecture, prompts, weights, scoring logic, or underlying methods,
              except to the extent this restriction is prohibited by applicable law;
            </li>
            <li>
              <strong className="text-white">Build, train, or improve a competing product or
              service</strong> using the Materials — including, without limitation, by (i) using the
              Materials as specifications, prompts, context, or reference for any software
              development, (ii) <strong className="text-white">providing any Materials to an AI
              system, LLM, or coding assistant</strong> to generate, assist, or accelerate the
              development of functionality that competes with Traigent, or (iii) using the Materials
              to train, fine-tune, or evaluate any machine-learning model;
            </li>
            <li>
              <strong className="text-white">Scrape, crawl, or systematically extract</strong> content
              or data from the Portal, Academy, or any gated surface, whether manually or by automated
              means;
            </li>
            <li>
              <strong className="text-white">Benchmark or publish performance comparisons</strong> of
              the Portal or Traigent services without Traigent&apos;s prior written consent;
            </li>
            <li>
              <strong className="text-white">Circumvent</strong> any access control, gate, code, or
              technical protection, or access another user&apos;s account or materials;
            </li>
            <li>
              <strong className="text-white">Misrepresent</strong> Your identity, employer, or email
              address when registering for access.
            </li>
          </ol>

          <H2>4. Confidentiality</H2>
          <P>
            Materials that are not publicly available are Traigent&apos;s{" "}
            <strong className="text-white">Confidential Information</strong>. You will protect them
            with at least the care You use for Your own confidential information (and no less than
            reasonable care), use them only as permitted here, and not disclose them to anyone except
            Your employees or advisors who need them for the permitted purpose and are bound by
            obligations at least as protective. These obligations continue for five (5) years from
            disclosure; for trade secrets, for as long as they remain trade secrets.
          </P>

          <H2>5. Access codes and accounts</H2>
          <P>
            Access codes and links are generated for, and personal to, the business email You
            register. You are responsible for activity under Your access. Traigent may revoke,
            suspend, or condition access at any time, with or without notice, including for suspected
            breach.
          </P>

          <H2>6. Feedback</H2>
          <P>
            If You give Traigent feedback, suggestions, or ideas, Traigent may use them freely and
            without obligation; You grant Traigent a perpetual, irrevocable, royalty-free license to
            do so.
          </P>

          <H2>7. No warranty</H2>
          <P>
            The Materials are provided &quot;<strong className="text-white">AS IS</strong>&quot; for
            evaluation and education. Traigent disclaims all warranties, express or implied, including
            merchantability, fitness for a particular purpose, and non-infringement. The Materials may
            change or be withdrawn at any time.
          </P>

          <H2>8. Remedies; liability</H2>
          <P>
            You acknowledge that breach of Sections 3–5 would cause Traigent{" "}
            <strong className="text-white">irreparable harm</strong> for which damages are inadequate,
            and that Traigent is entitled to <strong className="text-white">injunctive relief</strong>{" "}
            (without posting bond) in addition to all other remedies. Except for Your breach of
            Sections 3–5 or liability that cannot be limited by law, neither party&apos;s aggregate
            liability under this Agreement will exceed US $1,000, and neither party is liable for
            indirect, incidental, special, or consequential damages.
          </P>

          <H2>9. Term; survival</H2>
          <P>
            This Agreement applies from Your acceptance and continues until terminated by either party
            (You, by ceasing all access and deleting retained Materials; Traigent, by notice or access
            revocation). Sections 3, 4, 6, 7, 8, 10, and 11 survive termination.
          </P>

          <H2>10. Governing law; disputes</H2>
          <P>
            This Agreement is governed by the laws of the State of Israel, without regard to
            conflict-of-law rules, and the courts of Tel Aviv have exclusive jurisdiction.
          </P>

          <H2>11. General</H2>
          <P>
            This is the entire agreement regarding gated access and supersedes prior discussions on
            that subject; it does not replace any separately signed agreement between You and Traigent
            (which prevails if conflicting). Traigent may update this Agreement prospectively by
            presenting a new version for acceptance; the version You accepted governs the access made
            under it. You may not assign this Agreement. If a provision is unenforceable, the
            remainder stands. Notices to Traigent:{" "}
            <a href="mailto:amir@traigent.ai" className="text-blue-300 underline underline-offset-2">
              amir@traigent.ai
            </a>
            .
          </P>
        </article>
      </section>
    </>
  );
}
