# Beyond the Stateless Prompt: Building an Auditable Product Intelligence Pipeline with Cascadeflow and Hindsight

Pasting a 10,000-line CSV of customer support reviews into a stateless LLM context window is lazy engineering, and the results show it. You get hallucinated aggregates, ignored edge cases, and zero traceability when a stakeholder asks why a critical bug was classified as low priority. 

When building PulseIQ—an enterprise platform designed to synthesize unstructured customer feedback into prioritized engineering action items—we rejected the stateless "dump-everything-into-GPT" pattern. We needed a system that was deterministic where it mattered, semantic where it counted, and fully auditable. We also needed the system to understand time; a complaint about onboarding in version 2.2 has a completely different engineering context than the same complaint in version 1.8.

To solve this, we built a hybrid architecture that integrates [Cascadeflow's orchestration pipeline](https://github.com/lemony-ai/cascadeflow) to process feedback through an explicit, 10-stage evaluation graph, paired with [Hindsight's contextual memory layer](https://github.com/vectorize-io/hindsight) to track sentiment regressions and issue streaks over product version releases.

---

## Gating the Pipeline: Cascadeflow Heuristics

A major pain point of building LLM pipelines is the lack of structural predictability. Raw customer reviews are messy—containing HTML tags, casing noise, and random casing symbols. 

We used [docs.cascadeflow.ai](https://docs.cascadeflow.ai/) as our blueprint for constructing a 10-stage sequence. By enforcing strict TypeScript schemas for each step, we ensure that early stages normalize data deterministically before passing it to expensive semantic evaluation steps.

Here is how the pipeline is orchestrated in [cascadeflow.ts](file:///c:/Users/sirsi/OneDrive/Desktop/PulseIQ/src/lib/cascadeflow.ts):

```typescript
export class CascadeflowEngine {
  private stages: PipelineStage[];

  constructor() {
    this.stages = CascadeflowEngine.getInitialStages();
  }

  public async executePipeline(
    inputText: string,
    onProgress: (stages: PipelineStage[], activeStageId: string | null, currentLog: string, result?: PipelineResult) => void,
    latencyMs: number = 400
  ): Promise<PipelineResult> {
    const activeStages = [...this.stages];
    onProgress(activeStages, 'stage-1', "[Ingest Engine] Raw payload received.");

    // Stage 1: Ingest
    activeStages[0].status = 'processing';
    await this.delay(latencyMs);
    activeStages[0].status = 'completed';

    // Stage 2: Data Cleaning
    activeStages[1].status = 'processing';
    const cleanedText = this.cleanText(inputText);
    onProgress(activeStages, 'stage-2', `[Sanitizer] Cleaned text: "${cleanedText.substring(0, 40)}..."`);
    await this.delay(latencyMs);
    activeStages[1].status = 'completed';

    // Stage 3: NLP Tokenization
    activeStages[2].status = 'processing';
    const tokens = this.extractTokens(cleanedText);
    onProgress(activeStages, 'stage-3', `[Tokenizer] Extracted ${tokens.length} semantic vectors.`);
    await this.delay(latencyMs);
    activeStages[2].status = 'completed';
    
    // ... subsequent stages evaluate sentiment, category and priorities
```

By decoupling these steps, we gain a massive advantage: **independent debugging**. If our tokenization logic fails on non-ASCII characters, we can fix Stage 3 in isolation without touching our downstream sentiment calculations or wasting LLM token costs.

---

## Connecting the Timeline: Hindsight Contextual Memory

Once you have a structured pipeline output, the next challenge is placing it in the context of history. When engineering deploys a new release (say, `v2.1`), we need to immediately understand if customer satisfaction is rising or falling compared to `v2.0` and `v1.9`.

To build this version-pinned memory matrix, we integrated [Hindsight's agent memory principles](https://vectorize.io/what-is-agent-memory). Hindsight tracks persistent records of past feedback analyses and evaluates long-term customer friction trends. Instead of passing an infinitely growing list of past support tickets to the LLM, we use Hindsight's memory store to maintain compiled statistical summaries pinned directly to specific release versions.

Here is the core logic from [hindsight.ts](file:///c:/Users/sirsi/OneDrive/Desktop/PulseIQ/src/lib/hindsight.ts) that calculates version-to-version sentiment drift coefficients:

```typescript
export class HindsightEngine {
  private storageKey = 'pulseiq_hindsight_memory';

  public getSentimentShifts(): Array<{
    previousVersion: string;
    currentVersion: string;
    percentageChange: number;
    shiftType: 'improvement' | 'regression' | 'stable';
    description: string;
  }> {
    const records = this.getRecords();
    const shifts: any[] = [];
    
    const versionRatings: Record<string, { sum: number; count: number }> = {};
    records.forEach(r => {
      if (!versionRatings[r.version]) {
        versionRatings[r.version] = { sum: 0, count: 0 };
      }
      versionRatings[r.version].sum += r.sentimentScore;
      versionRatings[r.version].count += 1;
    });

    const sortedVersions = Object.keys(versionRatings).sort();
    for (let i = 0; i < sortedVersions.length - 1; i++) {
      const prev = sortedVersions[i];
      const curr = sortedVersions[i + 1];
      
      const prevAvg = versionRatings[prev].sum / versionRatings[prev].count;
      const currAvg = versionRatings[curr].sum / versionRatings[curr].count;
      
      const diff = currAvg - prevAvg;
      const percentage = Math.round(Math.abs(diff) * 100);
      
      shifts.push({
        previousVersion: prev,
        currentVersion: curr,
        percentageChange: percentage,
        shiftType: diff < -0.15 ? 'regression' : diff > 0.15 ? 'improvement' : 'stable',
        description: diff < -0.15 
          ? `Sentiment dropped significantly after the release of ${curr}.` 
          : `Sentiment rose steadily after the release of ${curr}.`
      });
    }
    return shifts;
  }
}
```

This logic enables us to answer crucial business questions automatically. If a customer reports a bug, Hindsight scans the memory store, determines if this issue started in `v2.2` or has been a recurring issue since `v1.9`, and triggers a warning if it detects a "streak" of unresolved complaints.

To learn more about implementing similar persistent contexts in your own microservice pipelines, check out the [Hindsight documentation](https://hindsight.vectorize.io/).

---

## Tracing a Live Multi-Factor Authentication Lockout

To see the hybrid Cascadeflow-Hindsight system in action, trace what happens when we feed this support ticket into the platform:
> *"Ever since version 2.1 deployed, the MFA SMS token arrives 20 minutes late, leading to persistent verification lockouts from my corporate workspace! Fix this ASAP!"*

1. **The Cascadeflow Run**: The system normalizes the casing, extracts tokens, maps it to the category `"Authentication"` (Confidence: `0.94`), and calculates a priority score of `92/100` (**HIGH**).
2. **The Hindsight Evaluation**: Because the memory store already has a record of "MFA complaints spiking in `v2.1`" from last week, the system flags a **4-week recurring issue streak** and automatically adjusts the layout's dynamic suggestion:
   * **Suggestion**: *“MFA anomalies have consistently spiked over the last 4 weeks. Twilio SMS OTP gateway is experiencing persistent routing timeouts on the v2.1 path. Immediately deploy fallback SMS-redundancy route or temporarily whitelist corporate workspace IPs.”*

---

## Lessons Learned

1. **Deterministic Gating is Your Shield**: Never send raw user inputs directly to semantic LLM steps. Normalizing casings and filtering HTML tags in early pipeline stages saves token costs and prevents prompt-injection attacks.
2. **State Streams Save the User Experience**: AI processing takes time. Streaming active logs through a terminal-style UI while Cascadeflow runs gives users visual feedback and increases platform confidence.
3. **Stateless Prompts are Useless for Regressions**: To track regressions, you need a dedicated, version-aware agent memory layer. Pinning statistical metadata to release version tags in a persistent buffer like [Vectorize agent memory](https://vectorize.io/what-is-agent-memory) is the only scalable way to detect regressions without inflating LLM context windows.

---

## Conclusion

By moving away from stateless, single-pass prompts and building a hybrid architecture with [Cascadeflow](https://github.com/lemony-ai/cascadeflow) and [Hindsight](https://github.com/vectorize-io/hindsight), we transformed customer complaints from a chaotic swamp of text into a clean, version-aware stream of business decisions.
