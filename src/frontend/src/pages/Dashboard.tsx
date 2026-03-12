import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Award,
  ChevronRight,
  Droplets,
  Dumbbell,
  Flame,
  Star,
  TrendingDown,
} from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "../context/AppContext";
import { useRouter } from "../context/RouterContext";
import { healthTips, mockMeals } from "../data/mockData";

const todayMeals = [
  { time: "Breakfast", emoji: "☀️", meal: mockMeals[0], status: "delivered" },
  { time: "Lunch", emoji: "🌞", meal: mockMeals[3], status: "preparing" },
  { time: "Dinner", emoji: "🌙", meal: mockMeals[6], status: "scheduled" },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const tipIndex = new Date().getDate() % healthTips.length;

export default function Dashboard() {
  const { userProfile, calorieGoal, caloriesConsumed } = useApp();
  const { navigate } = useRouter();
  const caloriePercent = Math.min((caloriesConsumed / calorieGoal) * 100, 100);
  const tip = healthTips[tipIndex];
  const firstName = userProfile?.name?.split(" ")[0] || "Friend";
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Header */}
      <div className="bg-primary px-5 pt-10 pb-8 rounded-b-3xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-white/30" />
          <div className="absolute bottom-2 right-12 w-16 h-16 rounded-full bg-white/20" />
        </div>
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-primary-foreground/80 text-sm">{today}</p>
              <h1 className="font-display text-3xl font-bold text-primary-foreground mt-1">
                {getGreeting()},<br />
                {firstName} 🌿
              </h1>
            </div>
            <img
              src="/assets/generated/fitbowl-logo-transparent.dim_200x200.png"
              className="w-12 h-12 object-contain bg-white/20 rounded-xl p-1.5"
              alt="FitBowl"
            />
          </div>
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              {
                icon: Flame,
                label: "Calories",
                value: caloriesConsumed,
                unit: "kcal",
                color: "text-amber-400",
              },
              {
                icon: Droplets,
                label: "Water",
                value: "1.8",
                unit: "L",
                color: "text-blue-300",
              },
              {
                icon: Dumbbell,
                label: "Protein",
                value: "48",
                unit: "g",
                color: "text-purple-300",
              },
            ].map(({ icon: Icon, label, value, unit, color }) => (
              <div key={label} className="bg-white/15 rounded-xl p-3">
                <Icon size={15} className={color} />
                <p className="text-primary-foreground font-bold text-lg mt-1">
                  {value}
                </p>
                <p className="text-primary-foreground/60 text-[10px]">
                  {unit} {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 space-y-5 mt-5">
        {/* Calorie Progress */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-4 shadow-card"
          data-ocid="dashboard.calorie.card"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold">Calorie Goal</p>
            <Badge variant="secondary" className="text-primary font-medium">
              {caloriesConsumed} / {calorieGoal} kcal
            </Badge>
          </div>
          <Progress value={caloriePercent} className="h-3 rounded-full" />
          <div className="flex justify-between mt-2">
            <p className="text-xs text-muted-foreground">
              {Math.round(caloriePercent)}% consumed
            </p>
            <p className="text-xs text-muted-foreground">
              {calorieGoal - caloriesConsumed} remaining
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: "Protein", value: 48, max: 90, color: "bg-purple-400" },
              { label: "Carbs", value: 180, max: 225, color: "bg-amber-400" },
              { label: "Fat", value: 45, max: 60, color: "bg-rose-400" },
            ].map(({ label, value, max, color }) => (
              <div key={label}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="text-xs font-medium">{value}g</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", color)}
                    style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Today's Meals */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-bold">Today's Meals</h2>
            <button
              type="button"
              onClick={() => navigate("/meals")}
              className="text-primary text-sm font-medium flex items-center gap-1"
              data-ocid="dashboard.meals.link"
            >
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {todayMeals.map(({ time, emoji, meal, status }, i) => (
              <div
                key={time}
                data-ocid={`dashboard.meal.item.${i + 1}`}
                className="bg-card rounded-xl p-3 shadow-card flex items-center gap-3"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={meal.imageUrl}
                    alt={meal.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{emoji}</span>
                    <span className="text-xs text-muted-foreground">
                      {time}
                    </span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-[9px] py-0 px-1.5 ml-auto",
                        status === "delivered" && "bg-green-100 text-green-700",
                        status === "preparing" && "bg-amber-100 text-amber-700",
                        status === "scheduled" &&
                          "bg-secondary text-muted-foreground",
                      )}
                    >
                      {status}
                    </Badge>
                  </div>
                  <p className="font-semibold text-sm truncate mt-0.5">
                    {meal.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {String(meal.calories)} kcal · {String(meal.protein)}g
                    protein
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weight Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-4 shadow-card"
          data-ocid="dashboard.weight.card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Weight</p>
              <p className="font-display text-3xl font-bold">
                75.4{" "}
                <span className="text-base font-normal text-muted-foreground">
                  kg
                </span>
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-primary justify-end">
                <TrendingDown size={14} />
                <span className="text-sm font-semibold">-2.6 kg</span>
              </div>
              <p className="text-xs text-muted-foreground">vs start</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate("/progress")}
            className="mt-3 w-full py-2 text-sm text-primary font-medium flex items-center justify-center gap-1 rounded-lg bg-primary/8 hover:bg-primary/15 transition-colors"
            data-ocid="dashboard.progress.link"
          >
            View Progress Chart <ChevronRight size={14} />
          </button>
        </motion.div>

        {/* Daily Health Tip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-accent/30 border border-accent rounded-2xl p-4"
          data-ocid="dashboard.tip.card"
        >
          <div className="flex items-start gap-3">
            <span className="text-3xl">{tip.emoji}</span>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star size={12} className="text-amber-500 fill-amber-500" />
                <span className="text-xs font-semibold text-accent-foreground">
                  Daily Tip · {tip.category}
                </span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {tip.tip}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="font-display text-lg font-bold mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                {
                  label: "Track Delivery",
                  emoji: "🚚",
                  path: "/delivery",
                  ocid: "dashboard.delivery.primary_button",
                },
                {
                  label: "Wellness Check",
                  emoji: "🌿",
                  path: "/wellness",
                  ocid: "dashboard.wellness.primary_button",
                },
                {
                  label: "Change Meals",
                  emoji: "🍲",
                  path: "/meals",
                  ocid: "dashboard.meals.primary_button",
                },
                {
                  label: "View Plans",
                  emoji: "💳",
                  path: "/plans",
                  ocid: "dashboard.plans.primary_button",
                },
              ] as const
            ).map(({ label, emoji, path, ocid }) => (
              <button
                type="button"
                key={label}
                data-ocid={ocid}
                onClick={() => navigate(path)}
                className="bg-card rounded-xl p-4 shadow-card hover:shadow-card-hover transition-all text-left flex items-center gap-3"
              >
                <span className="text-2xl">{emoji}</span>
                <span className="font-medium text-sm">{label}</span>
                <ChevronRight
                  size={14}
                  className="ml-auto text-muted-foreground"
                />
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-primary/8 rounded-2xl p-4 flex items-center gap-3"
        >
          <Award size={24} className="text-primary flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm">Nutritionist Approved</p>
            <p className="text-xs text-muted-foreground">
              All meals reviewed by certified nutritionists
            </p>
          </div>
        </motion.div>

        <div className="h-4" />
        <footer className="text-center text-xs text-muted-foreground pb-2">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            className="underline hover:text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            caffeine.ai
          </a>
        </footer>
      </div>
    </div>
  );
}
