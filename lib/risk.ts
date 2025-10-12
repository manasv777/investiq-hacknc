export interface RiskQuestion {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
    score: number;
  }[];
}

export const RISK_QUESTIONS: RiskQuestion[] = [
  {
    id: "q1",
    question: "If you invested $1,000 today and it dropped to $800 next month, what would you do?",
    options: [
      {
        value: "sell",
        label: "Sell immediately to prevent more loss",
        score: 1,
      },
      {
        value: "hold",
        label: "Hold and wait for recovery",
        score: 2,
      },
      {
        value: "buy-more",
        label: "Buy more while prices are lower",
        score: 3,
      },
    ],
  },
  {
    id: "q2",
    question: "What's your primary investment goal?",
    options: [
      {
        value: "preserve",
        label: "Preserve my money safely",
        score: 1,
      },
      {
        value: "grow-steady",
        label: "Grow my money steadily over time",
        score: 2,
      },
      {
        value: "maximize",
        label: "Maximize growth even with higher risk",
        score: 3,
      },
    ],
  },
  {
    id: "q3",
    question: "How long do you plan to keep your money invested before you need it?",
    options: [
      {
        value: "short",
        label: "Less than 2 years",
        score: 1,
      },
      {
        value: "medium",
        label: "2-5 years",
        score: 2,
      },
      {
        value: "long",
        label: "More than 5 years",
        score: 3,
      },
    ],
  },
];

export function calculateRiskScore(answers: Record<string, string>): number {
  let totalScore = 0;
  
  Object.entries(answers).forEach(([questionId, answerValue]) => {
    const question = RISK_QUESTIONS.find((q) => q.id === questionId);
    if (question) {
      const option = question.options.find((opt) => opt.value === answerValue);
      if (option) {
        totalScore += option.score;
      }
    }
  });
  
  return totalScore;
}

export function getRiskTolerance(score: number): "low" | "moderate" | "high" {
  if (score <= 3) return "low";
  if (score <= 6) return "moderate";
  return "high";
}


