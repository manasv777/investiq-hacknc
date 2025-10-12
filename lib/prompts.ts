export const SYSTEM_PROMPT = `You are a calm, friendly financial guidance assistant helping first-time investors open their first investment account. 

Guidelines:
- Keep responses concise (≤120 words)
- Use grade 6-8 reading level
- Be warm and encouraging
- Explain financial terms simply
- Never use jargon without explanation
- Always emphasize that this is educational/demo content
- Maintain a calm, patient tone`;

export function EXPLAIN_STEP(stepId: string, context?: any): string {
  const explanations: Record<string, string> = {
    accountType: `You'll choose between two account types. "Stocks & Funds" lets you invest in company shares and mutual funds. "Stocks, Funds & Crypto" adds cryptocurrency like Bitcoin. Most beginners start with Stocks & Funds to learn the basics first. You can always add crypto access later.`,
    
    basics: `We need your legal name (as it appears on your ID) and contact information. This helps us verify your identity and send you important account updates. Your preferred name is what you'll see when you log in—it can be a nickname if you'd like.`,
    
    military: `If you've served in the U.S. military, you may qualify for special benefits or reduced fees. We'll ask which branch you served in and your current status. This is optional but can help you save money on your investments.`,
    
    ssn: `Your Social Security Number is required by federal law to verify your identity and report investment earnings to the IRS. This is standard for all U.S. brokerage accounts. We use bank-level encryption to protect your information.`,
    
    dob: `We need your date of birth to verify your identity and ensure you meet the age requirement (18+) to open a brokerage account. This also helps us provide age-appropriate investment recommendations.`,
    
    citizenship: `U.S. citizenship or residency status determines your tax treatment and reporting requirements. Non-U.S. citizens may have different withholding rules. This is required by federal regulations.`,
    
    address: `Your residential address is used for identity verification and to send important legal documents. Make sure it matches the address on your government-issued ID for faster verification.`,
    
    employment: `Federal regulations require us to collect your employment information. If you or anyone in your household works for a financial institution, we need to know for compliance purposes. This prevents potential conflicts of interest.`,
    
    restrictedPerson: `If you serve on the board of directors, hold a policy-making position, or own 10% or more of a publicly traded company, federal rules may restrict your account opening. This prevents insider trading and conflicts of interest.`,
    
    trustedContact: `A trusted contact is someone we can reach if we're unable to contact you or notice suspicious activity on your account. This is optional but recommended. They cannot access your account or make transactions—they're just an emergency contact.`,
    
    review: `Please review all the information you've provided. Make sure everything is accurate—especially your legal name, Social Security Number, and address. Once you confirm, we'll submit your application for review.`,
  };
  
  return explanations[stepId] || `This step helps us gather necessary information to open your account safely and in compliance with financial regulations.`;
}

export function RISK_Q(n: number): string {
  const questions = [
    "If you invested $1,000 today and it dropped to $800 next month, what would you do? (A) Sell immediately to prevent more loss, (B) Hold and wait for recovery, or (C) Buy more while prices are lower?",
    "What's your primary investment goal? (A) Preserve my money safely, (B) Grow my money steadily over time, or (C) Maximize growth even with higher risk?",
    "How long do you plan to keep your money invested before you need it? (A) Less than 2 years, (B) 2-5 years, or (C) More than 5 years?",
  ];
  
  return questions[n - 1] || questions[0];
}

export function RISK_SUMMARY(score: number): string {
  if (score <= 3) {
    return `Based on your answers, you appear to have a **conservative** risk tolerance. You prefer stability and protecting your principal. Consider starting with bonds, dividend stocks, or balanced funds. Remember: lower risk often means slower growth.`;
  } else if (score <= 6) {
    return `Based on your answers, you have a **moderate** risk tolerance. You're comfortable with some market ups and downs for steady growth. A mix of stocks and bonds (like 60/40) could work well. This is the most common approach for beginners.`;
  } else {
    return `Based on your answers, you have an **aggressive** risk tolerance. You're comfortable with volatility for higher potential returns. Consider a stock-focused portfolio, but remember to stay diversified and invest only money you won't need soon.`;
  }
}

export function TERM_EXPLAINER(term: string): string {
  const terms: Record<string, string> = {
    "roth ira": "A Roth IRA is a retirement savings account where you contribute money you've already paid taxes on. The benefit? Your investments grow tax-free, and you won't pay taxes when you withdraw in retirement. It's like planting a tree—you pay the cost upfront, then enjoy the fruit forever.",
    
    "etf": "An ETF (Exchange-Traded Fund) is like a basket of investments you can buy in one purchase. Instead of picking individual stocks, you get instant diversification. For example, an S&P 500 ETF holds pieces of 500 large companies. It trades like a stock but spreads your risk.",
    
    "diversification": "Diversification means spreading your money across different investments instead of putting it all in one place. It's the 'don't put all your eggs in one basket' principle. If one investment drops, others may stay stable or rise, protecting your overall portfolio.",
    
    "dollar-cost averaging": "Dollar-cost averaging means investing a fixed amount regularly (like $100 every month) regardless of market price. When prices are high, you buy less; when low, you buy more. This smooths out market ups and downs and removes the stress of timing the market perfectly.",
    
    "index fund": "An index fund is an investment that tracks a market index like the S&P 500. Instead of a manager picking stocks, it automatically mirrors the index. They have low fees and have historically outperformed most actively managed funds over time.",
    
    "compound interest": "Compound interest is when your investment earnings start earning their own returns. It's growth on top of growth. For example, if you earn 7% on $1,000, you have $1,070. Next year, you earn 7% on $1,070, not just $1,000. Time is your superpower here.",
    
    "expense ratio": "An expense ratio is the annual fee a fund charges, shown as a percentage. A 0.10% expense ratio means you pay $1 per year for every $1,000 invested. Lower is better because fees compound against you over time, eating into your returns.",
    
    "bull market": "A bull market is when stock prices are rising or expected to rise. It's called 'bull' because bulls thrust their horns upward. During bull markets, investors feel optimistic and confident. But remember, what goes up can come down—stay balanced.",
    
    "bear market": "A bear market is when stock prices fall 20% or more from recent highs. It's called 'bear' because bears swipe downward. These can feel scary, but historically, markets have always recovered. Long-term investors often see bears as buying opportunities.",
    
    "dividend": "A dividend is a cash payment some companies give to shareholders from their profits. It's like getting a small paycheck for owning the stock. You can reinvest dividends to buy more shares or take them as income. Dividend stocks are popular for steady income.",
  };
  
  const termLower = term.toLowerCase();
  return terms[termLower] || `${term} is an important financial concept. It refers to a key idea in investing and personal finance that can help you build wealth over time.`;
}

export function WELCOME_MESSAGE(): string {
  return `Hi! I'm here to guide you through opening your first investment account. This process usually takes about 10 minutes. I'll explain each step, answer questions, and make sure you feel confident. You can type or use the microphone button to talk with me. Ready to get started?`;
}

export function STEP_TRANSITION(fromStep: string, toStep: string): string {
  return `Great! Now let's move on to the next section. I'll help you through each field.`;
}


