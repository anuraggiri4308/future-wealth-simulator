import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, IndianRupee } from 'lucide-react';
import type { Goal } from '../App';
import { formatCurrency, formatAmountInWords } from '../utils/calculations';

interface GoalAmountProps {
  goal: Goal;
  amount: number;
  onAmountChange: (amount: number) => void;
  onNext: () => void;
  onBack: () => void;
}

function GoalAmount({ goal, amount, onAmountChange, onNext, onBack }: GoalAmountProps) {
  const [inputValue, setInputValue] = useState(amount ? amount.toLocaleString('en-IN') : '');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (goal.defaultAmount && !amount) {
      onAmountChange(goal.defaultAmount);
      setInputValue(goal.defaultAmount.toLocaleString('en-IN'));
    }
  }, [goal.defaultAmount]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    const numericValue = parseInt(rawValue, 10) || 0;
    onAmountChange(numericValue);
    setInputValue(numericValue ? numericValue.toLocaleString('en-IN') : '');
  };

  const quickAmounts = [
    { label: '1L', value: 100000 },
    { label: '5L', value: 500000 },
    { label: '10L', value: 1000000 },
    { label: '25L', value: 2500000 },
    { label: '50L', value: 5000000 },
    { label: '1Cr', value: 10000000 },
    { label: '5Cr', value: 50000000 },
  ];

  const isValid = amount >= 10000;

  return (
    <div className="max-w-3xl mx-auto text-center">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-4xl md:text-5xl">{goal.emoji}</span>
          <h1 className="text-2xl md:text-4xl font-bold text-white">{goal.title}</h1>
        </div>
        <p className="text-gray-400 text-lg">
          How much do you need to achieve this?
        </p>
      </motion.div>

      {/* Amount Input Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-8 md:p-12 mb-6"
      >
        <label className="text-sm text-gray-400 mb-4 block text-left">
          Target Amount
        </label>

        {/* Large Input */}
        <div className={`relative flex items-center gap-2 mb-6 ${isFocused ? 'scale-[1.02]' : ''} transition-transform`}>
          <div className={`
            flex items-center justify-center w-12 h-12 rounded-xl bg-dark-600
            ${isFocused ? 'text-accent' : 'text-gray-400'}
            transition-colors
          `}>
            <IndianRupee className="w-6 h-6" />
          </div>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="0"
              className="w-full bg-transparent text-4xl md:text-6xl font-bold text-white
                         placeholder-gray-600 focus:outline-none"
              style={{ caretColor: '#818cf8' }}
            />
          </div>
        </div>

        {/* Amount in words */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: amount > 0 ? 1 : 0 }}
          className="mt-4"
        >
          {amount > 0 && (
            <p className="text-xl md:text-2xl gradient-text font-semibold">
              {formatAmountInWords(amount)}
            </p>
          )}
        </motion.div>

        {/* Quick Amount Chips */}
        <div className="mt-8">
          <p className="text-xs text-gray-500 mb-3 text-left">Quick Select</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {quickAmounts.map((quick) => (
              <button
                key={quick.value}
                onClick={() => {
                  onAmountChange(quick.value);
                  setInputValue(quick.value.toLocaleString('en-IN'));
                }}
                disabled={quick.value === amount}
                className={`chip ${quick.value === amount ? 'chip-active' : ''}`}
              >
                {quick.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Formatted Amount Display */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        {amount > 0 && (
          <p className="text-sm text-gray-400">
            You want <span className="text-white font-semibold">{formatCurrency(amount)}</span>
          </p>
        )}
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 justify-between">
        <button onClick={onBack} className="btn-secondary flex items-center gap-2">
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
          Continue
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Minimum hint */}
      {amount > 0 && amount < 10000 && (
        <p className="mt-4 text-xs text-amber-400">
          Minimum amount is ₹10,000
        </p>
      )}
    </div>
  );
}

export default GoalAmount;
