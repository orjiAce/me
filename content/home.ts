/**
 * Home-page section copy — §10.1.8. Not a services list: four honest
 * capability blocks whose mono index numbers map to a real delivery
 * sequence. Every sentence traces to §9.3 project work — if a claim
 * can't be pinned to a project, it doesn't belong here.
 */
export const capabilities: { index: string; title: string; body: string }[] = [
  {
    index: "01",
    title: "App architecture",
    body:
      "Every build starts as a system: domain-driven types → service → hooks → screen modules at JIFU360, MVVM with Zustand at OneWallet MFB, one navigation shell reshaping itself per role at UWA. Standards get set early so a team can ship inside them.",
  },
  {
    index: "02",
    title: "Real-time and streaming",
    body:
      "Live WebRTC streaming on Dolby Millicast with a custom native iOS Picture-in-Picture module at JIFU360, nurse-location tracking over Socket.IO at RightNowMD, chat on PubNub and plain WebSockets.",
  },
  {
    index: "03",
    title: "Payments",
    body:
      "Stripe Connect payouts and Identity gating at Lenbi, Paystack checkout through native auth sessions at UWA, Plaid bank linking at EvriCent, and a quote-polling engine at Nexaflex so nobody signs a stale price. OneWallet MFB shipped at bank grade: biometrics, 2FA, end-to-end encryption.",
  },
  {
    index: "04",
    title: "Shipping to the stores",
    body:
      "Seventeen products through App Store and Google Play review, with EAS builds and over-the-air updates as the release rail. Sentry in production, so stability is measured.",
  },
];
