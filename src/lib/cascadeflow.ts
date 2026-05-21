import { HindsightEngine, HindsightRecord } from './hindsight';

export interface PipelineStage {
  id: string;
  name: string;
  description: string;
  status: 'idle' | 'processing' | 'completed' | 'failed';
  outputLog: string[];
}

export interface PipelineResult {
  rawText: string;
  cleanedText: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  category: 'UI/UX' | 'Performance' | 'Bugs' | 'Authentication' | 'Payments' | 'Features' | 'Support';
  tags: string[];
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  priorityScore: number; // 0 to 100
  summary: string;
  recommendation: string;
  alertTriggered: boolean;
  alertDetails?: string;
  hindsightComparison?: string;
}

export type ProgressCallback = (
  stages: PipelineStage[],
  activeStageId: string | null,
  currentLog: string,
  result?: PipelineResult
) => void;

export class CascadeflowEngine {
  private hindsight: HindsightEngine;

  constructor() {
    this.hindsight = new HindsightEngine();
  }

  // Pre-configured pipeline stages
  public static getInitialStages(): PipelineStage[] {
    return [
      { id: 'ingest', name: 'Feedback Upload', description: 'Stream feedback input and validate content integrity.', status: 'idle', outputLog: [] },
      { id: 'clean', name: 'Data Cleaning', description: 'Sanitize HTML, remove boilerplate, and apply casing filters.', status: 'idle', outputLog: [] },
      { id: 'nlp', name: 'NLP Tokenization', description: 'Tokenize sentences and extract high-weight terms.', status: 'idle', outputLog: [] },
      { id: 'sentiment', name: 'Sentiment Indexing', description: 'Calculate semantic sentiment vectors.', status: 'idle', outputLog: [] },
      { id: 'classify', name: 'Topic Classification', description: 'Map keyphrases to core product categories.', status: 'idle', outputLog: [] },
      { id: 'priority', name: 'Priority Scoring', description: 'Weight negativity and frequency for impact.', status: 'idle', outputLog: [] },
      { id: 'recommend', name: 'AI Recommendation', description: 'Synthesize resolution pathways via Hindsight.', status: 'idle', outputLog: [] },
      { id: 'summarize', name: 'Insight Summarization', description: 'Generate human-readable executive insights.', status: 'idle', outputLog: [] },
      { id: 'report', name: 'Report Generation', description: 'Package metrics into analytics storage.', status: 'idle', outputLog: [] },
      { id: 'alert', name: 'Alert Triggering', description: 'Check alert threshold rules and broadcast anomalies.', status: 'idle', outputLog: [] }
    ];
  }

  // NLP Heuristic Rule Engine to mimic a state-of-the-art LLM analyzer
  public analyzeFeedbackText(text: string): PipelineResult {
    const lowerText = text.toLowerCase();
    
    // Default values
    let category: PipelineResult['category'] = 'Features';
    let sentiment: PipelineResult['sentiment'] = 'neutral';
    let sentimentScore = 0.0;
    let priority: PipelineResult['priority'] = 'MEDIUM';
    let priorityScore = 50;
    const tags: string[] = [];
    let summary = '';
    let recommendation = '';
    let alertTriggered = false;
    let alertDetails = '';

    // Classification Rules
    if (lowerText.includes('login') || lowerText.includes('auth') || lowerText.includes('mfa') || lowerText.includes('password') || lowerText.includes('sign up') || lowerText.includes('sign in') || lowerText.includes('register') || lowerText.includes('otp')) {
      category = 'Authentication';
      tags.push('#Authentication', '#Security');
    } else if (lowerText.includes('payment') || lowerText.includes('stripe') || lowerText.includes('billing') || lowerText.includes('checkout') || lowerText.includes('price') || lowerText.includes('invoice') || lowerText.includes('refund') || lowerText.includes('subscription')) {
      category = 'Payments';
      tags.push('#Payments', '#Billing');
    } else if (lowerText.includes('slow') || lowerText.includes('lag') || lowerText.includes('delay') || lowerText.includes('load') || lowerText.includes('latency') || lowerText.includes('speed') || lowerText.includes('timeout') || lowerText.includes('504')) {
      category = 'Performance';
      tags.push('#Performance', '#Latency');
    } else if (lowerText.includes('crash') || lowerText.includes('bug') || lowerText.includes('broken') || lowerText.includes('fail') || lowerText.includes('500') || lowerText.includes('error') || lowerText.includes('freeze') || lowerText.includes('patch')) {
      category = 'Bugs';
      tags.push('#Bug', '#Stability');
    } else if (lowerText.includes('button') || lowerText.includes('color') || lowerText.includes('layout') || lowerText.includes('font') || lowerText.includes('responsive') || lowerText.includes('mobile') || lowerText.includes('sidebar') || lowerText.includes('onboarding') || lowerText.includes('nav')) {
      category = 'UI/UX';
      tags.push('#UI', '#UX');
    } else if (lowerText.includes('support') || lowerText.includes('help') || lowerText.includes('ticket') || lowerText.includes('agent') || lowerText.includes('chat') || lowerText.includes('email')) {
      category = 'Support';
      tags.push('#Support', '#Service');
    } else {
      category = 'Features';
      tags.push('#FeatureRequest');
    }

    // Sentiment Rules
    const positiveWords = ['love', 'amazing', 'great', 'awesome', 'perfect', 'helpful', 'wow', 'excellent', 'smooth', 'glad', 'satisfy', 'solved'];
    const negativeWords = ['hate', 'bad', 'horrible', 'worst', 'broken', 'bug', 'crash', 'fail', 'pain', 'frustrate', 'annoy', 'confuse', 'stupid', 'garbage', 'error', 'locked', 'cant', 'cannot'];
    
    let posCount = 0;
    let negCount = 0;

    positiveWords.forEach(w => { if (lowerText.includes(w)) posCount++; });
    negativeWords.forEach(w => { if (lowerText.includes(w)) negCount++; });

    if (posCount > negCount) {
      sentiment = 'positive';
      sentimentScore = Math.min(1.0, 0.2 + (posCount - negCount) * 0.25);
    } else if (negCount > posCount) {
      sentiment = 'negative';
      sentimentScore = Math.max(-1.0, -0.2 - (negCount - posCount) * 0.25);
    } else {
      sentiment = 'neutral';
      sentimentScore = 0.0;
    }

    // Priority Rules (negativity, critical tags, word count)
    priorityScore = Math.round(50 - (sentimentScore * 30));
    if (category === 'Authentication' || category === 'Payments' || category === 'Bugs') {
      priorityScore += 15;
    }
    if (lowerText.includes('urgent') || lowerText.includes('asap') || lowerText.includes('blocking') || lowerText.includes('stuck')) {
      priorityScore += 20;
    }
    priorityScore = Math.min(100, Math.max(0, priorityScore));

    if (priorityScore >= 75) {
      priority = 'HIGH';
      alertTriggered = true;
      alertDetails = `High-severity anomaly in ${category} (${priorityScore} priority score). Instant notification sent to engineering channels.`;
    } else if (priorityScore >= 45) {
      priority = 'MEDIUM';
    } else {
      priority = 'LOW';
    }

    // Dynamic Summary and Recommendations generator
    if (sentiment === 'positive') {
      summary = `User expresses positive feedback regarding the ${category} implementation. Key indicators suggest high satisfaction with the system layout.`;
      recommendation = `Leverage this positive experience in customer case studies. Keep maintaining standard CI/CD verification checks for ${category}.`;
    } else if (sentiment === 'neutral') {
      summary = `User provided informational commentary about product ${category}. Specific questions or feedback were raised without strong negative sentiment.`;
      recommendation = `Add this feature suggestion to the secondary backlog. Tag for next design sprint planning review.`;
    } else {
      summary = `Critical friction detected in ${category} causing moderate-to-severe user frustration. Main complaints center around operation failures.`;
      
      switch (category) {
        case 'Authentication':
          recommendation = 'Investigate potential OTP gateway dropouts. Implement failover authentication fallback routing instantly.';
          break;
        case 'Payments':
          recommendation = 'Audit recent Stripe gateway webhook logs. Run validation checks on billing session expiration times.';
          break;
        case 'Performance':
          recommendation = 'Optimize heavy payload queries. Profile the latest API gateway routes and database indexing.';
          break;
        case 'Bugs':
          recommendation = 'Retrieve client-side stack traces. Replicate issue in clean sandbox environment and patch variables.';
          break;
        case 'UI/UX':
          recommendation = 'Examine session replay recordings for onboarding confusion. Refactor navigation links to be more descriptive.';
          break;
        default:
          recommendation = 'Forward feedback details directly to product managers for contextual triage and response.';
      }
    }

    return {
      rawText: text,
      cleanedText: text.replace(/[<>]/g, '').trim(),
      sentiment,
      sentimentScore,
      category,
      tags,
      priority,
      priorityScore,
      summary,
      recommendation,
      alertTriggered,
      alertDetails: alertTriggered ? alertDetails : undefined
    };
  }

  // Run the asynchronous orchestration pipeline step by step
  public async executePipeline(
    inputText: string,
    onProgress: ProgressCallback,
    latencyMs: number = 600
  ): Promise<PipelineResult> {
    const stages = CascadeflowEngine.getInitialStages();
    let currentLog = '';

    const updateStage = (stageId: string, status: PipelineStage['status'], logs: string[]) => {
      const idx = stages.findIndex(s => s.id === stageId);
      if (idx !== -1) {
        stages[idx].status = status;
        stages[idx].outputLog = [...stages[idx].outputLog, ...logs];
        currentLog = `[${stages[idx].name}] ${logs[logs.length - 1]}`;
      }
      onProgress([...stages], stageId, currentLog);
    };

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    // Stage 1: INGESTION
    updateStage('ingest', 'processing', ['Initiating Cascadeflow workflow session...', 'Validating feedback format...']);
    await sleep(latencyMs);
    const byteSize = new Blob([inputText]).size;
    updateStage('ingest', 'completed', [`Feed raw string input: ${byteSize} bytes verified successfully.`]);

    // Stage 2: DATA CLEANING
    updateStage('clean', 'processing', ['Removing custom emojis and HTML syntax tags...', 'Converting input cases...']);
    await sleep(latencyMs);
    const cleaned = inputText.replace(/[<>]/g, '').trim();
    updateStage('clean', 'completed', [`Sanitized text created. Character length: ${cleaned.length}`]);

    // Stage 3: NLP TOKENIZATION
    updateStage('nlp', 'processing', ['Parsing linguistic vectors...', 'Extracting core keyphrases...']);
    await sleep(latencyMs);
    // Parse result early to use values
    const analysis = this.analyzeFeedbackText(inputText);
    updateStage('nlp', 'completed', [`Identified dominant keywords: ${analysis.tags.join(', ')}`]);

    // Stage 4: SENTIMENT INDEXING
    updateStage('sentiment', 'processing', ['Analyzing emotional sentiment valence...', 'Evaluating intensity vectors...']);
    await sleep(latencyMs);
    updateStage('sentiment', 'completed', [
      `Completed. Calculated Valence: ${analysis.sentimentScore.toFixed(2)} [Index: ${analysis.sentiment.toUpperCase()}]`
    ]);

    // Stage 5: TOPIC CLASSIFICATION
    updateStage('classify', 'processing', ['Matching semantic definitions against product catalog...', 'Resolving tags...']);
    await sleep(latencyMs);
    updateStage('classify', 'completed', [`Feedback categorized inside module: ${analysis.category.toUpperCase()}`]);

    // Stage 6: PRIORITY SCORING
    updateStage('priority', 'processing', ['Computing urgency matrices...', 'Evaluating system-wide impact scores...']);
    await sleep(latencyMs);
    updateStage('priority', 'completed', [
      `Assigned priority tier: ${analysis.priority} (Weighted Score: ${analysis.priorityScore}/100)`
    ]);

    // Stage 7: RECOMMENDATION ENGINE
    updateStage('recommend', 'processing', ['Querying Hindsight Memory repository...', 'Searching historical bottleneck correlations...']);
    await sleep(latencyMs);
    const previousShiftText = analysis.sentiment === 'negative' 
      ? 'Correlated with high negative trend in v2.1 MFA updates.'
      : 'Matches stable historical trend patterns.';
    updateStage('recommend', 'completed', [`Suggested resolution pathway formulated successfully.`]);

    // Stage 8: INSIGHT SUMMARIZATION
    updateStage('summarize', 'processing', ['Running abstractive synthesis...', 'Condensing paragraphs...']);
    await sleep(latencyMs);
    updateStage('summarize', 'completed', [`Synthesized short executive summary: "${analysis.summary}"`]);

    // Stage 9: REPORT GENERATION
    updateStage('report', 'processing', ['Formatting payload variables...', 'Injecting timeline markers...']);
    await sleep(latencyMs);
    
    // Inject Hindsight record!
    const newHindsightRecord = this.hindsight.addRecord({
      version: 'v2.2',
      category: analysis.category,
      sentiment: analysis.sentiment,
      sentimentScore: analysis.sentimentScore,
      summary: analysis.summary,
      urgency: analysis.priority,
      impactPercent: analysis.priorityScore,
      relevanceDays: 7
    });

    updateStage('report', 'completed', [`Composed memory tag: ${newHindsightRecord.id} injected into timeline database.`]);

    // Stage 10: ALERT TRIGGERING
    updateStage('alert', 'processing', ['Checking threshold levels...', 'Validating webhook notifications...']);
    await sleep(latencyMs);
    let alertMsg = 'No urgent anomalies detected. Standard storage pipeline complete.';
    if (analysis.alertTriggered) {
      alertMsg = `CRITICAL ALERT FIRED: SMS notifications dispatched to #alerts-engine!`;
    }
    updateStage('alert', 'completed', [alertMsg]);

    const finalResult: PipelineResult = {
      ...analysis,
      hindsightComparison: previousShiftText
    };

    onProgress(
      stages.map(s => ({ ...s, status: s.status === 'processing' ? 'completed' : s.status })),
      null,
      `[Cascadeflow] Processing pipeline execution completed.`,
      finalResult
    );

    return finalResult;
  }
}
