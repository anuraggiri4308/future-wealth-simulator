import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  TrendingUp,
  Target,
  Sparkles,
  Download,
  RefreshCw,
  CheckCircle2,
  Clock,
  IndianRupee,
} from "lucide-react";
import type { AppState } from "../App";
import {
  calculateSIP,
  calculateStepUpOptions,
  calculateIncreaseOptions,
  calculateFutureProfiles,
  calculateWealthScore,
  getWealthScoreMessage,
  formatCurrency,
  formatCurrencyCompact,
} from "../utils/calculations";
import WealthTimeline from "./WealthTimeline";
import WealthChart from "./WealthChart";
import AchievementCard from "./AchievementCard";

interface ResultsScreenProps {
  state: AppState;
  onUpdateMonthlyInvestment: (amount: number) => void;
  onUpdateAnnualReturn: (rate: number) => void;
  onStartOver: () => void;
}

function ResultsScreen({ state, onStartOver }: ResultsScreenProps) {
  const [showShareCard, setShowShareCard] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const monthlyEquivalent =
    state.frequency === "daily"
      ? state.monthlyInvestment * 30
      : state.frequency === "weekly"
      ? (state.monthlyInvestment * 52) / 12
      : state.monthlyInvestment;

  console.log("Frequency:", state.frequency);
  console.log("Investment:", state.monthlyInvestment);
  console.log("Monthly Equivalent:", monthlyEquivalent);

  const result = calculateSIP(
    state.targetAmount,
    monthlyEquivalent,
    state.annualReturn / 100
  );

  const stepUpOptions = calculateStepUpOptions(
    state.targetAmount,
    monthlyEquivalent,
    state.annualReturn / 100
  );

  const increaseOptions = calculateIncreaseOptions(
    state.targetAmount,
    monthlyEquivalent,
    state.annualReturn / 100
  );

  const futureProfiles = calculateFutureProfiles(
    state.age,
    monthlyEquivalent,
    state.annualReturn / 100,
    [state.age + 3, state.age + 8, state.age + 18, state.age + 28]
  );

  const wealthScore = calculateWealthScore(
    state.targetAmount,
    monthlyEquivalent,
    result.yearsToGoal
  );

  const scoreMessages = getWealthScoreMessage(wealthScore);

  const targetDateFormatted = result.targetDate.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  if (showShareCard) {
    return (
      <AchievementCard
        state={state}
        result={result}
        wealthScore={wealthScore}
        onClose={() => setShowShareCard(false)}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 md:p-10 mb-8 relative overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        {/* Header */}
        <div className="relative text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-accent mb-2">
            <Target className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wider">
              Your Goal Journey
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-4xl md:text-5xl">
              {state.selectedGoal?.emoji}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {state.selectedGoal?.title}
            </h1>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Target Goal"
            value={formatCurrency(state.targetAmount)}
          />
          <StatCard
            label={
              state.frequency === "daily"
                ? "Daily Investment"
                : state.frequency === "weekly"
                ? "Weekly Investment"
                : "Monthly SIP"
            }
            value={formatCurrency(state.monthlyInvestment)}
            subtext={
              state.frequency !== "monthly"
                ? `≈ ${formatCurrency(monthlyEquivalent)}/month`
                : undefined
            }
          />
          <StatCard label="Expected Return" value={`${state.annualReturn}%`} />
          <StatCard
            label="Total Investment"
            value={formatCurrencyCompact(result.totalInvestment)}
            subtext={formatCurrency(result.totalInvestment)}
          />
        </div>

        {/* Achievement Time */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center py-6 px-4 rounded-2xl bg-gradient-to-br from-accent/20 via-dark-600/50 to-gold/10 border border-accent/30"
        >
          <p className="text-sm text-gray-400 mb-2">
            You'll reach your goal in
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-5xl md:text-7xl font-bold text-white">
              {result.yearsToGoal}
            </span>
            <div className="text-left">
              <span className="text-xl md:text-2xl text-gray-300">Years</span>
              <br />
              <span className="text-lg md:text-xl text-accent-light">
                {result.monthsToGoal} Months
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4 text-gold">
            <Calendar className="w-5 h-5" />
            <span className="text-lg font-medium">{targetDateFormatted}</span>
          </div>
        </motion.div>

        {/* Key Insight */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Your{" "}
            <span className="text-success font-medium">
              {formatCurrency(result.totalReturns)}
            </span>{" "}
            returns will come from compound growth
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mt-6">
          <motion.button
            onClick={() => setShowShareCard(true)}
            className="btn-secondary flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            Download Journey
          </motion.button>
          <motion.button
            onClick={onStartOver}
            className="btn-secondary flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className="w-4 h-4" />
            Start Over
          </motion.button>
        </div>
      </motion.div>

      {/* Wealth Timeline Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-accent" />
          Wealth Journey Timeline
        </h2>
        <div className="glass-card p-6">
          <WealthTimeline milestones={result.milestones} />
        </div>
      </motion.div>

      {/* Wealth Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-gold" />
          Goal Health Score
        </h2>
        <div className="glass-card p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Score Circle */}
            <div className="relative w-48 h-48">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#22222d"
                  strokeWidth="12"
                  fill="none"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="url(#scoreGradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 553" }}
                  animate={{ strokeDasharray: `${wealthScore * 5.53} 553` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient
                    id="scoreGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-white">
                  {wealthScore}
                </span>
                <span className="text-gray-400 text-sm">/ 100</span>
              </div>
            </div>

            {/* Score Messages */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-4">
                What This Score Means
              </h3>
              <div className="space-y-3">
                {scoreMessages.map((message, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <span className="text-gray-300">{message}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Wealth Growth Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-success" />
          Wealth Growth Visualization
        </h2>
        <div className="glass-card p-4 md:p-6">
          <WealthChart
            targetAmount={state.targetAmount}
            monthlyInvestment={monthlyEquivalent}
            annualReturn={state.annualReturn / 100}
          />
        </div>
      </motion.div>

      {/* Reach Goal Faster Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
          Reach Your Goal Faster
        </h2>
        <p className="text-gray-400 mb-6">
          See how increasing your monthly investment can help you achieve your
          goal sooner
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {increaseOptions.slice(1).map((option, idx) => (
            <motion.div
              key={idx}
              className="glass-card-hover p-5 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
            >
              {idx === 0 && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-accent to-gold text-white text-xs font-bold px-3 py-1 rounded-full">
                  RECOMMENDED
                </div>
              )}

              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">Increase SIP by</p>

                <p className="text-2xl font-bold text-accent-light mb-1">
                  {option.percentage}%
                </p>

                <p className="text-xs text-gray-500 mb-4">
                  (+{formatCurrency(option.increaseAmount)})
                </p>

                <div className="bg-dark-600 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-center gap-1 text-3xl font-bold text-white mb-1">
                    <IndianRupee className="w-5 h-5 text-gray-400" />
                    <span>
                      {formatCurrencyCompact(option.newMonthlyInvestment)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">/month</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Time to goal</span>
                    <span className="text-white font-semibold">
                      {option.yearsToGoal} years
                    </span>
                  </div>
                  {option.yearsSaved > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Years saved</span>
                      <span className="text-success font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        {option.yearsSaved} years
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* SIP Step-Up Simulator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
          SIP Step-Up Simulator
        </h2>
        <p className="text-gray-400 mb-6">
          What if you increase your SIP every year as your income grows?
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stepUpOptions.map((option, idx) => {
            const yearsSaved =
              stepUpOptions[0].yearsToGoal - option.yearsToGoal;
            return (
              <motion.div
                key={option.percentage}
                className={`glass-card-hover p-4 text-center ${
                  idx > 0 ? "border-gold/30" : ""
                }`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + idx * 0.05 }}
              >
                <div
                  className={`text-2xl font-bold ${
                    idx > 0 ? "text-gold" : "text-white"
                  } mb-2`}
                >
                  {option.percentage}%
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  annual increase
                </div>

                <div className="bg-dark-600 rounded-lg p-3 mb-3">
                  <div className="text-lg font-bold text-white">
                    {option.yearsToGoal} yrs
                  </div>
                </div>

                {yearsSaved > 0 && (
                  <div className="text-xs text-success font-medium flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" />
                    {yearsSaved} years faster
                  </div>
                )}
                {option.percentage === 0 && (
                  <div className="text-xs text-gray-500">Current plan</div>
                )}
              </motion.div>
            );
          })}
        </div>

        {stepUpOptions[3].yearsToGoal < stepUpOptions[0].yearsToGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 p-4 rounded-xl bg-gradient-to-r from-gold/20 to-accent/20 border border-gold/30"
          >
            <p className="text-center text-white">
              With 15% annual step-up, you can reach your goal{" "}
              <span className="font-bold text-gold">
                {stepUpOptions[0].yearsToGoal - stepUpOptions[3].yearsToGoal}{" "}
                years earlier!
              </span>
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Future You Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-8"
      >
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
          Future You
        </h2>
        <p className="text-gray-400 mb-6">
          See how your wealth could grow over your lifetime
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {futureProfiles.map((profile, idx) => (
            <motion.div
              key={profile.age}
              className="glass-card-hover p-5 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + idx * 0.1 }}
            >
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    profile.age === 40
                      ? "from-accent/20 via-success/10 to-transparent"
                      : "from-dark-600/80 to-transparent"
                  }`}
                />
              </div>

              <div className="relative text-center">
                <div className="text-sm text-gray-400 mb-1">Age</div>
                <div className="text-4xl font-bold text-white mb-4">
                  {profile.age}
                </div>

                <div className="bg-dark-600/80 rounded-xl p-3 backdrop-blur-sm">
                  <div className="text-lg md:text-xl font-bold gradient-text">
                    {formatCurrencyCompact(profile.portfolioValue)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">portfolio</div>
                </div>

                {profile.age === 40 && (
                  <div className="mt-3 text-xs text-gold flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Peak milestone
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string;
  subtext?: string;
}) {
  return (
    <div className="bg-dark-600/50 rounded-xl p-4 text-center">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-lg md:text-xl font-bold text-white">{value}</p>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
  );
}

export default ResultsScreen;
