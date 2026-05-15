# Relay

A two-screen realtime supply tracker for crisis response. Field workers report what they have; command center watches it appear live.

Built live at [Code/+/Crush Greenville](https://events.codeandtrust.com/past/code-crush) on May 13, 2026. Open-sourced as a reference implementation and a starting point.

> Air traffic control, not SaaS. Competent, calm, operational. Not designed-feeling. Not delightful. Trust comes from restraint.

## What it is

Two screens, one shared state.

**Volunteer view (mobile).** Stocked / Low / Out per category, three taps from page-load to submitted report. No login. Designed for a borrowed phone at 11pm with 12% battery.

**Command view (desktop).** Map of every reporting site, a live ticker, a priority stack sorted by what needs action. The EOC controller's single source of truth.

The atomic unit is `site x category x status`. Not SKU-level inventory. Not freeform notes. Not citizen-reported tips. See `docs/design-plan.md` for why.

## Run it

```bash
npm install
npm run dev
```

Opens at `http://127.0.0.1:5173`. Toggle between views via the pill in the bottom-right corner, or deep-link with `#command`.

## Project layout

```
src/
  main.tsx           entry point
  RelayApp.tsx       shell + view toggle
  VolunteerView.tsx  mobile field reporter
  CommandView.tsx    desktop EOC dashboard
  RelayWordmark.tsx  small reusable wordmark
  data.ts            mock data (sites, ticker, situation)
  styles.css         font import + reset

docs/
  BRAND_STYLES.md                 the Relay brand and style guide
  design-prompt.md                the brief the app was built from
  design-plan.md                  full design plan, by section
  personas.md                     persona stories (Maria and Diego)
  user-research-summary.md        user-research findings, condensed
  user-research-long.md           raw user research, unedited
  competitive-research-summary.md what existing tools do, where they break
  competitive-research/           per-competitor deep dives
```

## Background

Existing tools in this space (WebEOC, Crisis Track, Veoci, Crisis Cleanup, Ushahidi, Juvare, Zello) lose the user the moment they ask a field volunteer to log in, fill out a form, or use a credentialed account. Relay starts from a different premise: identity is captured in the audit trail asynchronously rather than at the gate, the form is three buttons, and the URL is the form.

The `docs/` folder contains the full research process behind the design choices, including 5 competitor deep-dives and persona stories drawn from after-action reports.

## Status

Relay is a working demo. The state is in-memory; there is no backend, no persistence, no auth. The shape of the data model and the UX are the contribution; wiring it to a real backend (queue + DB + WebSockets) is left as an exercise for whoever forks it.

Live demo: [relay.codeandtrust.com](https://relay.codeandtrust.com).

## Brand

Relay is a sub-brand of [Code/+/Trust](https://codeandtrust.com). The brand and style guide in `docs/BRAND_STYLES.md` is part of the open-source release. If you fork to build something different, rebrand it; don't ship a derivative as Relay.

## License

MIT. See `LICENSE`.
