import { type ReactNode, createContext, useContext, useState } from "react";

export type Route =
  | "/"
  | "/plans"
  | "/meals"
  | "/wellness"
  | "/delivery"
  | "/progress"
  | "/notifications"
  | "/payment"
  | "/admin";

interface RouterContextType {
  currentRoute: Route;
  navigate: (route: Route) => void;
}

const RouterContext = createContext<RouterContextType | null>(null);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [currentRoute, setCurrentRoute] = useState<Route>(() => {
    const hash = window.location.hash.replace("#", "") as Route;
    const validRoutes: Route[] = [
      "/",
      "/plans",
      "/meals",
      "/wellness",
      "/delivery",
      "/progress",
      "/notifications",
      "/payment",
      "/admin",
    ];
    return validRoutes.includes(hash) ? hash : "/";
  });

  const navigate = (route: Route) => {
    window.location.hash = route;
    setCurrentRoute(route);
    window.scrollTo(0, 0);
  };

  return (
    <RouterContext.Provider value={{ currentRoute, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be inside RouterProvider");
  return ctx;
}
