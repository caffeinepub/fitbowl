import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronRight,
  Dumbbell,
  Leaf,
  Scale,
  Target,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { type UserProfile, useApp } from "../context/AppContext";
import { useRouter } from "../context/RouterContext";

const TOTAL_STEPS = 6;

type FormData = Omit<UserProfile, "isOnboardingCompleted">;

const initialForm: FormData = {
  name: "",
  age: 25,
  gender: "female",
  height: 165,
  weight: 70,
  fitnessGoal: "weight-loss",
  dietaryPreferences: ["vegetarian"],
  allergies: [],
  activityLevel: "moderately-active",
};

const allergyOptions = [
  "Lactose",
  "Gluten",
  "Nuts",
  "Shellfish",
  "Soy",
  "Eggs",
];
const dietOptions = [
  { value: "vegetarian", label: "Vegetarian", emoji: "🥗" },
  { value: "vegan", label: "Vegan", emoji: "🌱" },
  { value: "non-vegetarian", label: "Non-Veg", emoji: "🍗" },
];
const goalOptions = [
  {
    value: "weight-loss",
    label: "Weight Loss",
    icon: Scale,
    desc: "Reduce body fat",
  },
  {
    value: "muscle-gain",
    label: "Muscle Gain",
    icon: Dumbbell,
    desc: "Build lean mass",
  },
  { value: "maintain", label: "Maintain", icon: Target, desc: "Stay balanced" },
];
const activityOptions = [
  {
    value: "sedentary",
    label: "Sedentary",
    desc: "Desk job, minimal movement",
  },
  {
    value: "lightly-active",
    label: "Lightly Active",
    desc: "Walk 1-3 days/week",
  },
  {
    value: "moderately-active",
    label: "Moderately Active",
    desc: "Exercise 3-5 days/week",
  },
  {
    value: "very-active",
    label: "Very Active",
    desc: "Intense exercise daily",
  },
];

function calcCalories(form: FormData): number {
  const bmr =
    form.gender === "male"
      ? 10 * form.weight + 6.25 * form.height - 5 * form.age + 5
      : 10 * form.weight + 6.25 * form.height - 5 * form.age - 161;
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    "lightly-active": 1.375,
    "moderately-active": 1.55,
    "very-active": 1.725,
  };
  const tdee = bmr * (activityMultipliers[form.activityLevel] || 1.55);
  if (form.fitnessGoal === "weight-loss") return Math.round(tdee - 400);
  if (form.fitnessGoal === "muscle-gain") return Math.round(tdee + 300);
  return Math.round(tdee);
}

export default function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const { setUserProfile, setIsOnboarded } = useApp();
  const { navigate } = useRouter();

  const update = (key: keyof FormData, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleAllergy = (a: string) => {
    const lower = a.toLowerCase();
    setForm((prev) => ({
      ...prev,
      allergies: prev.allergies.includes(lower)
        ? prev.allergies.filter((x) => x !== lower)
        : [...prev.allergies, lower],
    }));
  };

  const handleComplete = () => {
    const profile: UserProfile = { ...form, isOnboardingCompleted: true };
    setUserProfile(profile);
    setIsOnboarded(true);
    toast.success("Welcome to FitBowl! Your plan is ready 🌿");
    navigate("/");
  };

  const dailyCals = calcCalories(form);
  const protein = Math.round((dailyCals * 0.3) / 4);
  const carbs = Math.round((dailyCals * 0.4) / 4);
  const fat = Math.round((dailyCals * 0.3) / 9);

  return (
    <div className="min-h-screen mesh-bg flex flex-col">
      <div className="flex items-center gap-2 px-6 pt-8 pb-4">
        <img
          src="/assets/generated/fitbowl-logo-transparent.dim_200x200.png"
          className="w-8 h-8 object-contain"
          alt="FitBowl"
        />
        <span className="font-display text-xl font-bold text-foreground">
          FitBowl
        </span>
      </div>

      <div className="px-6 mb-6">
        <div className="flex items-center gap-1">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i).map((i) => (
            <div
              key={`step-${i}`}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-500",
                i < step ? "bg-primary" : "bg-border",
              )}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">
          Step {step} of {TOTAL_STEPS}
        </p>
      </div>

      <div className="flex-1 px-6 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display text-3xl font-bold text-foreground">
                    Welcome! 👋
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Let's personalize your health journey.
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      data-ocid="onboarding.name.input"
                      placeholder="e.g. Priya Sharma"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      className="mt-1.5 h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      data-ocid="onboarding.age.input"
                      type="number"
                      placeholder="25"
                      value={form.age}
                      onChange={(e) =>
                        update("age", Number.parseInt(e.target.value) || 25)
                      }
                      className="mt-1.5 h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <div className="flex gap-3 mt-1.5">
                      {["male", "female", "other"].map((g) => (
                        <button
                          type="button"
                          key={g}
                          data-ocid={`onboarding.gender.${g}.toggle`}
                          onClick={() => update("gender", g)}
                          className={cn(
                            "flex-1 py-3 rounded-xl border-2 text-sm font-medium capitalize transition-all",
                            form.gender === g
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border",
                          )}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display text-3xl font-bold">
                    Your Body 💪
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    We'll use this to calculate your calorie needs.
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      data-ocid="onboarding.height.input"
                      type="number"
                      value={form.height}
                      onChange={(e) =>
                        update(
                          "height",
                          Number.parseFloat(e.target.value) || 165,
                        )
                      }
                      className="mt-1.5 h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Current Weight (kg)</Label>
                    <Input
                      id="weight"
                      data-ocid="onboarding.weight.input"
                      type="number"
                      value={form.weight}
                      onChange={(e) =>
                        update(
                          "weight",
                          Number.parseFloat(e.target.value) || 70,
                        )
                      }
                      className="mt-1.5 h-12 rounded-xl"
                    />
                  </div>
                  <div className="bg-secondary rounded-xl p-4">
                    <p className="text-sm text-muted-foreground">
                      BMI:{" "}
                      <strong className="text-foreground">
                        {(form.weight / (form.height / 100) ** 2).toFixed(1)}
                      </strong>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(() => {
                        const bmi = form.weight / (form.height / 100) ** 2;
                        if (bmi < 18.5) return "Underweight";
                        if (bmi < 25) return "Normal weight ✓";
                        if (bmi < 30) return "Overweight";
                        return "Obese";
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display text-3xl font-bold">
                    Your Goal 🎯
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    What would you like to achieve?
                  </p>
                </div>
                <div className="space-y-3">
                  {goalOptions.map(({ value, label, icon: Icon, desc }) => (
                    <button
                      type="button"
                      key={value}
                      data-ocid={`onboarding.goal.${value}.toggle`}
                      onClick={() => update("fitnessGoal", value)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                        form.fitnessGoal === value
                          ? "border-primary bg-primary/8"
                          : "border-border bg-card",
                      )}
                    >
                      <div
                        className={cn(
                          "p-3 rounded-xl",
                          form.fitnessGoal === value
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary",
                        )}
                      >
                        <Icon size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{label}</p>
                        <p className="text-sm text-muted-foreground">{desc}</p>
                      </div>
                      {form.fitnessGoal === value && (
                        <Check size={18} className="text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display text-3xl font-bold">
                    Diet & Allergies 🥗
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Customize your meal preferences.
                  </p>
                </div>
                <div>
                  <Label className="text-base font-semibold">
                    Dietary Preference
                  </Label>
                  <div className="flex gap-3 mt-3">
                    {dietOptions.map(({ value, label, emoji }) => (
                      <button
                        type="button"
                        key={value}
                        data-ocid={`onboarding.diet.${value}.toggle`}
                        onClick={() => update("dietaryPreferences", [value])}
                        className={cn(
                          "flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 text-sm transition-all",
                          form.dietaryPreferences.includes(value)
                            ? "border-primary bg-primary/10"
                            : "border-border bg-card",
                        )}
                      >
                        <span className="text-xl">{emoji}</span>
                        <span className="font-medium text-xs">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-base font-semibold">
                    Allergies & Intolerances
                  </Label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Select all that apply
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {allergyOptions.map((a) => (
                      <button
                        type="button"
                        key={a}
                        data-ocid={`onboarding.allergy.${a.toLowerCase()}.toggle`}
                        onClick={() => toggleAllergy(a)}
                        className={cn(
                          "px-4 py-2 rounded-full border text-sm font-medium transition-all",
                          form.allergies.includes(a.toLowerCase())
                            ? "bg-destructive/10 border-destructive text-destructive"
                            : "border-border bg-card",
                        )}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display text-3xl font-bold">
                    Activity Level 🏃
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    How active are you on a typical day?
                  </p>
                </div>
                <div className="space-y-3">
                  {activityOptions.map(({ value, label, desc }) => (
                    <button
                      type="button"
                      key={value}
                      data-ocid={`onboarding.activity.${value.replace(/-/g, "")}.toggle`}
                      onClick={() => update("activityLevel", value)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                        form.activityLevel === value
                          ? "border-primary bg-primary/8"
                          : "border-border bg-card",
                      )}
                    >
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full border-2",
                          form.activityLevel === value
                            ? "bg-primary border-primary"
                            : "border-muted-foreground",
                        )}
                      />
                      <div>
                        <p className="font-semibold">{label}</p>
                        <p className="text-sm text-muted-foreground">{desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display text-3xl font-bold">
                    Your Plan is Ready! 🎉
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Personalized for {form.name || "you"} based on your profile.
                  </p>
                </div>
                <div className="bg-primary rounded-2xl p-5 text-primary-foreground">
                  <div className="flex items-center gap-2 mb-4">
                    <Leaf size={18} />
                    <span className="font-semibold">
                      Your Daily Calorie Target
                    </span>
                  </div>
                  <p className="text-5xl font-display font-bold">{dailyCals}</p>
                  <p className="text-primary-foreground/80 text-sm mt-1">
                    kcal / day
                  </p>
                  <div className="grid grid-cols-3 gap-3 mt-5">
                    {[
                      { label: "Protein", value: `${protein}g` },
                      { label: "Carbs", value: `${carbs}g` },
                      { label: "Fat", value: `${fat}g` },
                    ].map((m) => (
                      <div
                        key={m.label}
                        className="bg-white/15 rounded-xl p-3 text-center"
                      >
                        <p className="text-lg font-bold">{m.value}</p>
                        <p className="text-xs text-primary-foreground/70 mt-0.5">
                          {m.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                    <Check size={16} className="text-primary" />
                    <div>
                      <p className="font-medium text-sm">
                        Goal:{" "}
                        {
                          goalOptions.find((g) => g.value === form.fitnessGoal)
                            ?.label
                        }
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {form.activityLevel.replace(/-/g, " ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                    <Check size={16} className="text-primary" />
                    <div>
                      <p className="font-medium text-sm">
                        Diet:{" "}
                        {
                          dietOptions.find((d) =>
                            form.dietaryPreferences.includes(d.value),
                          )?.label
                        }
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {form.allergies.length > 0
                          ? `Avoiding: ${form.allergies.join(", ")}`
                          : "No restrictions"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-accent/30 rounded-xl p-4">
                  <p className="text-sm font-medium">
                    Recommended Plan: <strong>Balance (2 meals/day)</strong>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Starting at ₹3,499/month. Cancel anytime.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-background/80 backdrop-blur-md border-t border-border">
        <div className="flex gap-3">
          {step > 1 && (
            <Button
              variant="outline"
              className="flex-1 h-13 rounded-xl"
              onClick={() => setStep((s) => s - 1)}
              data-ocid="onboarding.back.button"
            >
              Back
            </Button>
          )}
          <Button
            className="flex-1 h-13 rounded-xl bg-primary hover:bg-primary/90 shadow-green font-semibold"
            onClick={() => {
              if (step < TOTAL_STEPS) setStep((s) => s + 1);
              else handleComplete();
            }}
            disabled={step === 1 && !form.name.trim()}
            data-ocid="onboarding.next.primary_button"
          >
            {step === TOTAL_STEPS ? "Start My Journey" : "Continue"}
            {step < TOTAL_STEPS && <ChevronRight size={18} className="ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
