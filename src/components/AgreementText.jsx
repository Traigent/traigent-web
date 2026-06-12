/* eslint-disable react/prop-types */
import { AGREEMENT_VERSION } from "../lib/accessAgreement";

/**
 * The Access & Evaluation Agreement body — single source of truth rendered
 * both by the /access-agreement page and inside the scrollable acceptance
 * boxes on the gates. `compact` shrinks the type for in-modal scroll boxes.
 * Bump AGREEMENT_VERSION in src/lib/accessAgreement.js when this text
 * changes materially — every visitor is re-prompted.
 */
export default function AgreementText({ compact = false }) {
  const h = compact
    ? "text-sm font-bold text-white mt-4 mb-1.5"
    : "text-xl font-bold text-white mt-8 mb-3";
  const p = compact
    ? "text-xs text-slate-300 leading-relaxed mb-2.5"
    : "text-slate-300 leading-relaxed mb-4";
  const ol = compact
    ? "list-decimal list-outside ml-5 space-y-1.5 text-xs text-slate-300 leading-relaxed mb-2.5"
    : "list-decimal list-outside ml-6 space-y-3 text-slate-300 leading-relaxed mb-4";
  const ul = compact
    ? "list-disc list-outside ml-5 space-y-1.5 text-xs text-slate-300 leading-relaxed mb-2.5"
    : "list-disc list-outside ml-6 space-y-2 text-slate-300 leading-relaxed mb-4";

  return (
    <div>
      <p className={`${compact ? "text-[10px]" : "text-sm"} text-slate-500 mb-3 font-mono`}>
        Version {AGREEMENT_VERSION} · Effective upon acceptance · Last updated June 12, 2026
      </p>

      <p className={p}>
        <strong className="text-white">Welcome — and thanks for trying Traigent.</strong>
      </p>
      <p className={p}>
        <strong className="text-white">Why You have access.</strong> Traigent automatically finds
        the configuration that makes AI agents perform at their best — higher accuracy at lower
        cost. The best way to understand that value is to experience it first-hand, and that is
        exactly why we&apos;re giving You this access: install the SDK on Your computer, run it on
        Your own use cases, explore the Portal, and take the Academy courses.
      </p>
      <p className={p}>
        <strong className="text-white">What we encourage You to do:</strong>
      </p>
      <ul className={ul}>
        <li>
          <strong className="text-white">Use it for real.</strong> Install and run the Traigent
          SDK on Your own computer and evaluate it on Your actual work — including for potential
          use by Your team or employer.
        </li>
        <li>
          <strong className="text-white">Show it to others.</strong> Demonstrate Traigent live to
          Your colleagues, team, and management, and share the outputs and results it delivers —
          screenshots, recordings, result summaries. We want You to.
        </li>
        <li>
          <strong className="text-white">Learn and ask.</strong> Take the Academy courses, explore
          the Portal, and bring any question straight to{" "}
          <a href="mailto:amir@traigent.ai" className="text-blue-300 underline underline-offset-2">
            amir@traigent.ai
          </a>
          .
        </li>
      </ul>
      <p className={p}>
        <strong className="text-white">The one thing we ask: Your access is personal.</strong>{" "}
        Don&apos;t pass the SDK, Your credentials, or non-public materials on to anyone else —
        colleagues who want hands-on access can register themselves in seconds. And please
        don&apos;t reverse-engineer the SDK or use it to build something that competes with
        Traigent. That&apos;s the heart of it — the sections below say the same things in legal
        language.
      </p>
      <p className={p}>
        By checking the acceptance box and continuing, you (&quot;<strong className="text-white">You</strong>&quot;)
        agree to these terms with <strong className="text-white">Traigent Ltd.</strong>{" "}
        (&quot;<strong className="text-white">Traigent</strong>&quot;, &quot;we&quot;). You agree
        personally, as an individual — you don&apos;t need authority from your employer, and this
        Agreement doesn&apos;t bind your company.
      </p>

      <h2 className={h}>1. What this covers (&quot;Materials&quot;)</h2>
      <p className={p}>
        &quot;<strong className="text-white">Materials</strong>&quot; means{" "}
        <strong className="text-white">all Traigent intellectual property and information made
        available to You, or to which You become exposed</strong> — including, without limitation:
        the Traigent Portal and its features, outputs, and interfaces; Traigent Academy courses
        and workshop content; demos, videos, slides, documentation, datasets, benchmarks, prompts,
        configuration spaces, evaluation methodologies, and quickstart resources; access links,
        credentials, and access codes; <strong className="text-white">any other aspect of
        Traigent&apos;s products, services, or technology that You access or observe</strong>; and
        any non-public information disclosed to You.
      </p>
      <p className={p}>
        <strong className="text-white">Open-source note.</strong> If You separately obtain SDK
        components from Traigent&apos;s public repositories under their open-source license, that
        copy is governed by that license. Everything provided to You under this Agreement —
        including the SDK as made available to You through Start Now — is governed by this
        Agreement, including the SDK terms in Section 2.
      </p>

      <h2 className={h}>2. Your license — what You may do</h2>
      <p className={p}>
        Traigent grants You a <strong className="text-white">limited, personal, non-exclusive,
        non-transferable, revocable</strong> right to (a){" "}
        <strong className="text-white">install and use the Traigent SDK on a single personal
        computer under Your sole control — Your own PC only</strong>, (b) access and use the other
        Materials to evaluate Traigent&apos;s products and services — including evaluating them
        for potential use by Your team or employer — and (c) Your own learning through Traigent
        Academy, in each case operated by You alone. Your access may not be
        shared with or transferred to anyone else; the SDK may not be
        copied, installed, or transferred onto any other computer; and the Materials may not be
        placed on shared, public, or third-party systems. No other rights are granted. All right,
        title, and interest in the Materials — including all intellectual-property rights —
        remain exclusively with Traigent. You acknowledge the Materials embody Traigent&apos;s
        valuable proprietary technology and trade secrets.
      </p>
      <p className={p}>
        <strong className="text-white">What You MAY share — encouraged.</strong> Showing Your
        colleagues, team, and management what Traigent can do is exactly what we hope You&apos;ll
        do. You may demonstrate the SDK in operation and share the demonstrations, outputs, and
        results that Traigent delivers (including screenshots, recordings, and result summaries) —
        just don&apos;t share the SDK itself, Your access credentials or codes, or any non-public
        Materials (and see Section 3.6 for formal published benchmarks). Colleagues who want
        hands-on access can register themselves in seconds.
      </p>

      <h2 className={h}>3. What You agree not to do</h2>
      <p className={p}>
        Except as expressly permitted in Section 2 or by an applicable open-source license, You
        will not, and will not permit anyone else to:
      </p>
      <ol className={ol}>
        <li>
          <strong className="text-white">Share or disclose</strong> the Materials, access links,
          credentials, or access codes with or to <strong className="text-white">anyone
          else</strong> — colleagues, employers, or any third party (access is strictly
          individual; each person must register and accept this Agreement themselves);
        </li>
        <li>
          <strong className="text-white">Copy, republish, redistribute, or transfer</strong> the
          Materials, in whole or part, in any medium — including{" "}
          <strong className="text-white">installing, copying, or distributing the SDK or any
          derivative of it onto any other computer</strong> or making it available to anyone else;
        </li>
        <li>
          <strong className="text-white">Reverse engineer, decompile, or disassemble</strong> any
          software, service, or model made available to You under this Agreement —{" "}
          <strong className="text-white">including the Traigent SDK as provided to You</strong> —
          or attempt to derive its source code, architecture, prompts, weights, scoring logic, or
          underlying methods, except to the extent this restriction is prohibited by applicable
          law;
        </li>
        <li>
          <strong className="text-white">Build, train, or improve a competing product or
          service</strong> using the Materials (<strong className="text-white">including the
          SDK</strong>) — including, without limitation, by (i) using the Materials as
          specifications, prompts, context, or reference for any software development, (ii){" "}
          <strong className="text-white">providing any Materials to an AI system, LLM, or coding
          assistant</strong> to generate, assist, or accelerate the development of functionality
          that competes with Traigent, or (iii) using the Materials to train, fine-tune, or
          evaluate any machine-learning model — nor distribute any such derivative work to any
          other computer or person;
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

      <h2 className={h}>4. Confidentiality</h2>
      <p className={p}>
        Materials that are not publicly available are Traigent&apos;s{" "}
        <strong className="text-white">Confidential Information</strong>. You will protect them
        with at least the care You use for Your own confidential information (and no less than
        reasonable care), use them only as permitted here, and{" "}
        <strong className="text-white">not disclose them to anyone</strong>. These obligations
        continue for five (5) years from disclosure; for trade secrets, for as long as they
        remain trade secrets.
      </p>

      <h2 className={h}>5. Access codes and accounts</h2>
      <p className={p}>
        Access codes and links are generated for, and personal to, the business email You
        register, and may be used <strong className="text-white">only by You, on Your own
        computer</strong>. You are responsible for activity under Your access. Traigent may
        revoke, suspend, or condition access at any time, with or without notice, including for
        suspected breach.
      </p>

      <h2 className={h}>6. Feedback</h2>
      <p className={p}>
        If You give Traigent feedback, suggestions, or ideas, Traigent may use them freely and
        without obligation; You grant Traigent a perpetual, irrevocable, royalty-free license to
        do so.
      </p>

      <h2 className={h}>7. No warranty</h2>
      <p className={p}>
        The Materials are provided &quot;<strong className="text-white">AS IS</strong>&quot; for
        evaluation and education. Traigent disclaims all warranties, express or implied, including
        merchantability, fitness for a particular purpose, and non-infringement. The Materials may
        change or be withdrawn at any time.
      </p>

      <h2 className={h}>8. Remedies; liability</h2>
      <p className={p}>
        You acknowledge that breach of Sections 3–5 would cause Traigent{" "}
        <strong className="text-white">irreparable harm</strong> for which damages are inadequate,
        and that Traigent is entitled to <strong className="text-white">injunctive relief</strong>{" "}
        (without posting bond) in addition to all other remedies. Except for Your breach of
        Sections 3–5 or liability that cannot be limited by law, neither party&apos;s aggregate
        liability under this Agreement will exceed US $1,000, and neither party is liable for
        indirect, incidental, special, or consequential damages.
      </p>

      <h2 className={h}>9. Term; survival</h2>
      <p className={p}>
        This Agreement applies from Your acceptance and continues until terminated by either party
        (You, by ceasing all access and deleting retained Materials; Traigent, by notice or access
        revocation). Sections 3, 4, 6, 7, 8, 10, and 11 survive termination.
      </p>

      <h2 className={h}>10. Governing law; disputes</h2>
      <p className={p}>
        This Agreement is governed by the laws of the State of Israel, without regard to
        conflict-of-law rules, and the courts of Tel Aviv have exclusive jurisdiction.
      </p>

      <h2 className={h}>11. General</h2>
      <p className={p}>
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
      </p>
    </div>
  );
}
