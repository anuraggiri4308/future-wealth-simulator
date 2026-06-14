import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface WealthChartProps {
  targetAmount: number;
  monthlyInvestment: number;
  annualReturn: number;
}

function WealthChart({
  targetAmount,
  monthlyInvestment,
  annualReturn,
}: WealthChartProps) {
  const data = useMemo(() => {
    const monthlyRate = annualReturn / 12;
    let value = 0;
    let invested = 0;

    // Calculate years needed
    let months = 0;
    let tempValue = 0;
    while (tempValue < targetAmount && months < 1200) {
      tempValue = tempValue * (1 + monthlyRate) + monthlyInvestment;
      months++;
    }
    const totalYears = Math.ceil(months / 12);

    const chartData = [];
    for (let year = 0; year <= totalYears; year++) {
      chartData.push({
        year: year,
        label: `Year ${year}`,
        value: Math.round(value),
        invested: Math.round(invested),
        gains: Math.round(Math.max(0, value - invested)),
      });

      for (let month = 0; month < 12 && value < targetAmount * 1.1; month++) {
        value = value * (1 + monthlyRate) + monthlyInvestment;
        invested += monthlyInvestment;
      }
    }

    return chartData;
  }, [targetAmount, monthlyInvestment, annualReturn]);

  const formatYAxis = (value: number) => {
    if (value >= 10000000) return `${(value / 10000000).toFixed(0)}Cr`;
    if (value >= 100000) return `${(value / 100000).toFixed(0)}L`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: {
      payload: {
        value: number;
        invested: number;
        gains: number;
        label: string;
      };
    }[];
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-4 bg-dark-800/95 !border-white/20">
          <p className="text-white font-semibold mb-2">{data.label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-accent-light">
              Portfolio: ₹{data.value.toLocaleString("en-IN")}
            </p>
            <p className="text-gray-400">
              Invested: ₹{data.invested.toLocaleString("en-IN")}
            </p>
            <p className="text-success">
              Gains: ₹{data.gains.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full h-64 md:h-80"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            dy={10}
            interval="preserveStartEnd"
          />

          <YAxis
            tickFormatter={formatYAxis}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            width={50}
          />

          <Tooltip content={<CustomTooltip />} />

          <ReferenceLine
            y={targetAmount}
            stroke="#f59e0b"
            strokeDasharray="5 5"
            strokeOpacity={0.6}
          />

          <Area
            type="monotone"
            dataKey="invested"
            stackId="1"
            stroke="#6366f1"
            fill="url(#colorInvested)"
            strokeWidth={0}
          />

          <Area
            type="monotone"
            dataKey="value"
            stackId="2"
            stroke="#818cf8"
            fill="url(#colorValue)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent" />
          <span className="text-xs text-gray-400">Total Portfolio</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent/50" />
          <span className="text-xs text-gray-400">Amount Invested</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-0.5 bg-gold opacity-60"
            style={{ borderTop: "2px dashed #f59e0b" }}
          />
          <span className="text-xs text-gray-400">Goal Target</span>
        </div>
      </div>
    </motion.div>
  );
}

export default WealthChart;
