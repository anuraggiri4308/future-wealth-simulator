import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  IndianRupee,
  TrendingUp,
  User,
  Calendar,
} from "lucide-react";
import { formatCurrency } from "../utils/calculations";

interface MonthlyInvestmentProps {
  targetAmount: number;
  amount: number;
  onAmountChange: (amount: number) => void;
  annualReturn: number;
  onAnnualReturnChange: (rate: number) => void;
  userName: string;
  onUserNameChange: (name: string) => void;
  age: number;
  onAgeChange: (age: number) => void;
  onNext: () => void;
  onBack: () => void;
  frequency: "daily" | "weekly" | "monthly";
  onFrequencyChange: (frequency: "daily" | "weekly" | "monthly") => void;
}

const INVESTMENT_CHIPS = [
  { label: "₹1K", value: 1000 },
  { label: "₹2K", value: 2000 },
  { label: "₹3K", value: 3000 },
  { label: "₹5K", value: 5000 },
  { label: "₹10K", value: 10000 },
  { label: "₹20K", value: 20000 },
  { label: "₹50K", value: 50000 },
  { label: "₹1 Lakh", value: 100000 },
  { label: "₹2 Lakh", value: 200000 },
  { label: "₹5 Lakh", value: 500000 },
];

const RETURN_RATES = [
  { percentage: "10%", value: 10, label: "Safe", description: "Conservative" },
  {
    percentage: "12%",
    value: 12,
    label: "Balanced",
    description: "Recommended",
  },
  { percentage: "14%", value: 14, label: "Growth", description: "Aggressive" },
  {
    percentage: "16%",
    value: 16,
    label: "High",
    description: "Stocks-focused",
  },
];

const AGE_CHIPS = [18, 21, 25, 30, 35];

function MonthlyInvestment({
  targetAmount,
  amount,
  onAmountChange,
  annualReturn,
  onAnnualReturnChange,
  userName,
  onUserNameChange,
  age,
  onAgeChange,
  onNext,
  onBack,
  frequency,
  onFrequencyChange,
}: MonthlyInvestmentProps) {
  const [inputValue, setInputValue] = useState(
    amount ? amount.toLocaleString("en-IN") : ""
  );
  const [isFocused, setIsFocused] = useState(false);
  const [ageInput, setAgeInput] = useState(age ? age.toString() : "");
  // const [frequency, setFrequency] = useState<InvestmentFrequency>("monthly");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!amount || amount === 0) {
      onAmountChange(10000);
      setInputValue("10,000");
    }
  }, []);

  useEffect(() => {
    console.log("Current Frequency:", frequency);
  }, [frequency]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    const numericValue = parseInt(rawValue, 10) || 0;
    onAmountChange(numericValue);
    setInputValue(numericValue ? numericValue.toLocaleString("en-IN") : "");
  };

  const isValid = amount >= 500 && age >= 18 && age <= 60;

  const monthlyEquivalent =
    frequency === "daily"
      ? amount * 30
      : frequency === "weekly"
      ? (amount * 52) / 12
      : amount;
  // Quick estimate calculation
  const estimateTime = () => {
    if (monthlyEquivalent <= 0 || targetAmount <= 0) {
      return { years: 0, months: 0 };
    }
    const monthlyRate = annualReturn / 100 / 12;
    let months = 0;
    let value = 0;
    while (value < targetAmount && months < 1200) {
      value = value * (1 + monthlyRate) + monthlyEquivalent;
      months++;
    }
    return { years: Math.floor(months / 12), months: months % 12 };
  };
  const estimate = estimateTime();

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
          How Much Can You Invest?
        </h1>
        <p className="text-gray-400">
          Be honest with yourself. Start with what feels comfortable.
        </p>
      </motion.div>

      {/* Your Name Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card p-6 mb-4"
      >
        <label className="flex items-center gap-2 text-sm text-gray-400 mb-3">
          <User className="w-4 h-4" />
          Your Name (for personalized results)
        </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => onUserNameChange(e.target.value)}
          placeholder="Enter your name"
          className="input-field text-lg"
        />
      </motion.div>

      {/* Age Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="glass-card p-6 mb-4"
      >
        <label className="flex items-center gap-2 text-sm text-gray-400 mb-3">
          <Calendar className="w-4 h-4" />
          Your Age (for "Future You" projections)
        </label>

        <div className="flex items-center gap-3 mb-4">
          <input
            type="number"
            value={ageInput}
            onChange={(e) => {
              const value = e.target.value;
              setAgeInput(value);
              if (value === "") {
                return;
              }
              const parsed = parseInt(value);
              if (!isNaN(parsed)) {
                onAgeChange(parsed);
              }
            }}
            onBlur={() => {
              const parsed = parseInt(ageInput);
              if (isNaN(parsed) || parsed < 18) {
                setAgeInput("18");
                onAgeChange(18);
                return;
              }
              if (parsed > 60) {
                setAgeInput("60");
                onAgeChange(60);
                return;
              }
              onAgeChange(parsed);
            }}
            min={18}
            max={60}
            className="w-24 bg-dark-600/50 border border-white/10 rounded-xl px-4 py-3 text-2xl font-bold text-white text-center focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20"
          />
          <span className="text-gray-400">years old</span>
        </div>

        <p className="text-xs text-gray-500 mb-3">Quick select</p>
        <div className="flex flex-wrap gap-2">
          {AGE_CHIPS.map((chipAge) => (
            <button
              key={chipAge}
              type="button"
              onClick={() => {
                onAgeChange(chipAge);
                setAgeInput(chipAge.toString());
              }}
              className={`py-2 px-4 rounded-lg text-sm font-medium transition-all cursor-pointer
                ${
                  chipAge === age
                    ? "bg-accent text-white shadow-lg shadow-accent/30"
                    : "bg-dark-600 text-gray-300 hover:bg-dark-500"
                }`}
            >
              {chipAge}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Investment Amount Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 md:p-8 mb-4"
      >
        <label className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <IndianRupee className="w-4 h-4" />
          {frequency === "daily" && "Daily Investment Amount"}
          {frequency === "weekly" && "Weekly Investment Amount"}
          {frequency === "monthly" && "Monthly Investment Amount"}
        </label>

        {/* Amount Input */}
        <div className="inline-flex bg-dark-600 rounded-xl p-1 mb-6">
          {[
            { label: "Daily", value: "daily" },
            { label: "Weekly", value: "weekly" },
            { label: "Monthly", value: "monthly" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() =>
                onFrequencyChange(item.value as "daily" | "weekly" | "monthly")
              }
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all
        ${frequency === item.value ? "bg-accent text-white" : "text-gray-400"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div
          className={`flex items-center gap-3 mb-6 ${
            isFocused ? "scale-[1.02]" : ""
          } transition-transform origin-left`}
        >
          <span className="text-3xl md:text-4xl text-gray-400 font-medium">
            ₹
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="0"
            className="flex-1 bg-transparent text-3xl md:text-5xl font-bold text-white
                       placeholder-gray-600 focus:outline-none"
            style={{ caretColor: "#818cf8" }}
          />
          <span className="text-xl text-gray-500">
            {frequency === "daily" && "/day"}
            {frequency === "weekly" && "/week"}
            {frequency === "monthly" && "/month"}
          </span>
        </div>
        {frequency !== "monthly" && (
          <p className="text-sm text-gray-400 mb-4">
            ≈ {formatCurrency(monthlyEquivalent)}/month
          </p>
        )}

        {/* Quick Chips */}
        <p className="text-xs text-gray-500 mb-3">Quick select</p>
        <div className="flex flex-wrap gap-2">
          {INVESTMENT_CHIPS.map((chip) => (
            <button
              key={chip.value}
              onClick={() => {
                onAmountChange(chip.value);
                setInputValue(chip.value.toLocaleString("en-IN"));
              }}
              disabled={chip.value === amount}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-all -mr-1
                ${
                  chip.value === amount
                    ? "bg-accent text-white shadow-lg shadow-accent/30"
                    : "bg-dark-600 text-gray-300 hover:bg-dark-500"
                }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Expected Return Rate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 mb-8"
      >
        <label className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <TrendingUp className="w-4 h-4" />
          Expected Annual Return
        </label>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {RETURN_RATES.map((rate) => (
            <button
              key={rate.value}
              onClick={() => onAnnualReturnChange(rate.value)}
              className={`p-3 rounded-xl text-center transition-all
                ${
                  annualReturn === rate.value
                    ? "bg-gradient-to-br from-accent to-accent-dark text-white shadow-lg shadow-accent/30"
                    : "bg-dark-600 text-gray-300 hover:bg-dark-500"
                }`}
            >
              <div className="text-2xl font-bold">{rate.percentage}</div>
              <div
                className={`text-sm font-medium ${
                  annualReturn === rate.value ? "text-white" : "text-gray-300"
                }`}
              >
                {rate.label}
              </div>
              <div
                className={`text-xs mt-1 ${
                  annualReturn === rate.value
                    ? "text-white/70"
                    : "text-gray-500"
                }`}
              >
                {rate.description}
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Quick Preview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-8 p-4 rounded-xl bg-success/10 border border-success/20"
      >
        <p className="text-sm text-gray-400">Quick Preview</p>
        <p className="text-lg md:text-xl text-white mt-1">
          With{" "}
          <span className="text-accent-light font-semibold">
            {formatCurrency(amount)}
          </span>
          {frequency === "daily" && "/day"}
          {frequency === "weekly" && "/week"}
          {frequency === "monthly" && "/month"}, you could reach your goal in
          approximately
          <span className="text-success font-bold">
            {" "}
            {estimate.years} years {estimate.months} months{" "}
          </span>
        </p>
      </motion.div>

      {/* Navigation */}
      <div className="flex gap-4 justify-between">
        <button
          onClick={onBack}
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back</span>
        </button>

        <motion.button
          onClick={onNext}
          disabled={!isValid}
          className="btn-primary flex items-center gap-2 px-8"
          whileHover={isValid ? { scale: 1.05 } : {}}
          whileTap={isValid ? { scale: 0.95 } : {}}
        >
          See My Future
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>

      {amount > 0 && amount < 500 && (
        <p className="mt-4 text-center text-xs text-amber-400">
          Minimum investment is ₹500
          {frequency === "daily" && "/day"}
          {frequency === "weekly" && "/week"}
          {frequency === "monthly" && "/month"}
        </p>
      )}
    </div>
  );
}

export default MonthlyInvestment;
