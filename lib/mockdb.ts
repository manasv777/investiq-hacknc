import { OnboardingData, AuditLog, ChatMessage } from "./schemas";

// In-memory mock database
class MockDatabase {
  private userProfiles: Map<string, any> = new Map();
  private onboardingLogs: Map<string, any[]> = new Map();
  private faqLogs: any[] = [];
  private auditLogs: AuditLog[] = [];
  private sessions: Map<string, OnboardingData> = new Map();
  private chatHistory: Map<string, ChatMessage[]> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed some sample sessions for dashboard
    const sampleSessions: OnboardingData[] = [
      {
        sessionId: "session-001",
        userId: "user-001",
        firstName: "Alex",
        lastName: "Johnson",
        email: "alex@example.com",
        currentStep: "G",
        completedSteps: ["A", "B", "C", "D", "E", "F"],
        startedAt: new Date(Date.now() - 86400000).toISOString(),
        riskTolerance: "moderate",
        experienceLevel: "beginner",
      },
      {
        sessionId: "session-002",
        userId: "user-002",
        firstName: "Jordan",
        lastName: "Smith",
        email: "jordan@example.com",
        currentStep: "D",
        completedSteps: ["A", "B", "C"],
        startedAt: new Date(Date.now() - 172800000).toISOString(),
        riskTolerance: "low",
        experienceLevel: "beginner",
      },
      {
        sessionId: "session-003",
        userId: "user-003",
        firstName: "Taylor",
        lastName: "Williams",
        email: "taylor@example.com",
        currentStep: "G",
        completedSteps: ["A", "B", "C", "D", "E", "F", "G"],
        startedAt: new Date(Date.now() - 259200000).toISOString(),
        completedAt: new Date(Date.now() - 259000000).toISOString(),
        riskTolerance: "high",
        experienceLevel: "intermediate",
      },
    ];

    sampleSessions.forEach((session) => {
      this.sessions.set(session.sessionId, session);
    });

    // Seed FAQ logs
    this.faqLogs = [
      {
        sessionId: "session-001",
        userQuery: "Why do you need my SSN?",
        aiReply: "Your Social Security Number is required by federal law...",
        category: "Security",
        timestamp: new Date().toISOString(),
      },
      {
        sessionId: "session-002",
        userQuery: "What is a Roth IRA?",
        aiReply: "A Roth IRA is a retirement savings account...",
        category: "Education",
        timestamp: new Date().toISOString(),
      },
      {
        sessionId: "session-003",
        userQuery: "What is risk tolerance?",
        aiReply: "Risk tolerance is how comfortable you are with market ups and downs...",
        category: "Risk",
        timestamp: new Date().toISOString(),
      },
    ];
  }

  // User Profile methods
  async createUserProfile(data: any) {
    this.userProfiles.set(data.userId, {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return data;
  }

  async getUserProfile(userId: string) {
    return this.userProfiles.get(userId);
  }

  // Onboarding Log methods
  async appendOnboardingLog(log: any) {
    const logs = this.onboardingLogs.get(log.sessionId) || [];
    logs.push({
      ...log,
      timestamp: new Date().toISOString(),
    });
    this.onboardingLogs.set(log.sessionId, logs);
    return log;
  }

  async getOnboardingLogs(sessionId: string) {
    return this.onboardingLogs.get(sessionId) || [];
  }

  // FAQ Log methods
  async appendFaqLog(log: any) {
    this.faqLogs.push({
      ...log,
      timestamp: new Date().toISOString(),
    });
    return log;
  }

  async getFaqLogs() {
    return this.faqLogs;
  }

  // Audit Log methods
  async appendAuditLog(log: AuditLog) {
    this.auditLogs.push(log);
    return log;
  }

  async getAuditLogs(sessionId?: string) {
    if (sessionId) {
      return this.auditLogs.filter((log) => log.sessionId === sessionId);
    }
    return this.auditLogs;
  }

  // Session methods
  async createSession(sessionData: OnboardingData) {
    this.sessions.set(sessionData.sessionId, {
      ...sessionData,
      startedAt: new Date().toISOString(),
    });
    return sessionData;
  }

  async updateSession(sessionId: string, updates: Partial<OnboardingData>) {
    const existing = this.sessions.get(sessionId);
    if (existing) {
      const updated = { ...existing, ...updates };
      this.sessions.set(sessionId, updated);
      return updated;
    }
    return null;
  }

  async getSession(sessionId: string) {
    return this.sessions.get(sessionId);
  }

  async getAllSessions() {
    return Array.from(this.sessions.values());
  }

  // Chat History methods
  async appendChatMessage(sessionId: string, message: ChatMessage) {
    const history = this.chatHistory.get(sessionId) || [];
    history.push(message);
    this.chatHistory.set(sessionId, history);
    return message;
  }

  async getChatHistory(sessionId: string) {
    return this.chatHistory.get(sessionId) || [];
  }

  // Analytics methods
  async getStepFunnel() {
    const funnel: Record<string, number> = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
      F: 0,
      G: 0,
    };

    this.sessions.forEach((session) => {
      session.completedSteps?.forEach((step) => {
        funnel[step]++;
      });
    });

    return funnel;
  }

  async getTopFAQs(limit: number = 5) {
    const faqCounts: Record<string, number> = {};
    
    this.faqLogs.forEach((log) => {
      const key = log.userQuery.toLowerCase();
      faqCounts[key] = (faqCounts[key] || 0) + 1;
    });

    return Object.entries(faqCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([query, count]) => ({ query, count }));
  }

  async getExperienceDistribution() {
    const distribution: Record<string, number> = {
      beginner: 0,
      intermediate: 0,
      advanced: 0,
    };

    this.sessions.forEach((session) => {
      if (session.experienceLevel) {
        distribution[session.experienceLevel]++;
      }
    });

    return distribution;
  }
}

// Singleton instance
export const mockDb = new MockDatabase();


