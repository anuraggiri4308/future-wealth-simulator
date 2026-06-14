export interface CalculationResult {
  targetAmount: number;
  monthlyInvestment: number;
  annualReturn: number;
  yearsToGoal: number;
  monthsToGoal: number;
  targetDate: Date;
  totalInvestment: number;
  totalReturns: number;
  milestones: Milestone[];
}

export interface Milestone {
  amount: number;
  date: Date;
  yearsFromNow: number;
  monthsFromNow: number;
  formattedDate: string;
}

export interface FutureProfile {
  age: number;
  portfolioValue: number;
  totalInvested: number;
}

export interface StepUpOption {
  percentage: number;
  yearsToGoal: number;
  monthsToGoal: number;
  totalInvestment: number;
  yearsSaved: number;
}

export interface IncreaseOption {
  percentage: number;
  increaseAmount: number;
  newMonthlyInvestment: number;
  yearsToGoal: number;
  monthsToGoal: number;
  yearsSaved: number;
}

export function calculateSIP(
  targetAmount: number,
  monthlyInvestment: number,
  annualReturn: number = 0.12
): CalculationResult {
  const monthlyRate = annualReturn / 12;
  let months = 0;
  let currentValue = 0;

  while (currentValue < targetAmount && months < 1200) {
    currentValue = currentValue * (1 + monthlyRate) + monthlyInvestment;
    months++;
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + months);

  const totalInvestment = monthlyInvestment * months;
  const totalReturns = targetAmount - totalInvestment;

  const milestones = calculateMilestones(
    targetAmount,
    monthlyInvestment,
    annualReturn,
    years,
    remainingMonths
  );

  return {
    targetAmount,
    monthlyInvestment,
    annualReturn,
    yearsToGoal: years,
    monthsToGoal: remainingMonths,
    targetDate,
    totalInvestment: Math.round(totalInvestment),
    totalReturns: Math.round(totalReturns),
    milestones,
  };
}

function calculateMilestones(
  targetAmount: number,
  monthlyInvestment: number,
  annualReturn: number,
  totalYears: number,
  totalMonths: number
): Milestone[] {
  const milestones: Milestone[] = [];
  const milestoneAmounts = [
    100000,
    500000,
    1000000,
    2500000,
    5000000,
    7500000,
    targetAmount,
  ];

  const uniqueAmounts = [
    ...new Set(milestoneAmounts.filter((a) => a <= targetAmount)),
  ].sort((a, b) => a - b);

  const monthlyRate = annualReturn / 12;

  uniqueAmounts.forEach((amount) => {
    let months = 0;
    let currentValue = 0;

    while (currentValue < amount && months < 1200) {
      currentValue = currentValue * (1 + monthlyRate) + monthlyInvestment;
      months++;
    }

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    const date = new Date();
    date.setMonth(date.getMonth() + months);

    milestones.push({
      amount,
      date,
      yearsFromNow: years,
      monthsFromNow: remainingMonths,
      formattedDate: formatTargetDate(date),
    });
  });

  return milestones;
}

export function calculateStepUpOptions(
  targetAmount: number,
  monthlyInvestment: number,
  annualReturn: number = 0.12
): StepUpOption[] {
  const baseResult = calculateSIP(
    targetAmount,
    monthlyInvestment,
    annualReturn
  );
  const stepUpPercentages = [0, 5, 10, 15];

  return stepUpPercentages.map((percentage) => {
    if (percentage === 0) {
      return {
        percentage: 0,
        yearsToGoal: baseResult.yearsToGoal,
        monthsToGoal: baseResult.monthsToGoal,
        totalInvestment: baseResult.totalInvestment,
        yearsSaved: 0,
      };
    }

    const monthlyRate = annualReturn / 12;
    let months = 0;
    let currentValue = 0;
    let currentSIP = monthlyInvestment;
    let totalInvested = 0;

    while (currentValue < targetAmount && months < 1200) {
      currentValue = currentValue * (1 + monthlyRate) + currentSIP;
      totalInvested += currentSIP;
      months++;

      if (months % 12 === 0) {
        currentSIP = currentSIP * (1 + percentage / 100);
      }
    }

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    const yearsSaved =
      baseResult.yearsToGoal * 12 + baseResult.monthsToGoal - months;

    return {
      percentage,
      yearsToGoal: years,
      monthsToGoal: remainingMonths,
      totalInvestment: Math.round(totalInvested),
      yearsSaved: Math.round((yearsSaved / 12) * 10) / 10,
    };
  });
}

export function calculateIncreaseOptions(
  targetAmount: number,
  monthlyInvestment: number,
  annualReturn: number = 0.12
): IncreaseOption[] {
  const baseResult = calculateSIP(
    targetAmount,
    monthlyInvestment,
    annualReturn
  );

  const percentageOptions = [0, 5, 10, 15];

  return percentageOptions.map((percentage) => {
    const increaseAmount =
      percentage === 0 ? 0 : Math.round(monthlyInvestment * (percentage / 100));

    const newMonthlyInvestment = monthlyInvestment + increaseAmount;

    const result = calculateSIP(
      targetAmount,
      newMonthlyInvestment,
      annualReturn
    );

    const monthsSaved =
      baseResult.yearsToGoal * 12 +
      baseResult.monthsToGoal -
      (result.yearsToGoal * 12 + result.monthsToGoal);

    return {
      percentage,
      increaseAmount,
      newMonthlyInvestment,
      yearsToGoal: result.yearsToGoal,
      monthsToGoal: result.monthsToGoal,
      yearsSaved:
        monthsSaved > 0 ? Math.round((monthsSaved / 12) * 10) / 10 : 0,
    };
  });
}

export function calculateFutureProfiles(
  startingAge: number,
  monthlyInvestment: number,
  annualReturn: number = 0.12,
  agesToCalculate: number[] = [25, 30, 40, 50]
): FutureProfile[] {
  const monthlyRate = annualReturn / 12;

  return agesToCalculate.map((age) => {
    const yearsToInvest = age - startingAge;
    const months = yearsToInvest * 12;

    let currentValue = 0;
    for (let i = 0; i < months; i++) {
      currentValue = currentValue * (1 + monthlyRate) + monthlyInvestment;
    }

    return {
      age,
      portfolioValue: Math.round(currentValue),
      totalInvested: monthlyInvestment * months,
    };
  });
}

export function calculateWealthScore(
  targetAmount: number,
  monthlyInvestment: number,
  yearsToGoal: number
): number {
  const affordability = Math.min(
    100,
    ((monthlyInvestment * 12 * 10) / targetAmount) * 100
  );
  const timeScore = Math.max(0, 100 - (yearsToGoal / 50) * 100);
  const consistencyScore = 90;

  const weightedScore =
    affordability * 0.3 + timeScore * 0.4 + consistencyScore * 0.3;
  return Math.min(100, Math.round(weightedScore));
}

export function getWealthScoreMessage(score: number): string[] {
  const messages: string[] = [];

  if (score >= 80) {
    messages.push("Goal is achievable");
    messages.push("Consistent investing");
    messages.push("Great planning mindset");
  } else if (score >= 60) {
    messages.push("Goal is achievable");
    messages.push("Consider increasing SIP");
    messages.push("Stay consistent");
  } else {
    messages.push("Consider a smaller goal first");
    messages.push("Increase monthly investment");
    messages.push("Think long-term");
  }

  return messages;
}

export function formatCurrency(
  amount: number,
  compact: boolean = false
): string {
  if (compact) {
    return formatCurrencyCompact(amount);
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyCompact(amount: number): string {
  if (amount >= 10000000) {
    return `${(amount / 10000000).toFixed(1)} Cr`;
  }
  if (amount >= 100000) {
    return `${(amount / 100000).toFixed(1)} L`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatAmountInWords(amount: number): string {
  if (amount >= 10000000) {
    const crores = amount / 10000000;
    return crores >= 2 ? `${crores.toFixed(0)} Crores` : "One Crore";
  }
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return lakhs >= 2 ? `${lakhs.toFixed(0)} Lakhs` : "One Lakh";
  }
  if (amount >= 1000) {
    const thousands = amount / 1000;
    return thousands >= 2 ? `${thousands.toFixed(0)} Thousand` : "One Thousand";
  }
  return `${amount}`;
}

function formatTargetDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

export function generateGrowthData(
  targetAmount: number,
  monthlyInvestment: number,
  annualReturn: number = 0.12
): { year: number; value: number; invested: number }[] {
  const monthlyRate = annualReturn / 12;
  const totalMonths =
    calculateSIP(targetAmount, monthlyInvestment, annualReturn).yearsToGoal *
      12 +
    calculateSIP(targetAmount, monthlyInvestment, annualReturn).monthsToGoal;

  const data: { year: number; value: number; invested: number }[] = [];
  const maxYears = Math.ceil(totalMonths / 12) + 1;

  let value = 0;
  let invested = 0;

  for (let year = 0; year <= maxYears; year++) {
    data.push({
      year: new Date().getFullYear() + year,
      value: Math.round(value),
      invested: Math.round(invested),
    });

    for (let month = 0; month < 12; month++) {
      value = value * (1 + monthlyRate) + monthlyInvestment;
      invested += monthlyInvestment;
    }
  }

  return data;
}
