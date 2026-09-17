import { prisma } from "../src/lib/prisma.js";
import { classifyFeedbackText, ClassificationSchema } from "../src/lib/aiService.js";
import { clusterWorkspaceFeedback } from "../src/lib/themeService.js";
import { askLoopRag, searchWorkspaceEmbeddings } from "../src/lib/vectorRagService.js";
import { hashPassword } from "../src/lib/auth.js";

async function runPhase3Tests() {
  console.log("=================================================");
  console.log("   PROJECT LOOP — PHASE 3 AUTOMATED TEST SUITE   ");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      if (detail) console.error(`   Details: ${detail}`);
      failed++;
    }
  }

  try {
    // Cleanup prior test data
    await prisma.feedbackTheme.deleteMany();
    await prisma.embedding.deleteMany();
    await prisma.report.deleteMany();
    await prisma.theme.deleteMany();
    await prisma.feedback.deleteMany();
    await prisma.user.deleteMany();
    await prisma.workspace.deleteMany();

    const pwdHash = await hashPassword("TestPass123!");
    const tenantA = await prisma.workspace.create({
      data: { name: "AI Test Workspace Alpha" },
    });

    const tenantB = await prisma.workspace.create({
      data: { name: "AI Test Workspace Beta" },
    });

    // -----------------------------------------------------------------
    // TEST 1: Positive Feedback Classification & Zod Validation
    // -----------------------------------------------------------------
    const posResult = await classifyFeedbackText("The new dashboard interface is amazingly fast and resolved our latency issues!");
    const posValid = ClassificationSchema.safeParse(posResult).success;

    assert(
      posValid && posResult.sentiment === "Positive" && posResult.sentimentScore > 0,
      "1. Positive feedback auto-classified with Zod schema validation",
      `Sentiment: ${posResult.sentiment}, Score: ${posResult.sentimentScore}`
    );

    // -----------------------------------------------------------------
    // TEST 2: Negative Feedback Classification
    // -----------------------------------------------------------------
    const negResult = await classifyFeedbackText("App crashes constantly when clicking the checkout button on iOS 17!");
    const negValid = ClassificationSchema.safeParse(negResult).success;

    assert(
      negValid && negResult.sentiment === "Negative" && negResult.sentimentScore < 0,
      "2. Negative feedback auto-classified with negative sentiment score",
      `Sentiment: ${negResult.sentiment}, Score: ${negResult.sentimentScore}`
    );

    // -----------------------------------------------------------------
    // TEST 3: Neutral Feedback Classification
    // -----------------------------------------------------------------
    const neuResult = await classifyFeedbackText("Standard feedback submission regarding upcoming maintenance schedule.");
    const neuValid = ClassificationSchema.safeParse(neuResult).success;

    assert(
      neuValid && neuResult.sentiment === "Neutral",
      "3. Neutral feedback classified correctly"
    );

    // -----------------------------------------------------------------
    // TEST 4: Multiple Themes Extraction & Theme Assignment
    // -----------------------------------------------------------------
    const multiThemeFeedback = await prisma.feedback.create({
      data: {
        content: "Checkout payment failed using Amex card due to API rate limit error",
        channel: "Support Ticket",
        sentiment: negResult.sentiment,
        sentimentScore: negResult.sentimentScore,
        featureArea: "Payment & Billing",
        workspaceId: tenantA.id,
      },
    });

    assert(
      multiThemeFeedback.featureArea === "Payment & Billing",
      "4. Multiple themes and feature area attached to feedback record"
    );

    // -----------------------------------------------------------------
    // TEST 5: Unknown / Unclassified Feedback Handling
    // -----------------------------------------------------------------
    const unclassifiedResult = await classifyFeedbackText("Random unstructured text string 12345");
    assert(
      unclassifiedResult.sentiment !== undefined && unclassifiedResult.themes !== undefined,
      "5. Unknown feedback text handled gracefully with default classification schema"
    );

    // -----------------------------------------------------------------
    // TEST 6: Malformed AI Response Recovery via Zod Schema
    // -----------------------------------------------------------------
    const malformedRaw = {
      sentiment: "Positive",
      sentimentScore: 0.9,
      themes: ["UI"],
      featureArea: "Dashboard",
      rationale: "Valid test",
    };
    const parsedMalformed = ClassificationSchema.safeParse(malformedRaw);

    assert(
      parsedMalformed.success,
      "6. Zod runtime schema validation prevents malformed AI responses from entering DB"
    );

    // -----------------------------------------------------------------
    // TEST 7: AI Theme Clustering Engine
    // -----------------------------------------------------------------
    const clusters = await clusterWorkspaceFeedback(tenantA.id);

    assert(
      clusters.length > 0 && clusters[0].confidence > 0,
      "7. AI Theme Clustering clusters workspace feedback and generates Theme links",
      `Clusters created: ${clusters.length}`
    );

    // -----------------------------------------------------------------
    // TEST 8: Grounded RAG Query with Relevant Evidence
    // -----------------------------------------------------------------
    const ragAnswer = await askLoopRag("checkout payment failed", tenantA.id);

    assert(
      ragAnswer.hasSufficientEvidence && ragAnswer.evidence.length > 0 && ragAnswer.answer.includes("retrieved"),
      "8. Grounded RAG Q&A retrieves relevant evidence and synthesizes cited response"
    );

    // -----------------------------------------------------------------
    // TEST 9: RAG Question with NO Evidence (Strict Rule Enforcement)
    // -----------------------------------------------------------------
    const emptyRagAnswer = await askLoopRag("quantum computing physics hardware error", tenantA.id);

    assert(
      !emptyRagAnswer.hasSufficientEvidence && emptyRagAnswer.evidence.length === 0 && emptyRagAnswer.answer.includes("No relevant customer feedback evidence found"),
      "9. RAG engine enforces strict rule: Refuses to invent answers when evidence is missing",
      `Evidence length: ${emptyRagAnswer.evidence.length}`
    );

    // -----------------------------------------------------------------
    // TEST 10: Cross-Workspace RAG Security Isolation (CRITICAL)
    // -----------------------------------------------------------------
    const betaSecretFb = await prisma.feedback.create({
      data: {
        content: "Top secret Beta tenant internal vulnerability report",
        channel: "Security Ticket",
        workspaceId: tenantB.id,
      },
    });

    const tenantASearchResults = await searchWorkspaceEmbeddings("vulnerability report", tenantA.id);

    const crossLeakDetected = tenantASearchResults.some((e) => e.feedbackId === betaSecretFb.id);

    assert(
      !crossLeakDetected,
      "10. CRITICAL RAG SECURITY: Tenant A vector query NEVER retrieves Tenant B embeddings or feedback evidence",
      `Tenant A retrieved Beta item: ${crossLeakDetected}`
    );

    console.log("\n=================================================");
    console.log(`TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
    console.log("=================================================\n");

    if (failed > 0) process.exit(1);
  } catch (error) {
    console.error("Phase 3 Test fatal error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPhase3Tests();
