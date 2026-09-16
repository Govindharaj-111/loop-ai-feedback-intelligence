export interface SimulatedFeedbackItem {
  content: string;
  channel: string;
  customerLabel: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  status: "NEW" | "REVIEWED" | "ACTIONED";
  createdAt: Date;
}

const SUPPORT_TICKETS: SimulatedFeedbackItem[] = [
  {
    content: "Customer unable to complete checkout using Amex card. Returns HTTP 500 internal server error during payment processing step.",
    channel: "Support Ticket",
    customerLabel: "Acme Enterprise (#T-1029)",
    sentiment: "Negative",
    status: "NEW",
    createdAt: new Date(Date.now() - 1 * 86400000),
  },
  {
    content: "Requesting SSO SAML Okta integration documentation for our IT security audit next month.",
    channel: "Support Ticket",
    customerLabel: "GlobalTech Solutions (#T-1034)",
    sentiment: "Neutral",
    status: "REVIEWED",
    createdAt: new Date(Date.now() - 3 * 86400000),
  },
  {
    content: "The support team resolved our API rate limit issue within 15 minutes! Fantastic responsiveness.",
    channel: "Support Ticket",
    customerLabel: "CloudScale Inc (#T-1041)",
    sentiment: "Positive",
    status: "ACTIONED",
    createdAt: new Date(Date.now() - 5 * 86400000),
  },
];

const APP_REVIEWS: SimulatedFeedbackItem[] = [
  {
    content: "Latest mobile app update crashes constantly when opening notifications on iOS 17.4.",
    channel: "App Review",
    customerLabel: "App Store User @techie_guy",
    sentiment: "Negative",
    status: "NEW",
    createdAt: new Date(Date.now() - 2 * 86400000),
  },
  {
    content: "Great dark mode design overhaul! The dashboard loads twice as fast now.",
    channel: "App Review",
    customerLabel: "Google Play User Sarah_K",
    sentiment: "Positive",
    status: "REVIEWED",
    createdAt: new Date(Date.now() - 4 * 86400000),
  },
  {
    content: "Needs biometric fingerprint login option. Typing password every time is tedious.",
    channel: "App Review",
    customerLabel: "App Store User MarkR",
    sentiment: "Neutral",
    status: "NEW",
    createdAt: new Date(Date.now() - 6 * 86400000),
  },
];

const NPS_RESPONSES: SimulatedFeedbackItem[] = [
  {
    content: "Score: 10/10 — Project LOOP has transformed how our product team prioritizes customer feature requests.",
    channel: "NPS Survey",
    customerLabel: "NPS Respondent (Score: 10)",
    sentiment: "Positive",
    status: "ACTIONED",
    createdAt: new Date(Date.now() - 1 * 86400000),
  },
  {
    content: "Score: 3/10 — CSV export function is very slow when processing datasets over 10,000 rows.",
    channel: "NPS Survey",
    customerLabel: "NPS Respondent (Score: 3)",
    sentiment: "Negative",
    status: "NEW",
    createdAt: new Date(Date.now() - 3 * 86400000),
  },
  {
    content: "Score: 7/10 — Useful platform, but needs better permission roles for external contractors.",
    channel: "NPS Survey",
    customerLabel: "NPS Respondent (Score: 7)",
    sentiment: "Neutral",
    status: "REVIEWED",
    createdAt: new Date(Date.now() - 7 * 86400000),
  },
];

const SALES_CALLS: SimulatedFeedbackItem[] = [
  {
    content: "Prospect mentioned their biggest blocker to signing the annual contract is lack of SOC2 Type II compliance report.",
    channel: "Sales Call",
    customerLabel: "Sales Call Notes (Prospect: Nexus Financial)",
    sentiment: "Negative",
    status: "NEW",
    createdAt: new Date(Date.now() - 2 * 86400000),
  },
  {
    content: "VP of Product loved the real-time sentiment analytics demo. Requesting 30-day POC trial for 50 seats.",
    channel: "Sales Call",
    customerLabel: "Sales Call Notes (Prospect: Horizon Media)",
    sentiment: "Positive",
    status: "ACTIONED",
    createdAt: new Date(Date.now() - 5 * 86400000),
  },
];

export function getSimulatedFeed(channelType: string): SimulatedFeedbackItem[] {
  switch (channelType) {
    case "support":
      return SUPPORT_TICKETS;
    case "app_reviews":
      return APP_REVIEWS;
    case "nps":
      return NPS_RESPONSES;
    case "sales":
      return SALES_CALLS;
    default:
      return [...SUPPORT_TICKETS, ...APP_REVIEWS, ...NPS_RESPONSES, ...SALES_CALLS];
  }
}
