import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function generateEmbeddingVector(text: string): number[] {
  const stopWords = new Set(["error", "issue", "problem", "this", "that", "with", "from", "user", "data", "app", "system", "feedback", "record", "item"]);
  const words = text.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/).filter((w) => w.length > 2 && !stopWords.has(w));
  const vector = new Array(32).fill(0);

  words.forEach((word) => {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = (hash << 5) - hash + word.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % 32;
    vector[idx] += 1;
  });

  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (magnitude === 0) return vector;

  return vector.map((val) => val / magnitude);
}

const SEED_FEEDBACK_TEMPLATES = [
  // Payment & Billing (Negative & Positive)
  { text: "Unable to process payment using American Express card on mobile checkout page. Keeps returning HTTP 500 error.", channel: "Support Ticket", customer: "Enterprise Client - Acme Retail", sentiment: "Negative", score: -0.85, feature: "Payment & Billing", status: "NEW" },
  { text: "Subscription auto-renewal failed without sending notification email. Almost lost access to project workspace.", channel: "Support Ticket", customer: "GlobalTech Systems", sentiment: "Negative", score: -0.75, feature: "Payment & Billing", status: "NEW" },
  { text: "Invoice PDF download feature is working great! Easy to forward to accounting team.", channel: "Community Post", customer: "Finance Team @ CloudScale", sentiment: "Positive", score: 0.90, feature: "Payment & Billing", status: "ACTIONED" },
  { text: "Credit card update portal asks for full card number twice. Needs UX streamlining.", channel: "NPS Survey", customer: "NPS Respondent (Score: 6)", sentiment: "Neutral", score: 0.0, feature: "Payment & Billing", status: "REVIEWED" },

  // Mobile Application (Crashes & Redesign)
  { text: "Latest iOS 17.4 mobile update crashes instantly when opening push notifications tab.", channel: "App Review", customer: "App Store User @tech_guru", sentiment: "Negative", score: -0.90, feature: "Mobile Application", status: "NEW" },
  { text: "Android application consumes 45% battery in background mode. High battery drain reported.", channel: "Support Ticket", customer: "Android User Mark_S", sentiment: "Negative", score: -0.80, feature: "Mobile Application", status: "REVIEWED" },
  { text: "Loved the new mobile dark mode interface overhaul! Navigation is twice as fast.", channel: "App Review", customer: "Google Play User Sarah_K", sentiment: "Positive", score: 0.95, feature: "Mobile Application", status: "ACTIONED" },
  { text: "Requesting fingerprint biometric login option on Android app for faster authentication.", channel: "App Review", customer: "Mobile User Alex_P", sentiment: "Neutral", score: 0.10, feature: "Mobile Application", status: "NEW" },

  // Security & Auth (SSO & Compliance)
  { text: "Prospect mentioned lack of SOC2 Type II audit compliance report is their sole blocker to signing 100-seat contract.", channel: "Sales Call", customer: "Sales Call Notes (Prospect: Nexus Financial)", sentiment: "Negative", score: -0.70, feature: "Security & Auth", status: "NEW" },
  { text: "Okta SAML 2.0 Single Sign-On setup documentation was clear and worked on first attempt.", channel: "Community Post", customer: "IT SecAdmin @ Horizon", sentiment: "Positive", score: 0.88, feature: "Security & Auth", status: "ACTIONED" },
  { text: "Two-Factor SMS authentication codes take up to 4 minutes to arrive in UK region.", channel: "Support Ticket", customer: "UK Branch User", sentiment: "Negative", score: -0.65, feature: "Security & Auth", status: "REVIEWED" },
  { text: "Can we get custom session timeout duration settings for enterprise workspace compliance?", channel: "Sales Call", customer: "Sales Call Notes (Prospect: Apex Health)", sentiment: "Neutral", score: 0.0, feature: "Security & Auth", status: "NEW" },

  // Performance & API
  { text: "API rate limits on bulk feedback ingestion endpoint are too restrictive for enterprise ingestion pipelines.", channel: "Support Ticket", customer: "Data Team @ DataStream", sentiment: "Negative", score: -0.70, feature: "Performance & API", status: "REVIEWED" },
  { text: "Dashboard loading time reduced from 4.2 seconds to 800ms after recent database migration. Great work!", channel: "NPS Survey", customer: "NPS Respondent (Score: 10)", sentiment: "Positive", score: 0.98, feature: "Performance & API", status: "ACTIONED" },
  { text: "CSV export times out when exporting datasets with over 25,000 feedback records.", channel: "Support Ticket", customer: "Analytics Lead @ DataCorp", sentiment: "Negative", score: -0.80, feature: "Performance & API", status: "NEW" },
  { text: "GraphQL API endpoint documentation is thorough and clear.", channel: "Community Post", customer: "Dev Partner", sentiment: "Positive", score: 0.85, feature: "Performance & API", status: "ACTIONED" },

  // Usability & UI
  { text: "Ask LOOP natural language RAG search provides accurate citations from customer feedback tickets!", channel: "NPS Survey", customer: "NPS Respondent (Score: 10)", sentiment: "Positive", score: 0.95, feature: "Usability", status: "ACTIONED" },
  { text: "Filter bar resets search query when changing date ranges. Need search query state persistence.", channel: "Support Ticket", customer: "Product Manager @ Innovate", sentiment: "Neutral", score: -0.20, feature: "Usability", status: "REVIEWED" },
  { text: "Table column width on feedback inbox truncates long feedback text on 13-inch laptop screens.", channel: "Community Post", customer: "UX Tester", sentiment: "Neutral", score: -0.10, feature: "Usability", status: "NEW" },
  { text: "Executive VoC report PDF export formatting is clean and easy to present in board meetings.", channel: "NPS Survey", customer: "VP of Product @ Velocity", sentiment: "Positive", score: 0.92, feature: "Usability", status: "ACTIONED" },
];

async function main() {
  console.log("==================================================");
  console.log("   PROJECT LOOP — PRODUCTION DEMO DATA SEEDER     ");
  console.log("==================================================\n");

  // 1. Cleanup existing database records
  await prisma.feedbackTheme.deleteMany();
  await prisma.embedding.deleteMany();
  await prisma.report.deleteMany();
  await prisma.theme.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.user.deleteMany();
  await prisma.workspace.deleteMany();

  // 2. Create Demo Workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: "Acme Feedback Intelligence",
    },
  });

  console.log(`✅ Created Workspace: "${workspace.name}" (ID: ${workspace.id})`);

  // 3. Create 3 Demo Accounts (ADMIN, ANALYST, VIEWER)
  const salt = await bcrypt.genSalt(10);
  const adminHash = await bcrypt.hash("AdminPass123!", salt);
  const analystHash = await bcrypt.hash("AnalystPass123!", salt);
  const viewerHash = await bcrypt.hash("ViewerPass123!", salt);

  const admin = await prisma.user.create({
    data: {
      name: "Sarah Jenkins (Admin)",
      email: "admin@acme.com",
      passwordHash: adminHash,
      role: "ADMIN",
      workspaceId: workspace.id,
    },
  });

  const analyst = await prisma.user.create({
    data: {
      name: "Marcus Vance (Analyst)",
      email: "analyst@acme.com",
      passwordHash: analystHash,
      role: "ANALYST",
      workspaceId: workspace.id,
    },
  });

  const viewer = await prisma.user.create({
    data: {
      name: "Elena Rostova (Viewer)",
      email: "viewer@acme.com",
      passwordHash: viewerHash,
      role: "VIEWER",
      workspaceId: workspace.id,
    },
  });

  console.log("✅ Created Demo Accounts:");
  console.log("   • ADMIN:   admin@acme.com   / AdminPass123!");
  console.log("   • ANALYST: analyst@acme.com / AnalystPass123!");
  console.log("   • VIEWER:  viewer@acme.com  / ViewerPass123!");

  // 4. Create Workspace Themes
  const themesData = [
    { name: "Payment & Billing", description: "Customer issues regarding credit cards, invoice downloads, and subscription renewals." },
    { name: "Mobile Application", description: "Feedback on iOS and Android app stability, dark mode, and push notifications." },
    { name: "Security & Auth", description: "Okta SSO integration, two-factor SMS codes, and SOC2 compliance inquiries." },
    { name: "Performance & API", description: "API rate limits, database load speed, and CSV dataset exports." },
    { name: "Usability & UI", description: "Feedback on RAG search, dashboard layout, and report PDF exports." },
  ];

  const createdThemes: Record<string, string> = {};
  for (const t of themesData) {
    const themeObj = await prisma.theme.create({
      data: {
        name: t.name,
        description: t.description,
        workspaceId: workspace.id,
      },
    });
    createdThemes[t.name] = themeObj.id;
  }

  console.log(`✅ Created ${themesData.length} Workspace Themes.`);

  // 5. Generate 120+ Feedback Records across 30 Days
  console.log("⏳ Generating 120+ realistic customer feedback records...");

  let feedbackCount = 0;
  const now = Date.now();

  for (let i = 0; i < 125; i++) {
    const template = SEED_FEEDBACK_TEMPLATES[i % SEED_FEEDBACK_TEMPLATES.length];

    // Distribute dates across last 30 days
    const dayOffset = Math.floor((i / 125) * 30);
    const minuteOffset = (i * 37) % (24 * 60);
    const createdAt = new Date(now - dayOffset * 86400000 - minuteOffset * 60000);

    // Slight variance in customer labels & text
    const customer = `${template.customer} #${1000 + i}`;
    const content = `${template.text} (Ref #${i + 100})`;

    const feedback = await prisma.feedback.create({
      data: {
        content,
        channel: template.channel,
        customerLabel: customer,
        sentiment: template.sentiment,
        sentimentScore: template.score,
        featureArea: template.feature,
        rationale: `Auto-classified ${template.sentiment} (${template.feature}) based on keyword analysis.`,
        status: template.status,
        createdAt,
        workspaceId: workspace.id,
      },
    });

    // Create Embedding Vector
    const vecArr = generateEmbeddingVector(content);
    await prisma.embedding.create({
      data: {
        feedbackId: feedback.id,
        vector: JSON.stringify(vecArr),
      },
    });

    // Associate with Theme
    const themeId = createdThemes[template.feature];
    if (themeId) {
      await prisma.feedbackTheme.create({
        data: {
          feedbackId: feedback.id,
          themeId,
          confidence: 0.95,
        },
      });
    }

    feedbackCount++;
  }

  console.log(`✅ Seeded ${feedbackCount} customer feedback records with embeddings & theme linkages!`);

  // 6. Create Initial VoC Report
  const periodStart = new Date(now - 30 * 86400000);
  const periodEnd = new Date();

  await prisma.report.create({
    data: {
      title: "Monthly Executive Voice-of-Customer Summary (30-Day Snapshot)",
      periodStart,
      periodEnd,
      contentJson: JSON.stringify({
        stats: {
          totalFeedback: feedbackCount,
          positiveCount: 45,
          neutralCount: 30,
          negativeCount: 50,
          positivePercent: 36,
          neutralPercent: 24,
          negativePercent: 40,
          topThemes: themesData.map((t) => ({ theme: t.name, count: 25 })),
          periodStart,
          periodEnd,
        },
        content: {
          executiveSummary: `During the last 30 days, Acme Feedback Intelligence received ${feedbackCount} feedback records across 5 channels. Overall sentiment reflects 36% Positive, 24% Neutral, and 40% Negative feedback.`,
          sentimentOverview: `${feedbackCount} total feedback records analyzed. Top negative drivers stem from mobile app crashes on iOS 17.4 and checkout payment processing errors.`,
          topCustomerThemes: themesData.map((t) => ({ name: t.name, summary: t.description, count: 25 })),
          importantTrends: [
            "Mobile App Crashes represent 22% of total negative volume.",
            "Payment Processing errors on checkout require engineering remediation.",
            "Ask LOOP RAG search usage increased 40% among enterprise product managers.",
          ],
          representativeFeedback: [
            { quote: "Latest iOS update crashes constantly when opening notifications.", channel: "App Review", customer: "App Store User" },
            { quote: "Unable to process payment using Amex card on mobile checkout.", channel: "Support Ticket", customer: "Acme Retail" },
            { quote: "Ask LOOP RAG search provides accurate citations from tickets!", channel: "NPS Survey", customer: "NPS Respondent (Score: 10)" },
          ],
          keyPainPoints: [
            "iOS 17.4 push notification crash on app launch.",
            "Amex credit card checkout HTTP 500 error.",
            "CSV dataset export timeouts over 25,000 rows.",
          ],
          recommendedActions: [
            "Deploy emergency hotfix release for iOS notification crash.",
            "Audit payment gateway integration for Amex card processing.",
            "Optimize database indexing for CSV exports.",
          ],
        },
      }),
      workspaceId: workspace.id,
      generatedBy: admin.id,
    },
  });

  console.log("✅ Seeded initial Executive VoC Report.");
  console.log("\n==================================================");
  console.log("   SEED COMPLETE — DATABASE READY FOR DEMO       ");
  console.log("==================================================\n");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
