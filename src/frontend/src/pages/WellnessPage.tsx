import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Play, Square } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import PageHeader from "../components/PageHeader";
import { energyTips, healthTips } from "../data/mockData";

type BreathPhase = "inhale" | "hold" | "exhale" | "rest";

const BREATH_CYCLE: { phase: BreathPhase; duration: number; label: string }[] =
  [
    { phase: "inhale", duration: 4, label: "Inhale..." },
    { phase: "hold", duration: 4, label: "Hold..." },
    { phase: "exhale", duration: 6, label: "Exhale..." },
    { phase: "rest", duration: 2, label: "Rest..." },
  ];

const nutritionTip = healthTips[1];

export default function WellnessPage() {
  const [isBreathing, setIsBreathing] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [countdown, setCountdown] = useState(BREATH_CYCLE[0].duration);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [tipIdx, setTipIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const TOTAL_SECONDS = 60;

  useEffect(() => {
    if (!isBreathing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setPhaseIdx(0);
      setCountdown(BREATH_CYCLE[0].duration);
      setTotalElapsed(0);
      return;
    }
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setPhaseIdx((pi) => {
            const next = (pi + 1) % BREATH_CYCLE.length;
            setCountdown(BREATH_CYCLE[next].duration);
            return next;
          });
          return BREATH_CYCLE[(phaseIdx + 1) % BREATH_CYCLE.length].duration;
        }
        return prev - 1;
      });
      setTotalElapsed((e) => {
        if (e + 1 >= TOTAL_SECONDS) {
          setIsBreathing(false);
          return 0;
        }
        return e + 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isBreathing, phaseIdx]);

  const currentPhase = BREATH_CYCLE[phaseIdx];
  const circleScale =
    currentPhase.phase === "inhale"
      ? 1.4
      : currentPhase.phase === "hold"
        ? 1.4
        : 1;
  const progress = (totalElapsed / TOTAL_SECONDS) * 100;

  return (
    <div className="min-h-screen bg-background pb-28">
      <PageHeader title="Wellness" subtitle="Breathe · Nourish · Energize" />

      <div className="px-4 space-y-6">
        {/* Breathing Exercise */}
        <div
          className="bg-card rounded-2xl p-6 shadow-card"
          data-ocid="wellness.breathing.card"
        >
          <h2 className="font-display text-xl font-bold mb-1">
            1-Minute Breathing
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Box breathing technique to reduce stress
          </p>

          <div className="flex justify-center mb-6">
            <div className="relative flex items-center justify-center">
              <svg
                className="absolute"
                width="220"
                height="220"
                style={{ transform: "rotate(-90deg)" }}
                aria-hidden="true"
              >
                <circle
                  cx="110"
                  cy="110"
                  r="100"
                  fill="none"
                  stroke="oklch(0.9 0.015 120)"
                  strokeWidth="4"
                />
                <circle
                  cx="110"
                  cy="110"
                  r="100"
                  fill="none"
                  stroke="oklch(0.59 0.19 145)"
                  strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 100}`}
                  strokeDashoffset={`${2 * Math.PI * 100 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              <motion.div
                animate={{ scale: isBreathing ? circleScale : 1 }}
                transition={{
                  duration: isBreathing ? currentPhase.duration : 0.3,
                  ease:
                    currentPhase.phase === "inhale"
                      ? "easeIn"
                      : currentPhase.phase === "exhale"
                        ? "easeOut"
                        : "linear",
                }}
                className="w-36 h-36 rounded-full bg-primary/20 flex items-center justify-center"
              >
                <div className="w-24 h-24 rounded-full bg-primary/40 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-2xl">🌿</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="text-center mb-4">
            <AnimatePresence mode="wait">
              <motion.p
                key={isBreathing ? currentPhase.label : "ready"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="font-display text-2xl font-bold text-foreground"
              >
                {isBreathing ? currentPhase.label : "Ready to begin"}
              </motion.p>
            </AnimatePresence>
            {isBreathing && (
              <p className="text-5xl font-bold text-primary mt-2">
                {countdown}
              </p>
            )}
            {isBreathing && (
              <p className="text-xs text-muted-foreground mt-1">
                {TOTAL_SECONDS - totalElapsed}s remaining
              </p>
            )}
          </div>

          <Button
            className={cn(
              "w-full h-12 rounded-xl font-semibold",
              isBreathing
                ? "bg-destructive text-destructive-foreground"
                : "bg-primary text-primary-foreground shadow-green",
            )}
            onClick={() => setIsBreathing((b) => !b)}
            data-ocid="wellness.breathing.toggle"
          >
            {isBreathing ? (
              <>
                <Square size={16} className="mr-2" /> Stop
              </>
            ) : (
              <>
                <Play size={16} className="mr-2" /> Start Exercise
              </>
            )}
          </Button>
        </div>

        {/* Nutrition Tip */}
        <div
          className="bg-gradient-to-br from-primary/10 to-accent/20 rounded-2xl p-5"
          data-ocid="wellness.tip.card"
        >
          <div className="flex items-start gap-4">
            <span className="text-4xl">{nutritionTip.emoji}</span>
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Nutrition Tip
              </span>
              <h3 className="font-display font-bold text-lg mb-2 mt-1">
                2-Minute Tip of the Day
              </h3>
              <p className="text-sm text-foreground leading-relaxed">
                {nutritionTip.tip}
              </p>
              <div className="mt-3 p-3 bg-white/60 rounded-xl">
                <p className="text-xs text-muted-foreground">
                  Proper hydration improves cognitive performance by up to 14%
                  and reduces headache frequency.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Energy Boost Tips Carousel */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-xl font-bold">Energy Boosts</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTipIdx((i) => Math.max(0, i - 1))}
                className="p-2 rounded-lg bg-secondary disabled:opacity-40"
                disabled={tipIdx === 0}
                data-ocid="wellness.tips.pagination_prev"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() =>
                  setTipIdx((i) => Math.min(energyTips.length - 1, i + 1))
                }
                className="p-2 rounded-lg bg-secondary disabled:opacity-40"
                disabled={tipIdx === energyTips.length - 1}
                data-ocid="wellness.tips.pagination_next"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="overflow-hidden">
            <div
              className="flex gap-3 transition-transform duration-300"
              style={{
                transform: `translateX(calc(-${tipIdx * 100}% - ${tipIdx * 12}px))`,
              }}
            >
              {energyTips.map((tip) => (
                <div
                  key={tip.title}
                  data-ocid={"wellness.tip.item.1"}
                  className="min-w-full bg-card rounded-2xl p-5 shadow-card"
                >
                  <div className="text-3xl mb-3">{tip.icon}</div>
                  <h3 className="font-display font-bold text-lg mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tip.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-1.5 mt-3">
            {energyTips.map((tip, i) => (
              <button
                type="button"
                key={tip.title}
                onClick={() => setTipIdx(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  i === tipIdx ? "bg-primary w-4" : "bg-border",
                )}
              />
            ))}
          </div>
        </div>

        {/* Health Tips Grid */}
        <div>
          <h2 className="font-display text-xl font-bold mb-3">Wellness Tips</h2>
          <div className="grid grid-cols-2 gap-3">
            {healthTips.map((tip) => (
              <div
                key={tip.category}
                data-ocid="wellness.health_tip.item.1"
                className="bg-card rounded-xl p-4 shadow-xs"
              >
                <span className="text-2xl">{tip.emoji}</span>
                <Badge
                  variant="secondary"
                  className="text-[10px] mt-2 mb-1.5 block"
                >
                  {tip.category}
                </Badge>
                <p className="text-xs text-muted-foreground line-clamp-3">
                  {tip.tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
