import { useEffect, useMemo } from "react";
import LogomarkBadge from "../components/LogomarkBadge";
import "./HumanX2026Deck.css";

const BASE_URL = import.meta.env.BASE_URL;
const LOGOMARK_BASE = `${BASE_URL}images/logomarks`;

function classNames(...values) {
  return values.filter(Boolean).join(" ");
}

function DeckToolbar() {
  return (
    <div className="deck-toolbar" data-nosnippet>
      <div className="deck-toolbar__inner">
        <div className="deck-toolbar__brand">
          <img
            src={`${BASE_URL}images/traigent-logo-icon.png`}
            alt="Traigent"
            className="deck-toolbar__logo"
            loading="eager"
            decoding="async"
          />
          <div>
            <div className="deck-toolbar__title">HumanX 2026 Deck</div>
            <div className="deck-toolbar__hint">
              Export via browser print → Save as PDF (landscape)
            </div>
          </div>
        </div>
        <button type="button" className="deck-toolbar__button" onClick={() => window.print()}>
          Export to PDF
        </button>
      </div>
    </div>
  );
}

function SlideFrame({ title, kicker = "", footerRight = null, children, slideNumber, totalSlides }) {
  return (
    <section className="deck-slide" aria-label={title}>
      <header className="deck-slide__header">
        <div className="deck-slide__headerLeft">
          <img
            src={`${BASE_URL}images/traigent-logo-icon.png`}
            alt="Traigent"
            className="deck-slide__logo"
            loading="eager"
            decoding="async"
          />
          <div>
            {kicker ? <div className="deck-slide__kicker">{kicker}</div> : null}
            <h1 className="deck-slide__title">{title}</h1>
          </div>
        </div>
        <div className="deck-slide__headerRight">
          <div className="deck-slide__meta">HumanX 2026</div>
          <div className="deck-slide__meta">
            {slideNumber}/{totalSlides}
          </div>
        </div>
      </header>

      <div className="deck-slide__body">{children}</div>

      <footer className="deck-slide__footer">
        <div className="deck-slide__footerLeft">
          <span className="deck-slide__footerDot" aria-hidden="true" />
          <span>traigent.ai</span>
        </div>
        <div className="deck-slide__footerRight">{footerRight}</div>
      </footer>
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="deck-metric">
      <div className="deck-metric__value">{value}</div>
      <div className="deck-metric__label">{label}</div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="deck-card">
      <div className="deck-card__title">{title}</div>
      <div className="deck-card__body">{children}</div>
    </div>
  );
}

function BadgeRow({ items }) {
  return (
    <div className="deck-badges">
      {items.map((item) => (
        <LogomarkBadge key={`${item.label}-${item.mark}`} {...item} />
      ))}
    </div>
  );
}

export default function HumanX2026Deck() {
  useEffect(() => {
    document.title = "Traigent — HumanX 2026 Deck";
  }, []);

  const badges = useMemo(
    () => ({
      nvidia: {
        mark: "NV",
        label: "NVIDIA Inception",
        tone: "emerald",
        logoSrc: `${LOGOMARK_BASE}/nvidia.svg`,
      },
      ieee: {
        mark: "IEEE",
        label: "IEEE Computer Society",
        tone: "indigo",
        logoSrc: `${LOGOMARK_BASE}/ieee.svg`,
      },
      acm: {
        mark: "ACM",
        label: "ACM / SIGSOFT",
        tone: "cyan",
        logoSrc: `${LOGOMARK_BASE}/acm.svg`,
      },
      icse: {
        mark: "ICSE",
        label: "ICSE ’25",
        tone: "indigo",
        logoSrc: `${LOGOMARK_BASE}/ieee.svg`,
      },
      cain: {
        mark: "CAIN",
        label: "CAIN ’26 (TVL)",
        tone: "violet",
        logoSrc: `${LOGOMARK_BASE}/ieee.svg`,
      },
      ibm: {
        mark: "IBM",
        label: "IBM Research",
        tone: "slate",
      },
      accenture: {
        mark: "ACN",
        label: "Accenture Labs",
        tone: "slate",
      },
    }),
    []
  );

  const totalSlides = 9;

  return (
    <div className="deck-root">
      <DeckToolbar />

      <div className="deck-container">
        <SlideFrame
          title="Traigent"
          kicker="The optimization layer for reliable AI agents"
          slideNumber={1}
          totalSlides={totalSlides}
          footerRight={<BadgeRow items={[badges.nvidia, badges.ieee, badges.acm]} />}
        >
          <div className="deck-grid deck-grid--two">
            <div className="deck-lead">
              <p className="deck-lead__text">
                AI agents turn software from deterministic systems into statistical systems.
                Traigent helps teams improve agent behavior across <strong>quality</strong>,{" "}
                <strong>cost</strong>, <strong>latency</strong>, and <strong>governance</strong>.
              </p>
              <div className="deck-inlineNote">
                <div>
                  <div className="deck-inlineNote__k">Paradigm</div>
                  <div className="deck-inlineNote__v">Statistical Software Engineering</div>
                </div>
                <div>
                  <div className="deck-inlineNote__k">Foundations</div>
                  <div className="deck-inlineNote__v">TVL for agent ops • OPAL for agentic systems</div>
                </div>
                <div>
                  <div className="deck-inlineNote__k">Platform</div>
                  <div className="deck-inlineNote__v">Developer-first agent tuning infrastructure</div>
                </div>
              </div>
            </div>

            <div className="deck-metrics">
              <Metric label="Design partners" value="4" />
              <Metric label="Peer-reviewed" value="ICSE ’25" />
              <Metric label="Accepted" value="CAIN ’26" />
              <Metric label="Program" value="NVIDIA Inception" />
            </div>
          </div>
        </SlideFrame>

        <SlideFrame
          title="AI agents change what software engineering is"
          kicker="Paradigm shift"
          slideNumber={2}
          totalSlides={totalSlides}
          footerRight={<BadgeRow items={[badges.icse, badges.cain, badges.nvidia]} />}
        >
          <p className="deck-sublead">
            Traigent starts from a deeper thesis than “better prompts” or “more observability.”
          </p>

          <div className="deck-grid deck-grid--two">
            <Card title="Traditional software">
              <ul className="deck-list">
                <li>Behavior is specified directly in code</li>
                <li>Outputs are expected to be deterministic</li>
                <li>Correctness comes primarily from implementation and testing</li>
                <li>Mature engineering methods already exist</li>
              </ul>
            </Card>
            <Card title="Agentic software">
              <ul className="deck-list">
                <li>Behavior emerges from prompts, models, tools, memory, and workflows</li>
                <li>Outputs are statistical, not fully predictable</li>
                <li>Reliability depends on evaluation, tuning, and governance</li>
                <li>New engineering methods are required to build trust at scale</li>
              </ul>
            </Card>
          </div>

          <div className="deck-footerCallout">
            This is the shift from software engineering to <strong>Statistical Software Engineering</strong>.
          </div>
        </SlideFrame>

        <SlideFrame
          title="Today, teams still build agents by trial and error"
          kicker="Problem"
          slideNumber={3}
          totalSlides={totalSlides}
          footerRight={<BadgeRow items={[badges.ibm, badges.accenture, badges.nvidia]} />}
        >
          <p className="deck-sublead">
            That works for demos. It breaks under real business goals, real complexity, and real scale.
          </p>
          <div className="deck-grid deck-grid--three">
            <Card title="Fragile quality">
              <ul className="deck-list">
                <li>Agent behavior shifts across prompts, models, tools, and workflows</li>
                <li>Teams struggle to trust output quality, safety, and consistency</li>
                <li>More experimentation does not necessarily produce more confidence</li>
              </ul>
            </Card>
            <Card title="Slow iteration">
              <ul className="deck-list">
                <li>Optimization is still manual, local, and engineer-intensive</li>
                <li>Most tuning attempts do not systematically improve results</li>
                <li>Teams burn weeks searching for better configurations</li>
              </ul>
            </Card>
            <Card title="Misaligned economics">
              <ul className="deck-list">
                <li>Better quality often comes with higher cost or latency</li>
                <li>Teams lack a structured way to optimize for business objectives</li>
                <li>Measurement exists; systematic improvement does not</li>
              </ul>
            </Card>
          </div>
          <div className="deck-footerCallout">
            The problem is no longer generating an answer. It is engineering the right agent behavior —{" "}
            <strong>reliably, efficiently, and in line with business goals</strong>.
          </div>
        </SlideFrame>

        <SlideFrame
          title="How Traigent works"
          kicker="Workflow"
          slideNumber={4}
          totalSlides={totalSlides}
          footerRight={<BadgeRow items={[badges.ieee, badges.acm]} />}
        >
          <p className="deck-sublead">
            Traigent turns agent optimization from trial-and-error into a measurable engineering workflow.
          </p>
          <div className="deck-grid deck-grid--three">
            <Card title="1) Input the agent system">
              <ul className="deck-list">
                <li>Prompts</li>
                <li>Models</li>
                <li>Parameters</li>
                <li>Tools</li>
                <li>Workflows</li>
                <li>Evaluation data</li>
              </ul>
            </Card>
            <Card title="2) Optimize against business goals">
              <ul className="deck-list">
                <li>Explore configuration alternatives</li>
                <li>Evaluate trade-offs across quality, cost, latency, and safety</li>
                <li>Search for better-performing configurations automatically</li>
              </ul>
            </Card>
            <Card title="3) Deploy with confidence">
              <ul className="deck-list">
                <li>Recommended configurations backed by evidence</li>
                <li>Clear before/after performance deltas</li>
                <li>Continuous tuning and governance as the system evolves</li>
              </ul>
            </Card>
          </div>
          <div className="deck-footerCallout">
            Others help teams observe or evaluate agents. <strong>Traigent helps them improve them.</strong>
          </div>
        </SlideFrame>

        <SlideFrame
          title="Example: optimizing a production agent"
          kicker="Use case"
          slideNumber={5}
          totalSlides={totalSlides}
          footerRight={<BadgeRow items={[badges.nvidia, badges.icse]} />}
        >
          <p className="deck-sublead">One workflow. Multiple trade-offs. A measurable before-and-after.</p>
          <div className="deck-grid deck-grid--three">
            <Card title="Before">
              <ul className="deck-list">
                <li>Expensive default model choice</li>
                <li>Slow response times</li>
                <li>Inconsistent answers across cases</li>
                <li>Manual iteration by engineers</li>
              </ul>
            </Card>
            <Card title="Traigent">
              <ul className="deck-list">
                <li>Explores alternatives across prompt, model, parameters, tools, and workflow</li>
                <li>Evaluates trade-offs against a fixed evaluation set and business goals</li>
                <li>Recommends better-performing configurations</li>
              </ul>
            </Card>
            <Card title="After">
              <ul className="deck-list">
                <li>Better answer quality</li>
                <li>Lower latency</li>
                <li>Lower cost</li>
                <li>More confidence in deployment decisions</li>
              </ul>
            </Card>
          </div>
        </SlideFrame>

        <SlideFrame
          title="Traigent is building the Agent Tuning Platform"
          kicker="Platform"
          slideNumber={6}
          totalSlides={totalSlides}
          footerRight={<BadgeRow items={[badges.cain, badges.nvidia]} />}
        >
          <p className="deck-sublead">
            A first-of-a-kind platform to evaluate, tune, and govern agentic systems as engineering systems.
          </p>
          <div className="deck-grid deck-grid--two">
            <Card title="Developer-first integration">
              <pre className="deck-code">
                <code>{`@tune(goal={"quality": 0.55, "cost": 0.20, "latency": 0.25})\n` +
                  `def agent(user_request):\n` +
                  `    return planner.run(user_request)`}</code>
              </pre>
              <div className="deck-card__note">Minimal integration. Business-goal-aware tuning.</div>
            </Card>
            <Card title="Optimization engine">
              <ul className="deck-list">
                <li>Searches across prompts, models, parameters, tools, and workflows</li>
                <li>Evaluates alternatives against business objectives</li>
                <li>Finds better-performing configurations systematically instead of ad hoc</li>
              </ul>
              <div className="deck-divider" />
              <div className="deck-results">
                <div className="deck-results__k">Early benchmark results show up to</div>
                <div className="deck-results__v">+20% quality uplift • 4.5× latency reduction • 40× cost savings</div>
              </div>
            </Card>
          </div>
          <div className="deck-footerCallout">
            Built on the foundations of Statistical Software Engineering: TVL, OPAL, and agent tuning infrastructure.
          </div>
        </SlideFrame>

        <SlideFrame
          title="Early proof that the category resonates"
          kicker="Proof"
          slideNumber={7}
          totalSlides={totalSlides}
          footerRight={<BadgeRow items={[badges.icse, badges.cain, badges.nvidia]} />}
        >
          <p className="deck-sublead">
            We are seeing validation across research, ecosystem credibility, and enterprise interest.
          </p>
          <div className="deck-grid deck-grid--two">
            <div className="deck-rail">
              <div className="deck-rail__title">Signals</div>
              <div className="deck-rail__items">
                <div className="deck-rail__item">
                  <span className="deck-rail__big">4</span>
                  <span className="deck-rail__small">active design partners</span>
                </div>
                <div className="deck-rail__item">
                  <span className="deck-rail__big">ICSE ’25</span>
                  <span className="deck-rail__small">peer-reviewed research</span>
                </div>
                <div className="deck-rail__item">
                  <span className="deck-rail__big">CAIN ’26</span>
                  <span className="deck-rail__small">TVL presented</span>
                </div>
                <div className="deck-rail__item">
                  <span className="deck-rail__big">NVIDIA</span>
                  <span className="deck-rail__small">Inception member</span>
                </div>
              </div>
            </div>

            <div className="deck-grid deck-grid--two" style={{ gap: 16 }}>
              <Card title="Validated by research">
                <ul className="deck-list">
                  <li>Peer-reviewed work at top-tier software engineering venues</li>
                  <li>Positioning agent tuning as a real engineering discipline</li>
                </ul>
                <div className="deck-badgeStack">
                  <LogomarkBadge {...badges.ieee} />
                  <LogomarkBadge {...badges.acm} />
                </div>
              </Card>
              <Card title="Pulled by real buyers">
                <ul className="deck-list">
                  <li>Design partners validating the need for systematic optimization</li>
                  <li>Strong interest from teams facing agent quality, cost, and latency trade-offs</li>
                </ul>
                <div className="deck-badgeStack">
                  <LogomarkBadge {...badges.nvidia} />
                </div>
              </Card>
            </div>
          </div>
        </SlideFrame>

        <SlideFrame
          title="A team built for the paradigm shift"
          kicker="Team"
          slideNumber={8}
          totalSlides={totalSlides}
          footerRight={<BadgeRow items={[badges.ibm, badges.accenture, badges.nvidia]} />}
        >
          <p className="deck-sublead">
            Traigent combines frontier AI research, software engineering depth, and production infrastructure experience.
          </p>
          <div className="deck-grid deck-grid--two">
            <Card title="Dr. Nimrod Busany — Founder & CTO">
              <ul className="deck-list">
                <li>15+ years across applied AI, software engineering, and research leadership</li>
                <li>Experience spanning IBM Research–Israel and Accenture Labs</li>
                <li>Publications, patents, and top-tier conference presence</li>
              </ul>
            </Card>
            <Card title="Achi Solomon — Co-founder & CEO">
              <ul className="deck-list">
                <li>15+ years building global infrastructure and engineering systems</li>
                <li>Deep experience across backend, DevOps, cloud platforms, and developer infrastructure</li>
              </ul>
            </Card>
          </div>
          <div className="deck-footerCallout">
            This is not a generic AI startup story. It is founder-market fit around a deep shift in the nature of software.
          </div>
        </SlideFrame>

        <SlideFrame
          title="Why HumanX"
          kicker="Why now"
          slideNumber={9}
          totalSlides={totalSlides}
          footerRight={<BadgeRow items={[badges.icse, badges.cain, badges.nvidia]} />}
        >
          <p className="deck-sublead">
            We want to meet the people shaping enterprise AI adoption — and the future of agent development.
          </p>
          <div className="deck-grid deck-grid--three">
            <Card title="Who we want to meet">
              <ul className="deck-list">
                <li>Enterprise AI and platform leaders deploying production agents</li>
                <li>Design partners with real reliability, cost, and latency constraints</li>
                <li>Strategic investors and ecosystem partners aligned with category creation</li>
              </ul>
            </Card>
            <Card title="What we bring">
              <ul className="deck-list">
                <li>A new engineering thesis for the age of AI agents</li>
                <li>Foundational innovations: TVL, OPAL, and agent tuning infrastructure</li>
                <li>The missing optimization layer between evaluation and reliable deployment</li>
              </ul>
            </Card>
            <Card title="What success looks like">
              <ul className="deck-list">
                <li>5–10 high-quality conversations with buyers, design partners, and aligned investors</li>
                <li>Feedback from teams facing real deployment trade-offs</li>
                <li>Relationships that accelerate category definition and early market pull</li>
              </ul>
            </Card>
          </div>
          <div className="deck-contact">
            <div className="deck-contact__k">Contact</div>
            <div className="deck-contact__v">Nimrod Busany • nimrod@traigent.ai • traigent.ai</div>
          </div>
          <div className="deck-footerCallout">
            <strong>Trust your AI agent at scale.</strong>
          </div>
        </SlideFrame>
      </div>
    </div>
  );
}
