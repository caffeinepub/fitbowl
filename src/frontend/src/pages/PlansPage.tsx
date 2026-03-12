import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Crown, Pause, Shield, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import PageHeader from "../components/PageHeader";
import { useApp } from "../context/AppContext";

type BillingCycle = "monthly" | "yearly" | "student";

const plans = [
  {
    id: "Lite",
    icon: Zap,
    label: "Lite",
    meals: "1 Meal / Day",
    monthlyPrice: 1999,
    desc: "Perfect for getting started",
    features: [
      "1 nutritionist-approved meal",
      "Breakfast or lunch or dinner",
      "Weekly menu changes",
      "Delivery tracking",
      "Basic nutrition insights",
    ],
    color: "border-amber-200 bg-amber-50",
    badge: "",
  },
  {
    id: "Balance",
    icon: Shield,
    label: "Balance",
    meals: "2 Meals / Day",
    monthlyPrice: 3499,
    desc: "Most popular choice",
    features: [
      "2 nutritionist-approved meals",
      "Breakfast + Lunch or Dinner",
      "Ingredient exclusions",
      "Calorie target selection",
      "Detailed macro tracking",
      "Priority delivery",
    ],
    color: "border-primary bg-primary/5",
    badge: "Popular",
  },
  {
    id: "Complete",
    icon: Crown,
    label: "Complete",
    meals: "3 Meals / Day",
    monthlyPrice: 4999,
    desc: "Full nutrition coverage",
    features: [
      "3 nutritionist-approved meals",
      "Breakfast + Lunch + Dinner",
      "Custom meal planning",
      "1-on-1 nutritionist chat",
      "Advanced progress tracking",
      "Skip & reschedule anytime",
      "Free health report monthly",
    ],
    color: "border-purple-200 bg-purple-50/50",
    badge: "Best Value",
  },
];

const discounts: Record<BillingCycle, number> = {
  monthly: 0,
  yearly: 0.2,
  student: 0.3,
};
const billingLabels: Record<BillingCycle, string> = {
  monthly: "Monthly",
  yearly: "Yearly (-20%)",
  student: "Student (-30%)",
};

export default function PlansPage() {
  const { subscription, setSubscription } = useApp();
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const [loading, setLoading] = useState<string | null>(null);

  const getPrice = (base: number) => {
    const monthly = Math.round(base * (1 - discounts[billing]));
    if (billing === "yearly")
      return {
        display: `₹${(monthly * 12).toLocaleString()}`,
        sub: `₹${monthly}/mo`,
      };
    return { display: `₹${monthly.toLocaleString()}`, sub: "/month" };
  };

  const handleSubscribe = async (planId: string) => {
    setLoading(planId);
    await new Promise((r) => setTimeout(r, 1200));
    setSubscription({
      plan: planId,
      billingCycle: billing,
      isActive: true,
      status: "active",
      startDate: Date.now(),
    });
    setLoading(null);
    toast.success(`Subscribed to ${planId} plan!`);
  };

  const handlePause = async () => {
    setLoading("pause");
    await new Promise((r) => setTimeout(r, 800));
    if (subscription)
      setSubscription({
        ...subscription,
        status: subscription.status === "paused" ? "active" : "paused",
      });
    setLoading(null);
    toast.success(
      subscription?.status === "paused"
        ? "Subscription resumed!"
        : "Subscription paused for 2 weeks.",
    );
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <PageHeader
        title="Subscription Plans"
        subtitle="Eat healthy every day"
        showNotification
      />

      <div className="px-4">
        <div className="flex gap-1 bg-secondary rounded-xl p-1 mb-6">
          {(Object.keys(billingLabels) as BillingCycle[]).map((cycle) => (
            <button
              type="button"
              key={cycle}
              data-ocid={`plans.${cycle}.tab`}
              onClick={() => setBilling(cycle)}
              className={cn(
                "flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all",
                billing === cycle
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground",
              )}
            >
              {billingLabels[cycle]}
            </button>
          ))}
        </div>

        {subscription?.isActive && (
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">
                Current: {subscription.plan} Plan
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {subscription.status} · {subscription.billingCycle}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="rounded-lg border-primary/40 text-primary"
              onClick={handlePause}
              disabled={loading === "pause"}
              data-ocid="plans.pause.button"
            >
              <Pause size={12} className="mr-1" />
              {subscription.status === "paused" ? "Resume" : "Pause"}
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {plans.map(
            (
              {
                id,
                icon: Icon,
                label,
                meals,
                monthlyPrice,
                desc,
                features,
                color,
                badge,
              },
              idx,
            ) => {
              const isCurrent =
                subscription?.plan === id && subscription.isActive;
              const price = getPrice(monthlyPrice);
              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  data-ocid={`plans.plan.item.${idx + 1}`}
                  className={cn(
                    "rounded-2xl border-2 p-5",
                    color,
                    isCurrent && "ring-2 ring-primary",
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-white rounded-xl shadow-xs">
                        <Icon size={20} className="text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold text-lg">
                            {label}
                          </h3>
                          {badge && (
                            <Badge className="text-[10px] px-1.5 py-0 bg-primary text-primary-foreground">
                              {badge}
                            </Badge>
                          )}
                          {isCurrent && (
                            <Badge className="text-[10px] px-1.5 py-0 bg-green-500 text-white">
                              Active
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold text-2xl text-foreground">
                        {price.display}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {price.sub}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-primary mb-3">
                    {meals}
                  </p>
                  <ul className="space-y-2 mb-4">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check
                          size={14}
                          className="text-primary mt-0.5 flex-shrink-0"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={cn(
                      "w-full rounded-xl font-semibold",
                      isCurrent
                        ? "bg-secondary text-foreground border border-border"
                        : "bg-primary text-primary-foreground shadow-green",
                    )}
                    onClick={() => !isCurrent && handleSubscribe(id)}
                    disabled={!!loading || isCurrent}
                    data-ocid={`plans.${id.toLowerCase()}.primary_button`}
                  >
                    {loading === id
                      ? "Processing..."
                      : isCurrent
                        ? "Current Plan"
                        : "Subscribe"}
                  </Button>
                </motion.div>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
}
