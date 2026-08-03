import assert from "node:assert/strict";
import test from "node:test";

import { JSDOM } from "jsdom";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { Simulate } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";

const REPOSITORY_ROOT = new URL("..", import.meta.url).pathname;

function installDom() {
  const dom = new JSDOM('<!doctype html><div id="root"></div>', {
    url: "https://traigent.ai/",
  });
  const { window } = dom;

  globalThis.window = window;
  globalThis.document = window.document;
  globalThis.navigator = window.navigator;
  globalThis.localStorage = window.localStorage;
  globalThis.sessionStorage = window.sessionStorage;
  globalThis.HTMLElement = window.HTMLElement;
  globalThis.Element = window.Element;
  globalThis.Node = window.Node;
  globalThis.Event = window.Event;
  globalThis.CustomEvent = window.CustomEvent;
  globalThis.MouseEvent = window.MouseEvent;
  globalThis.getComputedStyle = window.getComputedStyle.bind(window);
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
  globalThis.fetch = fetchImpl;
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
    globalThis.fetch = previous.fetch;
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
        assert.match(dialog.textContent, /Self-serve setup is unavailable/);
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
      assert.deepEqual(
        requests.map(({ url }) => new URL(url).pathname),
        ["/api/v1/leads", "/api/v1/leads/verify"],
      );
      assert.deepEqual(requests[1].body, {
        email: "dev@example.com",
        run_id: "run-component-test",
        code: "123456",
      });
      assert.deepEqual(
        analyticsEvents.map(([, eventName, properties]) => [
          eventName,
          properties,
        ]),
        [
          ["lead_funnel_opened", { location: "topnav" }],
          ["lead_capture_submitted", { location: "topnav" }],
          ["lead_verify_submitted", { location: "topnav" }],
          ["lead_verify_succeeded", { location: "topnav" }],
        ],
      );
    },
  );
});
