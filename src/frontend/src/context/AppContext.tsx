import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export interface UserProfile {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  fitnessGoal: string;
  dietaryPreferences: string[];
  allergies: string[];
  activityLevel: string;
  isOnboardingCompleted: boolean;
}

export interface Subscription {
  plan: string;
  billingCycle: string;
  isActive: boolean;
  status: string;
  startDate: number;
}

interface AppContextType {
  userProfile: UserProfile | null;
  setUserProfile: (p: UserProfile | null) => void;
  subscription: Subscription | null;
  setSubscription: (s: Subscription | null) => void;
  isOnboarded: boolean;
  setIsOnboarded: (v: boolean) => void;
  calorieGoal: number;
  caloriesConsumed: number;
  setCaloriesConsumed: (v: number) => void;
  notificationCount: number;
  setNotificationCount: (v: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const defaultProfile: UserProfile = {
  name: "Priya",
  age: 28,
  gender: "female",
  height: 165,
  weight: 62,
  fitnessGoal: "weight-loss",
  dietaryPreferences: ["vegetarian"],
  allergies: [],
  activityLevel: "moderately-active",
  isOnboardingCompleted: true,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(
    () => {
      const saved = localStorage.getItem("fitbowl_profile");
      return saved ? JSON.parse(saved) : defaultProfile;
    },
  );

  const [subscription, setSubscriptionState] = useState<Subscription | null>(
    () => {
      const saved = localStorage.getItem("fitbowl_subscription");
      return saved
        ? JSON.parse(saved)
        : {
            plan: "Balance",
            billingCycle: "monthly",
            isActive: true,
            status: "active",
            startDate: Date.now() - 1000 * 60 * 60 * 24 * 5,
          };
    },
  );

  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    const saved = localStorage.getItem("fitbowl_onboarded");
    return saved === "true" || (userProfile?.isOnboardingCompleted ?? false);
  });

  const [caloriesConsumed, setCaloriesConsumed] = useState(1420);
  const [notificationCount, setNotificationCount] = useState(2);

  const setUserProfile = (p: UserProfile | null) => {
    setUserProfileState(p);
    if (p) localStorage.setItem("fitbowl_profile", JSON.stringify(p));
  };

  const setSubscription = (s: Subscription | null) => {
    setSubscriptionState(s);
    if (s) localStorage.setItem("fitbowl_subscription", JSON.stringify(s));
  };

  useEffect(() => {
    localStorage.setItem("fitbowl_onboarded", String(isOnboarded));
  }, [isOnboarded]);

  const calorieGoal = userProfile
    ? userProfile.fitnessGoal === "weight-loss"
      ? 1500
      : userProfile.fitnessGoal === "muscle-gain"
        ? 2200
        : 1800
    : 1800;

  return (
    <AppContext.Provider
      value={{
        userProfile,
        setUserProfile,
        subscription,
        setSubscription,
        isOnboarded,
        setIsOnboarded,
        calorieGoal,
        caloriesConsumed,
        setCaloriesConsumed,
        notificationCount,
        setNotificationCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
