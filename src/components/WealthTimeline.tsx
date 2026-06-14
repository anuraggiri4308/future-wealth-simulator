import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Rocket, Trophy } from 'lucide-react';
import type { Milestone } from '../utils/calculations';
import { formatCurrencyCompact } from '../utils/calculations';

interface WealthTimelineProps {
  milestones: Milestone[];
}

function WealthTimeline({ milestones }: WealthTimelineProps) {
  return (
    <div className="relative">
      {/* Vertical Line */}
      <div className="absolute left-5 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-accent-light to-gold" />

      {/* Milestones */}
      <div className="space-y-6">
        {milestones.map((milestone, index) => {
          const isStart = index === 0;
          const isEnd = index === milestones.length - 1;

          return (
            <motion.div
              key={milestone.amount}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className="relative flex items-start gap-4 md:gap-6 pl-2"
            >
              {/* Icon */}
              <motion.div
                className={`
                  relative z-10 flex items-center justify-center w-10 md:w-14 h-10 md:h-14 rounded-full
                  ${
                    isEnd
                      ? 'bg-gradient-to-br from-gold to-amber-600 shadow-lg shadow-gold/30'
                      : isStart
                        ? 'bg-gradient-to-br from-accent to-accent-dark shadow-lg shadow-accent/30'
                        : 'bg-dark-600 border-2 border-accent/50'
                  }
                `}
                whileHover={{ scale: 1.1 }}
              >
                {isEnd ? (
                  <Trophy className="w-5 md:w-6 h-5 md:h-6 text-white" />
                ) : isStart ? (
                  <Rocket className="w-5 md:w-6 h-5 md:h-6 text-white" />
                ) : (
                  <Circle className="w-4 md:w-5 h-4 md:h-5 text-accent" />
                )}
              </motion.div>

              {/* Content Card */}
              <div className={`flex-1 glass-card p-4 md:p-5 ${isEnd ? 'border-gold/30 bg-gold/5' : ''}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-white">
                      {formatCurrencyCompact(milestone.amount)}
                    </p>
                    {isEnd && (
                      <span className="text-xs text-gold flex items-center gap-1 mt-1">
                        <Trophy className="w-3 h-3" />
                        Goal Achieved!
                      </span>
                    )}
                    {isStart && (
                      <span className="text-xs text-accent flex items-center gap-1 mt-1">
                        <Rocket className="w-3 h-3" />
                        Starting Point
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-400">{milestone.formattedDate}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {milestone.yearsFromNow === 0
                        ? 'Now'
                        : milestone.yearsFromNow === 1
                          ? '1 year from today'
                          : `${milestone.yearsFromNow} years from today`}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                {!isStart && !isEnd && (
                  <div className="mt-3">
                    <div className="h-1 bg-dark-600 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-accent to-accent-light"
                        initial={{ width: 0 }}
                        animate={{ width: `${(index / (milestones.length - 1)) * 100}%` }}
                        transition={{ delay: index * 0.15, duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default WealthTimeline;
