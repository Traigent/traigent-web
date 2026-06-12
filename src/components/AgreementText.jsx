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

  return (
    <div>
      <p className={`${compact ? "text-[10px]" : "text-sm"} text-slate-500 mb-3 font-mono`}>
        Version {AGREEMENT_VERSION} · Effective upon acceptance · Last updated June 13, 2026
      </p>

      <p className={p}>
        <strong className="text-white">IMPORTANT — READ BEFORE PROCEEDING.</strong>{" "}
        By checking the acceptance box and continuing, you (&quot;<strong className="text-white">You</strong>&quot;)
        enter into this binding agreement with <strong className="text-white">Traigent Ltd.</strong>{" "}
        (&quot;<strong className="text-white">Traigent</strong>&quot;, &quot;we&quot;). If you are accessing on
        behalf of a company, you represent that you are authorized to bind that company, and
        &quot;You&quot; includes it. If you do not agree, do not proceed.
      </p>

      <h2 className={h}>1. What this covers (&quot;Materials&quot;)</h2>
      <p className={p}>
        &quot;<strong className="text-white">Materials</strong>&quot; means everything Traigent makes
        available through its gated surfaces: the Traigent Portal and its features, outputs, and
        interfaces; Traigent Academy courses and workshop content; demos, videos, slides,
        documentation, datasets, benchmarks, prompts, configuration spaces, evaluation
        methodologies, and quickstart resources; access links, credentials, and access codes; and
        any non-public information disclosed to You.
      </p>
      <p className={p}>
        <strong className="text-white">Open-source carve-out.</strong> Components of the Traigent
        SDK published under an open-source license (e.g., AGPL-3.0) are governed solely by that
        license, and nothing in this Agreement limits the rights that license grants You for those
        components. This Agreement governs everything else.
      </p>

      <h2 className={h}>2. Your license</h2>
      <p className={p}>
        Traigent grants You a <strong className="text-white">limited, personal, non-exclusive,
        non-transferable, revocable</strong> right to access and use the Materials solely for
        (a) evaluating Traigent&apos;s products and services for Your internal business purposes,
        and (b) Your own learning through Traigent Academy. No other rights are granted. All
        right, title, and interest in the Materials — including all intellectual-property rights —
        remain exclusively with Traigent. You acknowledge the Materials embody Traigent&apos;s
        valuable proprietary technology and trade secrets.
      </p>

      <h2 className={h}>3. What You agree not to do</h2>
      <p className={p}>
        Except as expressly permitted in Section 2 or by an applicable open-source license, You
        will not, and will not permit anyone else to:
      </p>
      <ol className={ol}>
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

      <h2 className={h}>4. Confidentiality</h2>
      <p className={p}>
        Materials that are not publicly available are Traigent&apos;s{" "}
        <strong className="text-white">Confidential Information</strong>. You will protect them
        with at least the care You use for Your own confidential information (and no less than
        reasonable care), use them only as permitted here, and not disclose them to anyone except
        Your employees or advisors who need them for the permitted purpose and are bound by
        obligations at least as protective. These obligations continue for five (5) years from
        disclosure; for trade secrets, for as long as they remain trade secrets.
      </p>

      <h2 className={h}>5. Access codes and accounts</h2>
      <p className={p}>
        Access codes and links are generated for, and personal to, the business email You
        register. You are responsible for activity under Your access. Traigent may revoke,
        suspend, or condition access at any time, with or without notice, including for suspected
        breach.
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
