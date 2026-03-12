import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  Clock,
  Home,
  MapPin,
  Package,
  ToggleLeft,
  ToggleRight,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import PageHeader from "../components/PageHeader";

const deliverySteps = [
  { id: "ordered", label: "Ordered", icon: Package },
  { id: "preparing", label: "Preparing", icon: Clock },
  { id: "out", label: "Out for Delivery", icon: Truck },
  { id: "delivered", label: "Delivered", icon: CheckCircle },
];

const currentStatus = "out"; // mock current status
const currentStepIdx = deliverySteps.findIndex((s) => s.id === currentStatus);

const pastOrders = [
  {
    date: "Yesterday",
    meal: "Miso Glazed Salmon Bowl",
    time: "7:30 PM",
    status: "delivered",
  },
  {
    date: "2 days ago",
    meal: "Turmeric Cauliflower Curry",
    time: "7:15 PM",
    status: "delivered",
  },
  {
    date: "3 days ago",
    meal: "Mediterranean Harvest Bowl",
    time: "12:45 PM",
    status: "delivered",
  },
  {
    date: "4 days ago",
    meal: "Thai Peanut Tofu Bowl",
    time: "1:00 PM",
    status: "delivered",
  },
  {
    date: "5 days ago",
    meal: "Herb-Crusted Chicken Bowl",
    time: "7:20 PM",
    status: "delivered",
  },
  {
    date: "6 days ago",
    meal: "Açaí Power Bowl",
    time: "8:00 AM",
    status: "delivered",
  },
  {
    date: "7 days ago",
    meal: "Sunrise Quinoa Bowl",
    time: "8:15 AM",
    status: "delivered",
  },
];

export default function DeliveryPage() {
  const [skipMeal, setSkipMeal] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState("12:45");
  const [address, setAddress] = useState("42, Green Park, Bengaluru - 560076");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSave = () => {
    toast.success("Delivery preferences updated!");
  };

  const handleSkipToggle = (v: boolean) => {
    if (v) {
      setShowConfirm(true);
    } else {
      setSkipMeal(false);
      toast.info("Meal delivery restored.");
    }
  };

  const confirmSkip = () => {
    setSkipMeal(true);
    setShowConfirm(false);
    toast.success("Today's delivery skipped.");
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <PageHeader
        title="Delivery"
        subtitle="Track & manage your deliveries"
        showNotification
      />

      <div className="px-4 space-y-5">
        {/* Today's Delivery */}
        <div
          className="bg-primary rounded-2xl p-5 text-primary-foreground"
          data-ocid="delivery.today.card"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-primary-foreground/70 text-xs mb-1">
                Today's Lunch
              </p>
              <p className="font-display font-bold text-lg">
                Mediterranean Harvest Bowl
              </p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <Clock size={12} className="text-primary-foreground/70" />
                  <span className="text-xs text-primary-foreground/70">
                    12:45 PM
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={12} className="text-primary-foreground/70" />
                  <span className="text-xs text-primary-foreground/70">
                    Green Park
                  </span>
                </div>
              </div>
            </div>
            <Badge className="bg-white/20 text-primary-foreground hover:bg-white/30 text-xs">
              {deliverySteps[currentStepIdx].label}
            </Badge>
          </div>

          {/* Stepper */}
          <div className="relative">
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-white/20">
              <div
                className="h-full bg-white transition-all duration-700"
                style={{
                  width: `${(currentStepIdx / (deliverySteps.length - 1)) * 100}%`,
                }}
              />
            </div>
            <div className="flex justify-between relative z-10">
              {deliverySteps.map(({ id, label, icon: Icon }, i) => {
                const done = i <= currentStepIdx;
                const active = i === currentStepIdx;
                return (
                  <div
                    key={id}
                    data-ocid={`delivery.step.item.${i + 1}`}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <motion.div
                      animate={{ scale: active ? [1, 1.2, 1] : 1 }}
                      transition={{
                        duration: 1,
                        repeat: active ? Number.POSITIVE_INFINITY : 0,
                        repeatDelay: 1,
                      }}
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        done
                          ? "bg-white text-primary"
                          : "bg-white/20 text-white/50",
                      )}
                    >
                      <Icon size={14} />
                    </motion.div>
                    <span
                      className={cn(
                        "text-[9px] font-medium",
                        done ? "text-white" : "text-white/50",
                      )}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Skip Toggle */}
        <div
          className="bg-card rounded-2xl p-4 shadow-card flex items-center justify-between"
          data-ocid="delivery.skip.card"
        >
          <div>
            <p className="font-semibold">Skip Today's Meal</p>
            <p className="text-xs text-muted-foreground">
              Won't be charged for skipped deliveries
            </p>
          </div>
          <Switch
            checked={skipMeal}
            onCheckedChange={handleSkipToggle}
            data-ocid="delivery.skip.switch"
          />
        </div>

        {/* Skip Confirm */}
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-destructive/10 border border-destructive/30 rounded-xl p-4"
            data-ocid="delivery.skip_confirm.dialog"
          >
            <p className="font-semibold text-sm">Skip today's delivery?</p>
            <p className="text-xs text-muted-foreground mt-1 mb-3">
              This cannot be undone for today.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={confirmSkip}
                data-ocid="delivery.skip_confirm.confirm_button"
              >
                Yes, Skip
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowConfirm(false)}
                data-ocid="delivery.skip_confirm.cancel_button"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}

        {/* Change Delivery Time & Address */}
        <div
          className="bg-card rounded-2xl p-4 shadow-card"
          data-ocid="delivery.preferences.card"
        >
          <h3 className="font-semibold mb-4">Delivery Preferences</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="delivery-time">Delivery Time</Label>
              <Input
                id="delivery-time"
                type="time"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                className="mt-1.5 rounded-xl"
                data-ocid="delivery.time.input"
              />
            </div>
            <div>
              <Label htmlFor="delivery-address">Delivery Address</Label>
              <Input
                id="delivery-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1.5 rounded-xl"
                data-ocid="delivery.address.input"
              />
            </div>
            <Button
              className="w-full rounded-xl bg-primary text-primary-foreground shadow-green"
              onClick={handleSave}
              data-ocid="delivery.save.submit_button"
            >
              Save Changes
            </Button>
          </div>
        </div>

        {/* Past Orders */}
        <div>
          <h3 className="font-display text-lg font-bold mb-3">Last 7 Days</h3>
          <div className="space-y-2">
            {pastOrders.map((order, i) => (
              <div
                key={order.meal}
                data-ocid={`delivery.order.item.${i + 1}`}
                className="bg-card rounded-xl p-3 shadow-xs flex items-center gap-3"
              >
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Home size={16} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{order.meal}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.date} · {order.time}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-700 text-[10px]">
                  {order.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
