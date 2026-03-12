import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  Bell,
  ClipboardList,
  CreditCard,
  Heart,
  Home,
  MoreHorizontal,
  TrendingUp,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { type Route, useRouter } from "../context/RouterContext";

const navItems: { path: Route | "more"; icon: any; label: string }[] = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/meals", icon: UtensilsCrossed, label: "Meals" },
  { path: "/wellness", icon: Heart, label: "Wellness" },
  { path: "/progress", icon: TrendingUp, label: "Progress" },
  { path: "more", icon: MoreHorizontal, label: "More" },
];

const moreItems: { path: Route; icon: any; label: string }[] = [
  { path: "/delivery", icon: Truck, label: "Delivery" },
  { path: "/payment", icon: CreditCard, label: "Payment" },
  { path: "/notifications", icon: Bell, label: "Notifications" },
  { path: "/plans", icon: ClipboardList, label: "Plans" },
];

export default function BottomNav() {
  const { currentRoute, navigate } = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);
  const { notificationCount } = useApp();

  if (currentRoute === "/admin") return null;

  return (
    <>
      <div className="h-20 md:hidden" />
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        data-ocid="nav.panel"
      >
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const isActive = item.path !== "more" && currentRoute === item.path;
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={item.path}
                data-ocid={`nav.${item.label.toLowerCase()}.link`}
                onClick={() => {
                  if (item.path === "more") setMoreOpen(true);
                  else navigate(item.path as Route);
                }}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                <div
                  className={cn(
                    "relative p-1.5 rounded-xl",
                    isActive && "bg-primary/10",
                  )}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  {item.label === "More" && notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl"
          data-ocid="more.sheet"
        >
          <SheetHeader className="mb-4">
            <SheetTitle className="font-display">More Options</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-2 gap-3 pb-6">
            {moreItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  key={item.path}
                  data-ocid={`more.${item.label.toLowerCase()}.link`}
                  onClick={() => {
                    setMoreOpen(false);
                    navigate(item.path);
                  }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-secondary hover:bg-primary/10 transition-colors text-left"
                >
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <span className="font-medium text-sm">{item.label}</span>
                  {item.label === "Notifications" && notificationCount > 0 && (
                    <span className="ml-auto bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
