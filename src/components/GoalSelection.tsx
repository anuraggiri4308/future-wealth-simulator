import { motion } from 'framer-motion';
import { Target, Sparkles } from 'lucide-react';
import type { Goal } from '../App';

interface GoalSelectionProps {
  onSelectGoal: (goal: Goal) => void;
  selectedGoal: Goal | null;
}

const GOALS: Goal[] = [
  {
    id: 'car',
    emoji: '🚗',
    title: 'First Car',
    defaultAmount: 800000,
  },
  {
    id: 'bike',
    emoji: '🏍️',
    title: 'Dream Bike',
    defaultAmount: 250000,
  },
  {
    id: 'vacation',
    emoji: '✈️',
    title: 'International Trip',
    defaultAmount: 200000,
  },
  {
    id: 'house',
    emoji: '🏠',
    title: 'House Down Payment',
    defaultAmount: 10000000,
  },
  {
    id: '10lakh',
    emoji: '💰',
    title: 'First ₹10 Lakh',
    defaultAmount: 1000000,
  },
  {
    id: '1crore',
    emoji: '💸',
    title: 'First ₹1 Crore',
    defaultAmount: 10000000,
  },
  {
    id: 'financial_freedom',
    emoji: '🔥',
    title: 'Financial Freedom',
    defaultAmount: 50000000,
  },
  {
    id: 'custom',
    emoji: '✨',
    title: 'Custom Goal',
  },
];

function GoalSelection({ onSelectGoal, selectedGoal }: GoalSelectionProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      },
    }),
  };

  return (
    <div className="text-center">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 md:mb-12"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Target className="w-6 h-6 text-accent" />
          <span className="text-accent text-sm font-medium uppercase tracking-wider">
            Step 1 of 3
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gradient mb-4">
          What's Your Dream?
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto">
          Select a financial goal you want to achieve and visualize your path to success
        </p>
      </motion.div>

      {/* Goal Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {GOALS.map((goal, index) => (
          <motion.button
            key={goal.id}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            onClick={() => onSelectGoal(goal)}
            className={`
              group relative glass-card-hover p-6 md:p-8 cursor-pointer text-center
              ${selectedGoal?.id === goal.id ? 'ring-2 ring-accent bg-accent/10' : ''}
            `}
          >
            {/* Hover glow effect */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: 'radial-gradient(600px circle at center, rgba(99,102,241,0.1), transparent 50%)',
              }}
            />

            {/* Emoji */}
            <motion.div
              className="text-4xl md:text-5xl mb-4"
              whileHover={{ scale: 1.2, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.4 }}
            >
              {goal.emoji}
            </motion.div>

            {/* Title */}
            <h3 className="text-base md:text-lg font-semibold text-white group-hover:text-accent-light transition-colors">
              {goal.title}
            </h3>

            {/* Default amount hint */}
            {goal.defaultAmount && (
              <p className="mt-2 text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                Starting from ₹{goal.defaultAmount / 100000 > 1 ? `${goal.defaultAmount / 100000}L` : goal.defaultAmount / 1000 + 'K'}
              </p>
            )}

            {/* Selected indicator */}
            {selectedGoal?.id === goal.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-8 text-sm text-gray-500"
      >
        Tap on a goal to proceed
      </motion.p>
    </div>
  );
}

export default GoalSelection;
