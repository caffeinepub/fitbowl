import { Activity, Scale, Target, TrendingDown } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PageHeader from "../components/PageHeader";
import { useApp } from "../context/AppContext";
import { mockCalorieData, mockWeightData } from "../data/mockData";

const weightLast30 = mockWeightData.slice(-30);
const weightChartData = weightLast30.filter((_, i) => i % 3 === 0);

function CircularProgress({
  percent,
  label,
  color,
}: { percent: number; label: string; color: string }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const stroke = circ * (1 - percent / 100);
  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width="88"
        height="88"
        viewBox="0 0 88 88"
        aria-label={`${label}: ${percent}%`}
      >
        <title>
          {label}: {percent}%
        </title>
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke="oklch(0.9 0.015 120)"
          strokeWidth="8"
        />
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={stroke}
          strokeLinecap="round"
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "center",
            transition: "stroke-dashoffset 1s ease",
          }}
        />
        <text
          x="44"
          y="48"
          textAnchor="middle"
          fill="currentColor"
          fontSize="14"
          fontWeight="700"
        >
          {percent}%
        </text>
      </svg>
      <p className="text-xs text-muted-foreground text-center font-medium">
        {label}
      </p>
    </div>
  );
}

export default function ProgressPage() {
  const { userProfile } = useApp();
  const weight = userProfile?.weight || 75.4;
  const height = userProfile?.height || 165;
  const bmi = weight / (height / 100) ** 2;
  const bmiCategory =
    bmi < 18.5
      ? "Underweight"
      : bmi < 25
        ? "Normal"
        : bmi < 30
          ? "Overweight"
          : "Obese";
  const bmiColor =
    bmi < 18.5
      ? "#60a5fa"
      : bmi < 25
        ? "#22c55e"
        : bmi < 30
          ? "#f59e0b"
          : "#ef4444";

  return (
    <div className="min-h-screen bg-background pb-28">
      <PageHeader
        title="Progress"
        subtitle="Your health journey"
        showNotification
      />

      <div className="px-4 space-y-6">
        <div
          className="bg-card rounded-2xl p-4 shadow-card"
          data-ocid="progress.weight.card"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-base">
                Weight Progress
              </h3>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </div>
            <div className="flex items-center gap-1 text-primary">
              <TrendingDown size={16} />
              <span className="font-bold text-sm">-2.6 kg</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart
              data={weightChartData}
              margin={{ top: 5, right: 5, bottom: 5, left: -20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.9 0.015 120)"
              />
              <XAxis dataKey="date" tick={{ fontSize: 9 }} interval={1} />
              <YAxis domain={[74, 79]} tick={{ fontSize: 9 }} />
              <Tooltip
                contentStyle={{
                  fontSize: 11,
                  borderRadius: 8,
                  border: "1px solid oklch(0.9 0.015 120)",
                }}
                formatter={(v: any) => [`${v} kg`, "Weight"]}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="oklch(0.59 0.19 145)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, fill: "oklch(0.59 0.19 145)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div
          className="bg-card rounded-2xl p-4 shadow-card"
          data-ocid="progress.calories.card"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-base">
                Calorie Intake
              </h3>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Goal</p>
              <p className="text-sm font-bold text-primary">1,800 kcal</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={mockCalorieData}
              margin={{ top: 5, right: 5, bottom: 5, left: -20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.9 0.015 120)"
                vertical={false}
              />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 2500]} tick={{ fontSize: 9 }} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
                formatter={(v: any) => [`${v} kcal`, "Consumed"]}
              />
              <ReferenceLine
                y={1800}
                stroke="oklch(0.59 0.19 145)"
                strokeDasharray="4 2"
                strokeWidth={1.5}
              />
              <Bar
                dataKey="consumed"
                fill="oklch(0.59 0.19 145)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div
          className="bg-card rounded-2xl p-4 shadow-card"
          data-ocid="progress.goals.card"
        >
          <h3 className="font-display font-bold text-base mb-4">
            Health Goals
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <CircularProgress
              percent={72}
              label="Weight Goal"
              color="#22c55e"
            />
            <CircularProgress
              percent={85}
              label="Calorie Goal"
              color="#f59e0b"
            />
            <CircularProgress
              percent={60}
              label="Activity Goal"
              color="#8b5cf6"
            />
          </div>
        </div>

        <div
          className="bg-card rounded-2xl p-4 shadow-card"
          data-ocid="progress.bmi.card"
        >
          <h3 className="font-display font-bold text-base mb-3">
            BMI Calculator
          </h3>
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center"
              style={{
                background: `${bmiColor}20`,
                border: `2px solid ${bmiColor}`,
              }}
            >
              <p
                className="font-display font-bold text-2xl"
                style={{ color: bmiColor }}
              >
                {bmi.toFixed(1)}
              </p>
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg" style={{ color: bmiColor }}>
                {bmiCategory}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {height}cm · {weight}kg
              </p>
              <div className="mt-2 space-y-1">
                {(
                  [
                    ["< 18.5", "Underweight", "#60a5fa"],
                    ["18.5-24.9", "Normal", "#22c55e"],
                    ["25-29.9", "Overweight", "#f59e0b"],
                    ["30+", "Obese", "#ef4444"],
                  ] as [string, string, string][]
                ).map(([range, cat, c]) => (
                  <div key={cat} className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: c }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {range} — {cat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Scale, label: "Starting Weight", value: "78.0 kg" },
            { icon: Target, label: "Target Weight", value: "72.0 kg" },
            { icon: TrendingDown, label: "Lost So Far", value: "2.6 kg" },
            { icon: Activity, label: "Streak", value: "12 days" },
          ].map(({ icon: Icon, label, value }, i) => (
            <div
              key={label}
              data-ocid={`progress.stat.item.${i + 1}`}
              className="bg-card rounded-xl p-4 shadow-xs"
            >
              <Icon size={18} className="text-primary mb-2" />
              <p className="font-bold text-lg">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
