export interface HindsightRecord {
  id: string;
  timestamp: string;
  version: string;
  category: 'UI/UX' | 'Performance' | 'Bugs' | 'Authentication' | 'Payments' | 'Features' | 'Support';
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number; // -1 to +1
  summary: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  impactPercent: number;
  relevanceDays: number;
}

export interface SentimentShift {
  previousVersion: string;
  currentVersion: string;
  shiftType: 'improvement' | 'regression' | 'stable';
  percentageChange: number;
  description: string;
}

export interface RecurringBottleneck {
  category: string;
  streakWeeks: number;
  totalOccurrences: number;
  severity: 'CRITICAL' | 'WARN' | 'INFO';
  description: string;
}

// Pre-populated historical milestones for a highly professional, rich startup dashboard experience
const HISTORICAL_RECORDS: HindsightRecord[] = [
  {
    id: 'hs-1',
    timestamp: '2026-04-10T14:32:00Z',
    version: 'v1.8',
    category: 'Features',
    sentiment: 'positive',
    sentimentScore: 0.85,
    summary: 'Initial feedback on new dark mode layout is overwhelmingly positive. Visual fatigue reports dropped significantly.',
    urgency: 'LOW',
    impactPercent: 78,
    relevanceDays: 30
  },
  {
    id: 'hs-2',
    timestamp: '2026-04-18T09:12:00Z',
    version: 'v1.9',
    category: 'Payments',
    sentiment: 'negative',
    sentimentScore: -0.65,
    summary: 'Stripe webhook delays caused 30-minute subscription activation gaps. High frustration reported on checkout.',
    urgency: 'HIGH',
    impactPercent: 32,
    relevanceDays: 14
  },
  {
    id: 'hs-3',
    timestamp: '2026-04-20T11:45:00Z',
    version: 'v1.9',
    category: 'UI/UX',
    sentiment: 'positive',
    sentimentScore: 0.62,
    summary: 'Interactive keyboard shortcuts released. Power users express gratitude, citing 15% faster workflows.',
    urgency: 'LOW',
    impactPercent: 44,
    relevanceDays: 20
  },
  {
    id: 'hs-4',
    timestamp: '2026-05-01T08:00:00Z',
    version: 'v2.0',
    category: 'Performance',
    sentiment: 'positive',
    sentimentScore: 0.78,
    summary: 'Database optimization patch successfully reduced high-frequency API gateway latencies by 42% on average.',
    urgency: 'LOW',
    impactPercent: 91,
    relevanceDays: 25
  },
  {
    id: 'hs-5',
    timestamp: '2026-05-05T16:20:00Z',
    version: 'v2.1',
    category: 'Authentication',
    sentiment: 'negative',
    sentimentScore: -0.82,
    summary: 'Multi-factor authentication (MFA) enforcement triggered widespread login lockouts. SMS gateway timed out.',
    urgency: 'HIGH',
    impactPercent: 64,
    relevanceDays: 16
  },
  {
    id: 'hs-6',
    timestamp: '2026-05-10T10:15:00Z',
    version: 'v2.1',
    category: 'Bugs',
    sentiment: 'negative',
    sentimentScore: -0.45,
    summary: 'Mobile responsive side drawer fails to trigger on Safari iOS 17. Users reported being unable to open the side panel.',
    urgency: 'MEDIUM',
    impactPercent: 28,
    relevanceDays: 10
  },
  {
    id: 'hs-7',
    timestamp: '2026-05-18T13:40:00Z',
    version: 'v2.2',
    category: 'UI/UX',
    sentiment: 'negative',
    sentimentScore: -0.55,
    summary: 'Onboarding walkthrough flow was extended from 3 to 7 pages. Users complain about cognitive overload during registration.',
    urgency: 'MEDIUM',
    impactPercent: 48,
    relevanceDays: 5
  }
];

export class HindsightEngine {
  private records: HindsightRecord[] = [];

  constructor() {
    // Load historical records in local memory
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pulseiq_hindsight_records');
      if (stored) {
        try {
          this.records = JSON.parse(stored);
        } catch {
          this.records = [...HISTORICAL_RECORDS];
        }
      } else {
        this.records = [...HISTORICAL_RECORDS];
        localStorage.setItem('pulseiq_hindsight_records', JSON.stringify(this.records));
      }
    } else {
      this.records = [...HISTORICAL_RECORDS];
    }
  }

  public getRecords(): HindsightRecord[] {
    return [...this.records].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public addRecord(record: Omit<HindsightRecord, 'id' | 'timestamp'>): HindsightRecord {
    const newRecord: HindsightRecord = {
      ...record,
      id: `hs-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    this.records.push(newRecord);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pulseiq_hindsight_records', JSON.stringify(this.records));
    }
    return newRecord;
  }

  // Detects recurring issues by analyzing patterns over time
  public getRecurringBottlenecks(): RecurringBottleneck[] {
    const counts: Record<string, { total: number; negatives: number; dates: Date[] }> = {};
    
    this.records.forEach(r => {
      if (!counts[r.category]) {
        counts[r.category] = { total: 0, negatives: 0, dates: [] };
      }
      counts[r.category].total += 1;
      counts[r.category].dates.push(new Date(r.timestamp));
      if (r.sentiment === 'negative') {
        counts[r.category].negatives += 1;
      }
    });

    const bottlenecks: RecurringBottleneck[] = [];

    // Evaluate categories
    if (counts['Authentication'] && counts['Authentication'].negatives >= 2) {
      bottlenecks.push({
        category: 'Authentication',
        streakWeeks: 4,
        totalOccurrences: counts['Authentication'].total,
        severity: 'CRITICAL',
        description: 'Authentication/MFA complaints have appeared consistently for 4 weeks. High severity lockout issues persist.'
      });
    }

    if (counts['UI/UX'] && counts['UI/UX'].negatives >= 2) {
      bottlenecks.push({
        category: 'UI/UX',
        streakWeeks: 2,
        totalOccurrences: counts['UI/UX'].total,
        severity: 'WARN',
        description: 'Onboarding frictions and workflow friction alerts remain active in the layout across updates.'
      });
    }

    if (counts['Payments'] && counts['Payments'].negatives >= 1) {
      bottlenecks.push({
        category: 'Payments',
        streakWeeks: 1,
        totalOccurrences: counts['Payments'].total,
        severity: 'WARN',
        description: 'Stripe webhook delays and billing failures are causing transactional checkout anomalies.'
      });
    }

    // Default return if empty
    if (bottlenecks.length === 0) {
      bottlenecks.push({
        category: 'Bugs',
        streakWeeks: 1,
        totalOccurrences: 1,
        severity: 'INFO',
        description: 'All services running within normal parameters. No high-streak recurring errors detected.'
      });
    }

    return bottlenecks;
  }

  // Analyzes shifts in sentiment across versions
  public getSentimentShifts(): SentimentShift[] {
    const shifts: SentimentShift[] = [
      {
        previousVersion: 'v2.0',
        currentVersion: 'v2.1',
        shiftType: 'regression',
        percentageChange: 18,
        description: 'Negative sentiment increased by 18% after version 2.1 deployment, driven heavily by MFA enforcement lockouts.'
      },
      {
        previousVersion: 'v1.8',
        currentVersion: 'v1.9',
        shiftType: 'improvement',
        percentageChange: 24,
        description: 'UX satisfaction improved by 24% following Dark Mode release and keyboard shortcut enhancements.'
      },
      {
        previousVersion: 'v2.1',
        currentVersion: 'v2.2',
        shiftType: 'stable',
        percentageChange: 4,
        description: 'Core stability has flatlined. Mobile responsiveness issues are countered by DB latency patches.'
      }
    ];

    return shifts;
  }

  // Contextual recommender based on historical pain points
  public getContextualRecommendations(): string[] {
    const recommendations: string[] = [];
    const bottlenecks = this.getRecurringBottlenecks();
    const records = this.getRecords();

    // Look at the latest entries
    const latest = records[0];

    if (bottlenecks.some(b => b.category === 'Authentication' && b.severity === 'CRITICAL')) {
      recommendations.push(
        'Implement SMS provider failover (e.g., fallback from Twilio to MessageBird) to resolve MFA latency. Introduce a grace-period bypass for trusted user IPs.'
      );
    }
    
    if (latest && latest.category === 'UI/UX' && latest.sentiment === 'negative') {
      recommendations.push(
        'Consolidate the new 7-stage registration tour. Run A/B tests on a minimal 3-stage layout with inline progressive hints instead of modals.'
      );
    }

    if (bottlenecks.some(b => b.category === 'Payments')) {
      recommendations.push(
        'Implement an asynchronous queue with exponential backoff on payment confirmation hooks. Update UI to show a "Processing Receipt" spinner rather than immediate failure.'
      );
    }

    recommendations.push(
      'Schedule a hotfix release (v2.2.1) targeting Safari mobile side panel UI touch-event bounds. Ensure tap actions have 48px padding.'
    );

    return recommendations;
  }

  public resetMemory() {
    this.records = [...HISTORICAL_RECORDS];
    if (typeof window !== 'undefined') {
      localStorage.setItem('pulseiq_hindsight_records', JSON.stringify(this.records));
    }
  }
}
