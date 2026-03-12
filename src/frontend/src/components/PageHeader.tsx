import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, ChevronLeft } from "lucide-react";
import { useApp } from "../context/AppContext";
import { type Route, useRouter } from "../context/RouterContext";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: Route;
  showNotification?: boolean;
  className?: string;
}

export default function PageHeader({
  title,
  subtitle,
  backTo,
  showNotification,
  className,
}: PageHeaderProps) {
  const { navigate } = useRouter();
  const { notificationCount } = useApp();

  return (
    <header
      className={cn(
        "flex items-center justify-between px-4 pt-6 pb-4",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {backTo && (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl"
            onClick={() => navigate(backTo)}
            data-ocid="header.back.button"
          >
            <ChevronLeft size={20} />
          </Button>
        )}
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {showNotification && (
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl relative"
          onClick={() => navigate("/notifications")}
          data-ocid="header.notifications.button"
        >
          <Bell size={20} />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 bg-destructive rounded-full w-2 h-2" />
          )}
        </Button>
      )}
    </header>
  );
}
