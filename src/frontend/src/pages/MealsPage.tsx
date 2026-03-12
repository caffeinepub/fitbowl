import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Award, Beef, Droplet, Flame, RefreshCw, Wheat, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import PageHeader from "../components/PageHeader";
import { mockMeals } from "../data/mockData";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const today = new Date().getDay(); // 0=Sun
const todayIdx = today === 0 ? 6 : today - 1;

const calorieTargets = [
  { label: "Low", value: 1200, color: "bg-blue-100 text-blue-700" },
  { label: "Medium", value: 1800, color: "bg-green-100 text-green-700" },
  { label: "High", value: 2400, color: "bg-orange-100 text-orange-700" },
];

const allIngredients = [
  "Onion",
  "Garlic",
  "Dairy",
  "Nuts",
  "Gluten",
  "Soy",
  "Eggs",
  "Shellfish",
];

const dietTag: Record<string, { label: string; color: string }> = {
  vegetarian: { label: "Veg", color: "bg-green-100 text-green-700" },
  vegan: { label: "Vegan", color: "bg-emerald-100 text-emerald-700" },
  "non-veg": { label: "Non-Veg", color: "bg-red-100 text-red-700" },
};

function getDietType(tags: string[]) {
  if (tags.includes("vegan")) return "vegan";
  if (tags.includes("vegetarian")) return "vegetarian";
  return "non-veg";
}

export default function MealsPage() {
  const [selectedDay, setSelectedDay] = useState(todayIdx);
  const [calorieTarget, setCalorieTarget] = useState(1800);
  const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);

  const toggleIngredient = (ing: string) => {
    setExcludedIngredients((prev) =>
      prev.includes(ing) ? prev.filter((x) => x !== ing) : [...prev, ing],
    );
  };

  // Assign meals per day based on day index
  const dayMeals = [
    mockMeals[selectedDay % 3],
    mockMeals[(selectedDay % 3) + 3],
    mockMeals[(selectedDay % 3) + 6],
  ];

  const filteredMeals = dayMeals.filter(
    (meal) =>
      !meal.allergens.some((a) =>
        excludedIngredients
          .map((i) => i.toLowerCase())
          .includes(a.toLowerCase()),
      ),
  );

  return (
    <div className="min-h-screen bg-background pb-28">
      <PageHeader
        title="Meal Planner"
        subtitle="Customize your weekly meals"
        showNotification
      />

      <div className="px-4 space-y-5">
        {/* Day selector */}
        <div>
          <p className="text-xs text-muted-foreground mb-2 font-medium">
            SELECT DAY
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {days.map((day, i) => (
              <button
                type="button"
                key={day}
                data-ocid={"meals.day.tab"}
                onClick={() => setSelectedDay(i)}
                className={cn(
                  "flex flex-col items-center gap-1 min-w-[44px] py-2 px-1 rounded-xl transition-all",
                  selectedDay === i
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                <span className="text-[10px] font-medium">{day}</span>
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    i === todayIdx ? "bg-current" : "bg-transparent",
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Calorie Target */}
        <div>
          <p className="text-xs text-muted-foreground mb-2 font-medium">
            CALORIE TARGET
          </p>
          <div className="flex gap-2">
            {calorieTargets.map(({ label, value, color }) => (
              <button
                type="button"
                key={label}
                data-ocid={`meals.calorie.${label.toLowerCase()}.toggle`}
                onClick={() => setCalorieTarget(value)}
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all",
                  calorieTarget === value
                    ? cn(color, "border-current")
                    : "border-border text-muted-foreground bg-card",
                )}
              >
                {label}
                <br />
                <span className="text-[10px] font-normal">{value} kcal</span>
              </button>
            ))}
          </div>
        </div>

        {/* Exclude Ingredients */}
        <div>
          <p className="text-xs text-muted-foreground mb-2 font-medium">
            EXCLUDE INGREDIENTS
          </p>
          <div className="flex flex-wrap gap-2">
            {allIngredients.map((ing) => (
              <button
                type="button"
                key={ing}
                data-ocid={`meals.exclude.${ing.toLowerCase()}.toggle`}
                onClick={() => toggleIngredient(ing)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                  excludedIngredients.includes(ing)
                    ? "bg-destructive/10 border-destructive text-destructive"
                    : "border-border bg-card text-foreground",
                )}
              >
                {ing}
                {excludedIngredients.includes(ing) && <X size={10} />}
              </button>
            ))}
          </div>
        </div>

        {/* Change Week Button */}
        <Button
          variant="outline"
          className="w-full rounded-xl border-primary text-primary"
          onClick={() => toast.success("New meals for next week selected!")}
          data-ocid="meals.change_week.button"
        >
          <RefreshCw size={14} className="mr-2" />
          Change Meals for This Week
        </Button>

        {/* Meal Cards */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-bold">
              {days[selectedDay]}'s Meals
            </h2>
            <span className="text-xs text-muted-foreground">
              {filteredMeals.length} of {dayMeals.length} shown
            </span>
          </div>
          <div className="space-y-4">
            {filteredMeals.map((meal, idx) => {
              const dietType = getDietType(meal.tags);
              const dt = dietTag[dietType];
              return (
                <motion.div
                  key={meal.id.toString()}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  data-ocid={`meals.meal.item.${idx + 1}`}
                  className="bg-card rounded-2xl shadow-card overflow-hidden"
                >
                  <img
                    src={meal.imageUrl}
                    alt={meal.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-display font-bold text-base leading-tight">
                        {meal.name}
                      </h3>
                      <div className="flex flex-col gap-1 items-end flex-shrink-0">
                        <Badge
                          className={cn("text-[10px] px-2 py-0", dt.color)}
                        >
                          {dt.label}
                        </Badge>
                        {meal.nutritionistApproved && (
                          <div className="flex items-center gap-1">
                            <Award size={10} className="text-primary" />
                            <span className="text-[10px] text-primary font-medium">
                              Approved
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {meal.description}
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        {
                          icon: Flame,
                          label: "kcal",
                          value: String(meal.calories),
                        },
                        {
                          icon: Beef,
                          label: "protein",
                          value: `${String(meal.protein)}g`,
                        },
                        {
                          icon: Wheat,
                          label: "carbs",
                          value: `${String(meal.carbs)}g`,
                        },
                        {
                          icon: Droplet,
                          label: "fat",
                          value: `${String(meal.fat)}g`,
                        },
                      ].map(({ icon: Icon, label, value }) => (
                        <div
                          key={label}
                          className="bg-secondary rounded-lg p-2 text-center"
                        >
                          <Icon
                            size={12}
                            className="text-primary mx-auto mb-1"
                          />
                          <p className="text-xs font-semibold">{value}</p>
                          <p className="text-[9px] text-muted-foreground">
                            {label}
                          </p>
                        </div>
                      ))}
                    </div>
                    {meal.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {meal.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-2 py-0.5 bg-primary/8 text-primary rounded-full"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
            {filteredMeals.length === 0 && (
              <div className="text-center py-10" data-ocid="meals.empty_state">
                <p className="text-4xl mb-2">🌟</p>
                <p className="font-semibold">No meals match your filters</p>
                <p className="text-sm text-muted-foreground">
                  Try removing some ingredient exclusions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
