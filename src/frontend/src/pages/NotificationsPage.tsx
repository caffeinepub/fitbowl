import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Bell,
  CheckCheck,
  CreditCard,
  Heart,
  Leaf,
  Package,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import PageHeader from "../components/PageHeader";
import { useApp } from "../context/AppContext";
import { mockNotifications } from "../data/mockData";

const typeConfig: Record<string, { icon: any; color: string; label: string }> =
  {
    delivery: {
      icon: Package,
      color: "bg-blue-100 text-blue-600",
      label: "Delivery",
    },
    wellness: {
      icon: Heart,
      color: "bg-pink-100 text-pink-600",
      label: "Wellness",
    },
    nutrition: {
      icon: Leaf,
      color: "bg-green-100 text-green-600",
      label: "Nutrition",
    },
    subscription: {
      icon: CreditCard,
      color: "bg-purple-100 text-purple-600",
      label: "Subscription",
    },
  };

function timeAgo(ts: bigint): string {
  const diff = Date.now() - Number(ts);
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function groupNotifications(notifications: typeof mockNotifications) {
  const now = Date.now();
  const today: typeof mockNotifications = [];
  const week: typeof mockNotifications = [];
  const earlier: typeof mockNotifications = [];
  for (const n of notifications) {
    const diff = now - Number(n.timestamp);
    const hrs = diff / (1000 * 60 * 60);
    if (hrs < 24) today.push(n);
    else if (hrs < 168) week.push(n);
    else earlier.push(n);
  }
  return { today, week, earlier };
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState("all");
  const { setNotificationCount } = useApp();

  const markAllRead = () => {
    setNotifications((n) => n.map((item) => ({ ...item, read: true })));
    setNotificationCount(0);
    toast.success("All notifications marked as read");
  };

  const markRead = (id: bigint) => {
    setNotifications((n) =>
      n.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
    const unread = notifications.filter((n) => !n.read && n.id !== id).length;
    setNotificationCount(unread);
  };

  const filtered =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => n.notificationType === activeTab);
  const groups = groupNotifications(filtered);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="flex items-center justify-between px-4 pt-6 pb-2">
        <div>
          <h1 className="font-display text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {unreadCount} unread
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            size="sm"
            variant="ghost"
            className="text-primary"
            onClick={markAllRead}
            data-ocid="notifications.mark_all.button"
          >
            <CheckCheck size={14} className="mr-1" /> Mark all read
          </Button>
        )}
      </div>

      <div className="px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList
            className="w-full mb-4 rounded-xl"
            data-ocid="notifications.filter.tab"
          >
            {["all", "delivery", "wellness", "nutrition", "subscription"].map(
              (t) => (
                <TabsTrigger
                  key={t}
                  value={t}
                  className="flex-1 text-xs capitalize"
                >
                  {t}
                </TabsTrigger>
              ),
            )}
          </TabsList>

          <TabsContent value={activeTab} className="space-y-5 mt-0">
            {groups.today.length > 0 && (
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Today
                </p>
                <NotificationList items={groups.today} onRead={markRead} />
              </div>
            )}
            {groups.week.length > 0 && (
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  This Week
                </p>
                <NotificationList items={groups.week} onRead={markRead} />
              </div>
            )}
            {groups.earlier.length > 0 && (
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Earlier
                </p>
                <NotificationList items={groups.earlier} onRead={markRead} />
              </div>
            )}
            {filtered.length === 0 && (
              <div
                className="text-center py-16"
                data-ocid="notifications.empty_state"
              >
                <Bell
                  size={36}
                  className="text-muted-foreground mx-auto mb-3"
                />
                <p className="font-semibold">No notifications</p>
                <p className="text-sm text-muted-foreground">
                  You're all caught up!
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function NotificationList({
  items,
  onRead,
}: { items: typeof mockNotifications; onRead: (id: bigint) => void }) {
  return (
    <div className="space-y-2">
      {items.map((n, i) => {
        const cfg = typeConfig[n.notificationType] || typeConfig.delivery;
        const Icon = cfg.icon;
        return (
          <button
            type="button"
            key={n.id.toString()}
            data-ocid={`notifications.item.${i + 1}`}
            onClick={() => !n.read && onRead(n.id)}
            className={cn(
              "w-full flex items-start gap-3 p-3.5 rounded-xl text-left transition-colors",
              n.read ? "bg-card" : "bg-primary/5 border border-primary/15",
            )}
          >
            <div
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                cfg.color,
              )}
            >
              <Icon size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                  {cfg.label}
                </Badge>
                <span className="text-[10px] text-muted-foreground flex-shrink-0">
                  {timeAgo(n.timestamp)}
                </span>
              </div>
              <p
                className={cn(
                  "text-sm mt-1 leading-relaxed",
                  !n.read && "font-medium",
                )}
              >
                {n.message}
              </p>
            </div>
            {!n.read && (
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
            )}
          </button>
        );
      })}
    </div>
  );
}
