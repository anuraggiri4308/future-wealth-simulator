import { useRef } from "react";
import { motion } from "framer-motion";
import { Target, Calendar, Sparkles, X, Download } from "lucide-react";
import html2canvas from "html2canvas";
import type { AppState } from "../App";
import type { CalculationResult } from "../utils/calculations";
import { formatCurrency } from "../utils/calculations";

interface AchievementCardProps {
  state: AppState;
  result: CalculationResult;
  wealthScore: number;
  onClose: () => void;
}

function AchievementCard({
  state,
  result,
  wealthScore,
  onClose,
}: AchievementCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const targetDateFormatted = result.targetDate.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });

  const userName = state.userName || "YOUR";
  const displayUserName =
    userName.toUpperCase() + (userName.toUpperCase() !== "YOUR" ? "'S" : "");

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0a0a0f",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const link = document.createElement("a");
      link.download = "wealth-plan.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Failed to capture card:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-md mx-auto"
    >
      {/* Close Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-dark-600 hover:bg-dark-500 transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Share Card Preview - This will be captured */}
      <div ref={cardRef} className="glass-card overflow-hidden">
        {/* Card Content */}
        <div className="relative p-8 bg-gradient-to-br from-dark-700 via-dark-800 to-dark-900">
          {/* Background orbs */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl" />

          {/* Header */}
          <div className="relative text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-full px-4 py-1 mb-4">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-sm text-accent-light">
                Future Wealth Plan
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
              {displayUserName} WEALTH PLAN
            </h2>

            <p className="text-sm text-gray-500">
              Powered by Future Wealth Simulator
            </p>
          </div>

          {/* Goal */}
          <div className="relative text-center mb-6">
            <span className="text-5xl mb-2 block">
              {state.selectedGoal?.emoji}
            </span>
            <p className="text-lg text-white font-semibold">
              {state.selectedGoal?.title}
            </p>
          </div>

          {/* Stats */}
          <div className="relative space-y-3">
            <StatRow
              icon={<Target className="w-4 h-4" />}
              label="Goal"
              value={formatCurrency(state.targetAmount)}
            />
            <StatRow
              icon="💰"
              label="Monthly SIP"
              value={formatCurrency(state.monthlyInvestment)}
            />
            <StatRow
              icon={<Calendar className="w-4 h-4" />}
              label="Achievement"
              value={targetDateFormatted}
            />
            <StatRow
              icon="⏱️"
              label="Time to Goal"
              value={`${result.yearsToGoal} Years ${result.monthsToGoal} Months`}
            />
          </div>

          {/* Wealth Score */}
          <div className="relative mt-8 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gold/20 to-accent/20 border-2 border-gold/50">
              <div>
                <span className="text-3xl font-bold text-white">
                  {wealthScore}
                </span>
                <span className="text-sm text-gray-400">/100</span>
              </div>
            </div>
            <p className="text-sm text-gold mt-2 font-medium">Wealth Score</p>
          </div>

          {/* Footer */}
          <div className="relative mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-gray-500">
              Calculate your wealth journey at Future Wealth Simulator
            </p>
            <p className="text-sm text-accent mt-2">@anuraggirispeaks</p>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="mt-4 flex justify-center">
        <motion.button
          onClick={handleDownload}
          className="btn-primary flex items-center gap-2 px-8"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Download className="w-5 h-5" />
          Download Card
        </motion.button>
      </div>
    </motion.div>
  );
}

function StatRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode | string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-600/50">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-dark-500 text-accent">
        {typeof icon === "string" ? icon : icon}
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm text-white font-semibold">{value}</p>
      </div>
    </div>
  );
}

export default AchievementCard;
