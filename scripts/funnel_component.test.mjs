import assert from "node:assert/strict";
import test from "node:test";

import { JSDOM } from "jsdom";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { Simulate } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";

const REPOSITORY_ROOT = new URL("..", import.meta.url).pathname;

// Node 21+ exposes some web globals — `navigator` in particular — as
// getter-only accessors, so a plain `globalThis.x = …` assignment throws
// "Cannot set property x of #<Object> which has only a getter". defineProperty
// installs an own data property that shadows the accessor, and behaves the same
// on versions where the global does not exist at all. This test must pass on
// both runtimes: the pull-request gate runs Node 20 and the Pages deploy runs
// Node 22, and only the deploy was failing.
function installGlobal(name, value) {
  Object.defineProperty(globalThis, name, {
    value,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}

function installDom() {
  const dom = new JSDOM('<!doctype html><div id="root"></div>', {
    url: "https://traigent.ai/",
  });
  const { window } = dom;

  installGlobal("window", window);
  installGlobal("document", window.document);
  installGlobal("navigator", window.navigator);
  installGlobal("localStorage", window.localStorage);
  installGlobal("sessionStorage", window.sessionStorage);
  installGlobal("HTMLElement", window.HTMLElement);
  installGlobal("Element", window.Element);
  installGlobal("Node", window.Node);
  installGlobal("Event", window.Event);
  installGlobal("CustomEvent", window.CustomEvent);
  installGlobal("MouseEvent", window.MouseEvent);
  installGlobal("getComputedStyle", window.getComputedStyle.bind(window));
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;

  window.matchMedia = () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  });
  window.open = () => null;
  window.scrollTo = () => {};
  window.requestAnimationFrame = (callback) => setTimeout(callback, 0);
  window.cancelAnimationFrame = (timer) => clearTimeout(timer);
  window.navigator.clipboard = { writeText: async () => {} };
  // ReactDOM is imported before JSDOM exists, so React selects its legacy
  // input-event fallback. Supply the two IE hooks that fallback expects when
  // focus moves between controlled inputs during the multi-step journey.
  window.HTMLElement.prototype.attachEvent = () => {};
  window.HTMLElement.prototype.detachEvent = () => {};
  window.localStorage.setItem("traigent_marketing_consent", "true");

  return dom;
}

function buttonWithText(text, index = 0) {
  const matches = [...document.querySelectorAll("button")].filter(
    (button) => button.textContent.trim() === text,
  );
  assert.ok(matches[index], `button ${JSON.stringify(text)}[${index}] exists`);
  return matches[index];
}

async function click(element) {
  await act(async () => {
    element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await Promise.resolve();
  });
}

async function changeInput(input, value) {
  await act(async () => {
    Simulate.change(input, { target: { value } });
  });
}

async function openMobileNavigation() {
  await click(
    document.querySelector('button[aria-label="Open navigation menu"]'),
  );
  const navigation = document.querySelector(
    '[role="dialog"][aria-label="Navigation menu"]',
  );
  assert.ok(navigation, "mobile navigation opens");
  return navigation;
}

function restoreEnvironmentVariable(name, value) {
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}

async function withTopNav({ state, fetchImpl }, callback) {
  const previous = {
    state: process.env.VITE_FUNNEL_STATE,
    apiBase: process.env.VITE_API_BASE_URL,
    ga4: process.env.VITE_GA4_ID,
    fetch: globalThis.fetch,
  };
  process.env.VITE_FUNNEL_STATE = state;
  process.env.VITE_API_BASE_URL = "https://api.example.test";
  process.env.VITE_GA4_ID = "G-COMPONENT-TEST";

  const dom = installDom();
  const analyticsEvents = [];
  window.gtag = (...args) => analyticsEvents.push(args);
  installGlobal("fetch", fetchImpl);
  window.fetch = fetchImpl;

  const vite = await createServer({
    root: REPOSITORY_ROOT,
    appType: "custom",
    logLevel: "silent",
    mode: "test",
    server: { middlewareMode: true },
  });
  let root;
  try {
    const { default: TopNav } = await vite.ssrLoadModule(
      `/src/components/TopNav.jsx?state=${state}`,
    );
    root = createRoot(document.getElementById("root"));
    await act(async () => {
      root.render(
        React.createElement(MemoryRouter, null, React.createElement(TopNav)),
      );
    });
    await callback({ analyticsEvents });
  } finally {
    if (root) {
      await act(async () => root.unmount());
    }
    await vite.close();
    dom.window.close();
    restoreEnvironmentVariable("VITE_FUNNEL_STATE", previous.state);
    restoreEnvironmentVariable("VITE_API_BASE_URL", previous.apiBase);
    restoreEnvironmentVariable("VITE_GA4_ID", previous.ga4);
    installGlobal("fetch", previous.fetch);
  }
}

test("all top-nav entry points use the attributed lead funnel, including dormant and active journeys", async () => {
  await withTopNav(
    {
      state: "dormant",
      fetchImpl: async () => {
        throw new Error("dormant funnel must not fetch");
      },
    },
    async ({ analyticsEvents }) => {
      const entryPoints = [
        {
          location: "topnav",
          prepare: async () => document,
          find: () => buttonWithText("Start Now", 0),
        },
        {
          location: "topnav_github",
          prepare: async () => document,
          find: () =>
            document.querySelector('button[aria-label="Get the SDK (GitHub)"]'),
        },
        {
          location: "topnav_mobile",
          prepare: openMobileNavigation,
          find: (navigation) =>
            [...navigation.querySelectorAll("button")].find(
              (button) => button.textContent.trim() === "Start Now",
            ),
        },
        {
          location: "topnav_mobile_github",
          prepare: openMobileNavigation,
          find: (navigation) =>
            [...navigation.querySelectorAll("button")].find(
              (button) => button.textContent.trim() === "Get the SDK (GitHub)",
            ),
        },
      ];

      for (const { location, prepare, find } of entryPoints) {
        const scope = await prepare();
        const entry = find(scope);
        assert.ok(entry, `${location} entry exists`);
        analyticsEvents.length = 0;
        await click(entry);

        const dialog = document.querySelector(
          'dialog[aria-label="Get started with Traigent"]',
        );
        assert.ok(dialog, `${location} opens a dialog`);
        // Dormant now delivers the product, not a dead end: the first-run prompt
        // to paste into a coding agent, plus the optional advanced-features email
        // capture. (The prompt clones traigent-first-run.)
        assert.match(dialog.textContent, /traigent-first-run/);
        assert.match(
          dialog.textContent,
          /get access to our most advanced features/i,
        );
        assert.doesNotMatch(dialog.textContent, /Book a demo/);
        assert.equal(dialog.querySelector('a[href*="meetings"]'), null);
        assert.deepEqual(analyticsEvents.at(-1), [
          "event",
          "lead_funnel_opened",
          { location },
        ]);

        await click(dialog.querySelector('button[aria-label="Close"]'));
        assert.equal(
          document.querySelector(
            'dialog[aria-label="Get started with Traigent"]',
          ),
          null,
        );
      }
    },
  );

  const requests = [];
  await withTopNav(
    {
      state: "active",
      fetchImpl: async (url, options) => {
        requests.push({ url: String(url), body: JSON.parse(options.body) });
        const verifying = String(url).endsWith("/verify");
        return new Response(
          JSON.stringify(
            verifying
              ? { data: { expires_at: "2026-08-13T12:00:00Z" } }
              : {
                  data: {
                    run_id: "run-component-test",
                    resend_after_seconds: 30,
                  },
                },
          ),
          {
            status: verifying ? 200 : 202,
            headers: { "content-type": "application/json" },
          },
        );
      },
    },
    async ({ analyticsEvents }) => {
      await click(buttonWithText("Start Now", 0));
      const dialog = document.querySelector(
        'dialog[aria-label="Get started with Traigent"]',
      );
      assert.match(dialog.textContent, /Start free — get the SDK/);
      assert.doesNotMatch(dialog.textContent, /first Traigent optimization/);

      await click(dialog.querySelector('input[type="checkbox"]'));
      await changeInput(
        dialog.querySelector('input[aria-label="Work email"]'),
        "dev@example.com",
      );
      await click(buttonWithText("Email me a code"));
      assert.match(dialog.textContent, /Check your email for the code/);

      await changeInput(
        dialog.querySelector('input[aria-label="6-digit verification code"]'),
        "123456",
      );
      await click(buttonWithText("Verify email"));

      assert.match(dialog.textContent, /Email verified/);
      assert.match(
        dialog.textContent,
        /Help me run my first Traigent optimization\./,
      );
      assert.match(
        dialog.textContent,
        /Clone https:\/\/github\.com\/Traigent\/traigent-first-run and follow GUIDE\.md\./,
      );
      // The HubSpot submission comes FIRST and is part of the contract, not
      // incidental traffic. Before activation, DormantView's HubSpot POST was
      // the only thing the front door did, so every homepage lead reached the
      // CRM; the active path has to keep doing it or flipping
      // VITE_FUNNEL_STATE silently ends marketing's lead flow with no error and
      // no log. Asserted as an exact ordered set so a future refactor cannot
      // drop the call without reddening this test.
      const hubspotPath =
        "/submissions/v3/integration/submit/148486827/35384a3e-7386-45b0-924e-84e5d6f637e4";
      assert.deepEqual(
        requests.map(({ url }) => new URL(url).pathname),
        [hubspotPath, "/api/v1/leads", "/api/v1/leads/verify"],
      );
      assert.equal(new URL(requests[0].url).host, "api.hsforms.com");
      assert.equal(
        requests[0].body.fields.find((field) => field.name === "email").value,
        "dev@example.com",
      );
      assert.deepEqual(requests[2].body, {
        email: "dev@example.com",
        run_id: "run-component-test",
        code: "123456",
      });
      assert.deepEqual(
        analyticsEvents
          // The CRM mirror's event is asserted separately, below, by count
          // rather than by position -- see the comment there.
          .filter(([, eventName]) => !eventName.startsWith("lead_hubspot_"))
          .map(([, eventName, properties]) => [eventName, properties]),
        [
          ["lead_funnel_opened", { location: "topnav" }],
          ["lead_capture_submitted", { location: "topnav" }],
          ["lead_verify_submitted", { location: "topnav" }],
          ["lead_verify_succeeded", { location: "topnav" }],
        ],
      );

      // The mirror's event is asserted SEPARATELY, by presence and count rather
      // than by position. Its ordering against lead_capture_submitted is a race
      // between two independent requests: it happens to be deterministic here
      // only because both mocks resolve instantly and the HubSpot path is one
      // microtask shorter (it skips res.json() on success). With real latency
      // the capture normally lands first, so pinning the interleaving would
      // encode an invariant production does not guarantee and would go red on
      // an unrelated change.
      // Asserted as the COMPLETE set of lead_hubspot_* events, not just a count
      // of the success one: filtering the whole prefix out of the ordered
      // comparison above means a `lead_hubspot_failed` firing alongside a
      // success would otherwise be invisible here too.
      const hubspotEvents = analyticsEvents.filter(([, eventName]) =>
        eventName.startsWith("lead_hubspot_"),
      );
      assert.deepEqual(hubspotEvents, [
        ["event", "lead_hubspot_submitted", { location: "topnav" }],
      ]);
    },
  );
});

test("a failing HubSpot mirror never blocks the capture", async () => {
  // The CRM mirror is fire-and-forget by design: HubSpot is a marketing nicety
  // and the funnel is the product path, so an outage, a blocked-domain refusal
  // or an ad-blocker eating the request must not cost the visitor their signup.
  //
  // This is the assertion that makes the "fire-and-forget" claim testable. The
  // happy-path test above proves the call HAPPENS; only this one proves it
  // cannot HURT -- and the two failure modes are different, so both shapes are
  // exercised: a rejected promise (network/ad-blocker) and a 500 (HubSpot down).
  for (const failureMode of ["reject", "server-error"]) {
    const requests = [];
    await withTopNav(
      {
        state: "active",
        fetchImpl: async (url, options) => {
          const target = String(url);
          // Exact host, not a substring: "hsforms.com" can appear anywhere in a
          // URL, so a substring test would also route
          // https://hsforms.com.evil.test/... into the HubSpot branch. The stub
          // decides which failure to inject, so being loose here would let a
          // future mis-targeted request quietly take the HubSpot path and pass.
          if (new URL(target).host === "api.hsforms.com") {
            requests.push({ url: target });
            if (failureMode === "reject") {
              throw new TypeError("Failed to fetch");
            }
            return new Response("upstream boom", { status: 500 });
          }
          requests.push({ url: target, body: JSON.parse(options.body) });
          return new Response(
            JSON.stringify({
              data: { run_id: "run-hubspot-down", resend_after_seconds: 30 },
            }),
            { status: 202, headers: { "content-type": "application/json" } },
          );
        },
      },
      async ({ analyticsEvents }) => {
        await click(buttonWithText("Start Now", 0));
        const dialog = document.querySelector(
          'dialog[aria-label="Get started with Traigent"]',
        );
        await click(dialog.querySelector('input[type="checkbox"]'));
        await changeInput(
          dialog.querySelector('input[aria-label="Work email"]'),
          "dev@example.com",
        );
        await click(buttonWithText("Email me a code"));

        // The visitor still advances to the code step, and sees no error.
        assert.match(dialog.textContent, /Check your email for the code/);
        assert.doesNotMatch(dialog.textContent, /something went wrong/i);

        // ...and the capture genuinely reached the backend rather than being
        // skipped along with the CRM call.
        assert.deepEqual(
          requests.map(({ url }) => new URL(url).pathname),
          [
            "/submissions/v3/integration/submit/148486827/35384a3e-7386-45b0-924e-84e5d6f637e4",
            "/api/v1/leads",
          ],
        );

        // The failure must be REPORTED, not merely survived. Without this the
        // whole lead_hubspot_failed mechanism could be deleted with the suite
        // green -- which is the exact "a drop with nothing to notice it by"
        // class the event was added to close.
        assert.deepEqual(
          analyticsEvents.filter(([, eventName]) =>
            eventName.startsWith("lead_hubspot_"),
          ),
          [
            [
              "event",
              "lead_hubspot_failed",
              { location: "topnav", reason: "generic" },
            ],
          ],
        );
      },
    );
  }
});

const HUBSPOT_SUBMIT_PATH =
  "/submissions/v3/integration/submit/148486827/35384a3e-7386-45b0-924e-84e5d6f637e4";

test("a HubSpot mirror that never settles does not block the capture", async () => {
  // The sibling test proves a FAILING mirror cannot abort the capture. This one
  // proves a SLOW one cannot stall it, which is a different property and the
  // more likely outage: submitStartNowLead passes no AbortSignal and sets no
  // timeout, so a hung api.hsforms.com connection neither resolves nor rejects.
  // Awaiting it would leave the visitor on a spinner forever with no error and
  // no reachable retry -- and every failure-shaped test would still pass.
  const requests = [];
  await withTopNav(
    {
      state: "active",
      fetchImpl: async (url, options) => {
        const target = String(url);
        if (new URL(target).host === "api.hsforms.com") {
          requests.push({ url: target });
          return new Promise(() => {}); // never settles
        }
        requests.push({ url: target, body: JSON.parse(options.body) });
        return new Response(
          JSON.stringify({
            data: { run_id: "run-hubspot-hung", resend_after_seconds: 30 },
          }),
          { status: 202, headers: { "content-type": "application/json" } },
        );
      },
    },
    async () => {
      await click(buttonWithText("Start Now", 0));
      const dialog = document.querySelector(
        'dialog[aria-label="Get started with Traigent"]',
      );
      await click(dialog.querySelector('input[type="checkbox"]'));
      await changeInput(
        dialog.querySelector('input[aria-label="Work email"]'),
        "dev@example.com",
      );
      await click(buttonWithText("Email me a code"));

      assert.match(dialog.textContent, /Check your email for the code/);
      assert.deepEqual(
        requests.map(({ url }) => new URL(url).pathname),
        [HUBSPOT_SUBMIT_PATH, "/api/v1/leads"],
      );
    },
  );
});

test("re-submitting the same address writes exactly one CRM record", async () => {
  // The mirror must fire once per LEAD, not once per submit attempt. A capture
  // is retried in ordinary conditions -- a backend 429/500, or a 404 while
  // ENABLE_LEAD_ACCESS_ONBOARDING is still off, which is the most likely
  // day-one state -- and each retry would otherwise write another CRM record
  // and another founder notification for the same person.
  //
  // Driving it through "Use a different email" rather than the resend button is
  // deliberate: resend is gated behind a cooldown the client clamps to 30s
  // (a server-sent 0 is falsy and falls back), so a resend-driven test would
  // click a disabled control and prove nothing. This exercises the same
  // guarantee with no timers.
  const requests = [];
  await withTopNav(
    {
      state: "active",
      fetchImpl: async (url, options) => {
        const target = String(url);
        if (new URL(target).host === "api.hsforms.com") {
          requests.push({ url: target });
          return new Response(JSON.stringify({}), { status: 200 });
        }
        requests.push({ url: target, body: JSON.parse(options.body) });
        return new Response(
          JSON.stringify({
            data: { run_id: "run-resubmit", resend_after_seconds: 30 },
          }),
          { status: 202, headers: { "content-type": "application/json" } },
        );
      },
    },
    async () => {
      await click(buttonWithText("Start Now", 0));
      const dialog = document.querySelector(
        'dialog[aria-label="Get started with Traigent"]',
      );
      await click(dialog.querySelector('input[type="checkbox"]'));

      const submitSameAddress = async () => {
        await changeInput(
          dialog.querySelector('input[aria-label="Work email"]'),
          "dev@example.com",
        );
        await click(buttonWithText("Email me a code"));
        assert.match(dialog.textContent, /Check your email for the code/);
      };

      await submitSameAddress();
      const goBack = [...dialog.querySelectorAll("button")].find((button) =>
        /different email/i.test(button.textContent),
      );
      assert.ok(goBack, "the code step offers a way back to the email step");
      await click(goBack);
      await submitSameAddress();

      const hubspotCalls = requests.filter(
        ({ url }) => new URL(url).host === "api.hsforms.com",
      );
      const captureCalls = requests.filter(
        ({ url }) => new URL(url).pathname === "/api/v1/leads",
      );
      // The backend genuinely saw two captures, so the single CRM record is
      // deduplication and not a click that silently did nothing.
      assert.equal(captureCalls.length, 2, "the second submit really happened");
      assert.equal(hubspotCalls.length, 1, "exactly one CRM record per lead");
    },
  );
});

test("correcting a typo and correcting it back writes one record per address", async () => {
  // A -> B -> A. The previous guard held only the LAST address, so it deduped
  // CONSECUTIVE submits and nothing else: an ordinary correction loop wrote two
  // CRM records and two founder notifications for the same person. Three
  // distinct submits, two distinct addresses, two records.
  const requests = [];
  await withTopNav(
    {
      state: "active",
      fetchImpl: async (url, options) => {
        const target = String(url);
        if (new URL(target).host === "api.hsforms.com") {
          requests.push({ url: target, body: JSON.parse(options.body) });
          return new Response(JSON.stringify({}), { status: 200 });
        }
        requests.push({ url: target, body: JSON.parse(options.body) });
        return new Response(
          JSON.stringify({
            data: { run_id: "run-typo-loop", resend_after_seconds: 30 },
          }),
          { status: 202, headers: { "content-type": "application/json" } },
        );
      },
    },
    async () => {
      await click(buttonWithText("Start Now", 0));
      const dialog = document.querySelector(
        'dialog[aria-label="Get started with Traigent"]',
      );
      await click(dialog.querySelector('input[type="checkbox"]'));

      const submit = async (address) => {
        await changeInput(
          dialog.querySelector('input[aria-label="Work email"]'),
          address,
        );
        await click(buttonWithText("Email me a code"));
        assert.match(dialog.textContent, /Check your email for the code/);
        const back = [...dialog.querySelectorAll("button")].find((button) =>
          /different email/i.test(button.textContent),
        );
        assert.ok(back, "the code step offers a way back to the email step");
        await click(back);
      };

      await submit("typo@example.com");
      await submit("correct@example.com");
      await submit("typo@example.com");

      const mirrored = requests
        .filter(({ url }) => new URL(url).host === "api.hsforms.com")
        .map(({ body }) => body.fields.find((f) => f.name === "email").value);
      assert.deepEqual(mirrored, ["typo@example.com", "correct@example.com"]);

      // All three submits really reached the backend, so the two CRM records
      // are deduplication rather than a click that silently did nothing.
      assert.equal(
        requests.filter(({ url }) => new URL(url).pathname === "/api/v1/leads")
          .length,
        3,
      );
    },
  );
});

test("a slow failing mirror cannot wipe another address's dedupe", async () => {
  // The stale-clobber path, and the reason the failure clear is keyed by
  // address. Sequence: A's mirror is still in flight when B's succeeds; A then
  // fails. An unconditional `clear everything` on failure wipes the record that
  // B had just written, so re-submitting B mirrors it a second time -- a
  // duplicate-write path created by the very guard meant to prevent duplicates.
  const mirroredAddresses = [];
  let releaseSlowFailure;
  const slowFailure = new Promise((resolve) => {
    releaseSlowFailure = resolve;
  });

  await withTopNav(
    {
      state: "active",
      fetchImpl: async (url, options) => {
        const target = String(url);
        if (new URL(target).host === "api.hsforms.com") {
          const address = JSON.parse(options.body).fields.find(
            (field) => field.name === "email",
          ).value;
          mirroredAddresses.push(address);
          if (address === "slow@example.com") {
            await slowFailure;
            return new Response("upstream boom", { status: 500 });
          }
          return new Response(JSON.stringify({}), { status: 200 });
        }
        return new Response(
          JSON.stringify({
            data: { run_id: "run-clobber", resend_after_seconds: 30 },
          }),
          { status: 202, headers: { "content-type": "application/json" } },
        );
      },
    },
    async () => {
      await click(buttonWithText("Start Now", 0));
      const dialog = document.querySelector(
        'dialog[aria-label="Get started with Traigent"]',
      );
      await click(dialog.querySelector('input[type="checkbox"]'));

      const submit = async (address) => {
        await changeInput(
          dialog.querySelector('input[aria-label="Work email"]'),
          address,
        );
        await click(buttonWithText("Email me a code"));
        const back = [...dialog.querySelectorAll("button")].find((button) =>
          /different email/i.test(button.textContent),
        );
        await click(back);
      };

      await submit("slow@example.com"); // mirror hangs, will fail
      await submit("fast@example.com"); // mirror succeeds and is recorded

      releaseSlowFailure();
      await act(async () => {
        await slowFailure;
        await Promise.resolve();
      });

      await submit("fast@example.com"); // must NOT mirror again

      assert.deepEqual(mirroredAddresses, [
        "slow@example.com",
        "fast@example.com",
      ]);
    },
  );
});

test("the CRM dedupe is case-folded, like every system on either side of it", async () => {
  // A case-SENSITIVE key treats `A@corp.com` and `a@corp.com` as two people and
  // mirrors both. Both systems the key sits between disagree with that: the
  // backend normalises with `.strip().lower()`, and HubSpot keys contacts on a
  // case-insensitive address. So the duplicate is real, just spelled with a
  // shift key -- exactly the record this set exists to stop.
  const mirrored = [];
  await withTopNav(
    {
      state: "active",
      fetchImpl: async (url, options) => {
        if (new URL(String(url)).host === "api.hsforms.com") {
          mirrored.push(
            JSON.parse(options.body).fields.find((f) => f.name === "email")
              .value,
          );
          return new Response(JSON.stringify({}), { status: 200 });
        }
        return new Response(
          JSON.stringify({
            data: { run_id: "run-case-fold", resend_after_seconds: 30 },
          }),
          { status: 202, headers: { "content-type": "application/json" } },
        );
      },
    },
    async () => {
      await click(buttonWithText("Start Now", 0));
      const dialog = document.querySelector(
        'dialog[aria-label="Get started with Traigent"]',
      );
      await click(dialog.querySelector('input[type="checkbox"]'));

      const submit = async (address) => {
        await changeInput(
          dialog.querySelector('input[aria-label="Work email"]'),
          address,
        );
        await click(buttonWithText("Email me a code"));
        const back = [...dialog.querySelectorAll("button")].find((button) =>
          /different email/i.test(button.textContent),
        );
        await click(back);
      };

      await submit("Casey@Example.com");
      await submit("casey@example.com");
      await submit("  CASEY@EXAMPLE.COM  ");

      // One person, one CRM record -- and the address HubSpot receives is the
      // normalised one, matching what the backend stored for the same capture.
      assert.deepEqual(mirrored, ["casey@example.com"]);
    },
  );
});

test("the dormant fallback does not re-mirror an address the live path already sent", async () => {
  // The two views share one dedupe set because a visitor can cross between
  // them. A 5xx carrying NOT_FOUND flips `runtimeUnavailable` mid-session, so
  // the live path can mirror an address and THEN hand the same visitor to the
  // dormant form, whose submit posts to HubSpot directly. Checking only within
  // each component would miss precisely that crossing.
  const mirrored = [];
  await withTopNav(
    {
      state: "active",
      fetchImpl: async (url, options) => {
        if (new URL(String(url)).host === "api.hsforms.com") {
          mirrored.push(
            JSON.parse(options.body).fields.find((f) => f.name === "email")
              .value,
          );
          return new Response(JSON.stringify({}), { status: 200 });
        }
        // The flag is off behind the edge: the exact envelope lead_routes.py
        // returns when ENABLE_LEAD_ACCESS_ONBOARDING is false.
        return new Response(
          JSON.stringify({ error: "Not found", error_code: "NOT_FOUND" }),
          { status: 404, headers: { "content-type": "application/json" } },
        );
      },
    },
    async () => {
      await click(buttonWithText("Start Now", 0));
      const dialog = document.querySelector(
        'dialog[aria-label="Get started with Traigent"]',
      );
      await click(dialog.querySelector('input[type="checkbox"]'));
      await changeInput(
        dialog.querySelector('input[aria-label="Work email"]'),
        "crossing@example.com",
      );
      await click(buttonWithText("Email me a code"));

      assert.equal(
        mirrored.length,
        1,
        "the live path mirrored before the backend refused",
      );

      // The 404 retired the self-serve UI. DormantView keeps its OWN consent
      // state, so its form only appears once the box is ticked again.
      await click(dialog.querySelector('input[type="checkbox"]'));
      const dormantEmail = dialog.querySelector('input[type="email"]');
      assert.ok(
        dormantEmail?.id.endsWith("-dormant-email"),
        "a NOT_FOUND capture collapses the modal back to the dormant form",
      );
      await changeInput(dormantEmail, "Crossing@Example.com");
      await click(buttonWithText("Unlock advanced features"));

      // Still one record. AND the visitor is actually told so -- asserting the
      // array alone let a build where the dormant submit silently does nothing
      // ship green.
      assert.deepEqual(mirrored, ["crossing@example.com"]);
      assert.match(dialog.textContent, /You're in/);
    },
  );
});

test("a FAILED live mirror leaves the dormant form able to reach the CRM", async () => {
  // The regression this pins: when "claimed" and "confirmed" were one set, the
  // live path's optimistic claim made DormantView short-circuit and render
  // "You're in" -- while the mirror it was trusting went on to fail. Net: zero
  // CRM records, and a visitor told they had succeeded. Membership must mean
  // HubSpot ACCEPTED the address, never merely that something tried.
  const attempts = [];
  await withTopNav(
    {
      state: "active",
      fetchImpl: async (url, options) => {
        const target = String(url);
        if (new URL(target).host === "api.hsforms.com") {
          const address = JSON.parse(options.body).fields.find(
            (f) => f.name === "email",
          ).value;
          attempts.push(address);
          // The live path's mirror fails; the dormant form's later one works.
          return new Response(JSON.stringify({}), {
            status: attempts.length === 1 ? 500 : 200,
          });
        }
        return new Response(
          JSON.stringify({ error: "Not found", error_code: "NOT_FOUND" }),
          { status: 404, headers: { "content-type": "application/json" } },
        );
      },
    },
    async () => {
      await click(buttonWithText("Start Now", 0));
      const dialog = document.querySelector(
        'dialog[aria-label="Get started with Traigent"]',
      );
      await click(dialog.querySelector('input[type="checkbox"]'));
      await changeInput(
        dialog.querySelector('input[aria-label="Work email"]'),
        "ghost@example.com",
      );
      await click(buttonWithText("Email me a code"));

      await click(dialog.querySelector('input[type="checkbox"]'));
      await changeInput(
        dialog.querySelector('input[type="email"]'),
        "ghost@example.com",
      );
      await click(buttonWithText("Unlock advanced features"));

      // The dormant form really submitted -- it did not trust the dead claim.
      assert.deepEqual(attempts, ["ghost@example.com", "ghost@example.com"]);
      // And the success it reports is a real one: the second attempt returned ok.
      assert.match(dialog.textContent, /You're in/);
    },
  );
});

test("a dormant submit is recorded, so reopening the modal does not re-mirror", async () => {
  // Pins the write half of the dormant path. Deleting the record-on-success left
  // the whole suite green, because closing the modal unmounts DormantView and
  // wipes its local `done` -- so nothing else notices the record is missing.
  const attempts = [];
  await withTopNav(
    {
      state: "dormant",
      fetchImpl: async (url, options) => {
        attempts.push(
          JSON.parse(options.body).fields.find((f) => f.name === "email").value,
        );
        return new Response(JSON.stringify({}), { status: 200 });
      },
    },
    async () => {
      const openAndSubmit = async () => {
        await click(buttonWithText("Start Now", 0));
        const dialog = document.querySelector(
          'dialog[aria-label="Get started with Traigent"]',
        );
        await click(dialog.querySelector('input[type="checkbox"]'));
        await changeInput(
          dialog.querySelector('input[type="email"]'),
          "TWICE@Example.com",
        );
        await click(buttonWithText("Unlock advanced features"));
        assert.match(dialog.textContent, /You're in/);
        await click(dialog.querySelector('button[aria-label="Close"]'));
      };

      // First visit records the address.
      await openAndSubmit();

      // Second visit: this browser remembers the address, so the modal opens
      // straight to "You're in" -- no form, and no second CRM write.
      await click(buttonWithText("Start Now", 0));
      const reopened = document.querySelector(
        'dialog[aria-label="Get started with Traigent"]',
      );
      assert.match(reopened.textContent, /You're in/);
      assert.equal(
        reopened.querySelector('input[type="email"]'),
        null,
        "a remembered visitor is not asked for the email again",
      );

      // One record, normalised -- the second visit did not write again.
      assert.deepEqual(attempts, ["twice@example.com"]);
    },
  );
});

test("a live mirror still IN FLIGHT does not short-circuit the dormant form", async () => {
  // The sibling test covers a mirror that has already failed. This covers the
  // window before it resolves -- the one an in-flight guard would wrongly treat
  // as "the CRM has them". It does not: an unresolved request is not a record,
  // and if it never lands, this form is the only thing that will reach HubSpot.
  const attempts = [];
  await withTopNav(
    {
      state: "active",
      fetchImpl: async (url, options) => {
        const target = String(url);
        if (new URL(target).host === "api.hsforms.com") {
          attempts.push(
            JSON.parse(options.body).fields.find((f) => f.name === "email")
              .value,
          );
          // Never settles: the live mirror is still in flight for the rest of
          // the test, so `inFlightMirrors` still holds this address.
          if (attempts.length === 1) return new Promise(() => {});
          return new Response(JSON.stringify({}), { status: 200 });
        }
        return new Response(
          JSON.stringify({ error: "Not found", error_code: "NOT_FOUND" }),
          { status: 404, headers: { "content-type": "application/json" } },
        );
      },
    },
    async () => {
      await click(buttonWithText("Start Now", 0));
      const dialog = document.querySelector(
        'dialog[aria-label="Get started with Traigent"]',
      );
      await click(dialog.querySelector('input[type="checkbox"]'));
      await changeInput(
        dialog.querySelector('input[aria-label="Work email"]'),
        "hung@example.com",
      );
      await click(buttonWithText("Email me a code"));

      await click(dialog.querySelector('input[type="checkbox"]'));
      await changeInput(
        dialog.querySelector('input[type="email"]'),
        "hung@example.com",
      );
      await click(buttonWithText("Unlock advanced features"));

      assert.deepEqual(
        attempts,
        ["hung@example.com", "hung@example.com"],
        "the dormant form submits rather than trusting an unresolved mirror",
      );
      assert.match(dialog.textContent, /You're in/);
    },
  );
});
