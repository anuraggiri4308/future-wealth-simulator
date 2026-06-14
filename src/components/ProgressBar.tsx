import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = ((currentStep - 1) / totalSteps) * 100;
  const stepLabels = ['Choose Goal', 'Set Amount', 'Your Investment'];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step Indicators */}
      <div className="flex justify-between items-center mb-2">
        {stepLabels.map((label, index) => {
          const stepNum = index + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;

          return (
            <div key={stepNum} className="flex flex-col items-center">
              <motion.div
                className={`
                  relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                  ${
                    isActive
                      ? 'bg-gradient-to-br from-accent to-accent-dark text-white shadow-lg shadow-accent/30'
                      : isCompleted
                        ? 'bg-success text-white'
                        : 'bg-dark-600 text-gray-400'
                  }
                `}
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {isCompleted ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : isActive ? (
                  <Sparkles className="w-5 h-5" />
                ) : (
                  stepNum
                )}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-accent"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                )}
              </motion.div>
              <span
                className={`mt-2 text-xs font-medium hidden sm:block ${
                  isActive
                    ? 'text-accent'
                    : isCompleted
                      ? 'text-success'
                      : 'text-gray-500'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress Track */}
      <div className="relative h-1.5 bg-dark-600 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent via-accent-light to-gold rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
          animate={{ x: [`-${100 - progress}%`, `${progress}%`] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ width: '30%' }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
