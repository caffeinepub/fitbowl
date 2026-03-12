import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  CreditCard,
  Edit2,
  LayoutDashboard,
  Menu as MenuIcon,
  Package,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  Truck,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "../context/RouterContext";
import { mockCustomers, mockMeals } from "../data/mockData";

type AdminSection =
  | "dashboard"
  | "customers"
  | "meals"
  | "subscriptions"
  | "deliveries"
  | "menu";

const sidebarItems = [
  {
    id: "dashboard" as AdminSection,
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  { id: "customers" as AdminSection, icon: Users, label: "Customers" },
  { id: "meals" as AdminSection, icon: UtensilsCrossed, label: "Meals" },
  {
    id: "subscriptions" as AdminSection,
    icon: CreditCard,
    label: "Subscriptions",
  },
  { id: "deliveries" as AdminSection, icon: Truck, label: "Deliveries" },
  { id: "menu" as AdminSection, icon: MenuIcon, label: "Menu" },
];

const statusColor: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  paused: "bg-amber-100 text-amber-700",
  cancelled: "bg-red-100 text-red-600",
  delivered: "bg-green-100 text-green-700",
  preparing: "bg-amber-100 text-amber-700",
  out: "bg-blue-100 text-blue-700",
};

const mockDeliveries = [
  {
    name: "Priya Sharma",
    meal: "Turmeric Curry",
    time: "1:00 PM",
    status: "delivered",
  },
  { name: "Rahul Mehta", meal: "Salmon Bowl", time: "7:30 PM", status: "out" },
  {
    name: "Ananya Iyer",
    meal: "Quinoa Bowl",
    time: "8:00 AM",
    status: "delivered",
  },
  {
    name: "Karan Patel",
    meal: "Mediterranean Bowl",
    time: "12:45 PM",
    status: "preparing",
  },
  {
    name: "Divya Nair",
    meal: "Açaí Bowl",
    time: "8:15 AM",
    status: "delivered",
  },
];

const mockSubs = [
  {
    name: "Priya Sharma",
    plan: "Balance",
    cycle: "Monthly",
    amount: 3499,
    status: "active",
    next: "Apr 12",
  },
  {
    name: "Rahul Mehta",
    plan: "Complete",
    cycle: "Yearly",
    amount: 47988,
    status: "active",
    next: "Jan 3",
  },
  {
    name: "Ananya Iyer",
    plan: "Lite",
    cycle: "Monthly",
    amount: 1999,
    status: "paused",
    next: "—",
  },
  {
    name: "Karan Patel",
    plan: "Balance",
    cycle: "Monthly",
    amount: 3499,
    status: "active",
    next: "Apr 1",
  },
  {
    name: "Divya Nair",
    plan: "Complete",
    cycle: "Monthly",
    amount: 4999,
    status: "active",
    next: "Apr 8",
  },
];

type MealItem = {
  id: bigint;
  name: string;
  calories: bigint;
  protein: bigint;
  carbs: bigint;
  fat: bigint;
  tags: string[];
  description: string;
  imageUrl: string;
  nutritionistApproved: boolean;
  allergens: string[];
};

export default function AdminPanel() {
  const [section, setSection] = useState<AdminSection>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { navigate } = useRouter();
  const [meals, setMeals] = useState<MealItem[]>(mockMeals as MealItem[]);
  const [customers] = useState(mockCustomers);
  const [search, setSearch] = useState("");
  const [mealDialog, setMealDialog] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealItem | null>(null);
  const [mealForm, setMealForm] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    description: "",
    tags: "",
  });
  const [menuEnabled, setMenuEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(mockMeals.map((m) => [m.id.toString(), true])),
  );

  const openAddMeal = () => {
    setEditingMeal(null);
    setMealForm({
      name: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      description: "",
      tags: "",
    });
    setMealDialog(true);
  };

  const openEditMeal = (meal: MealItem) => {
    setEditingMeal(meal);
    setMealForm({
      name: meal.name,
      calories: String(meal.calories),
      protein: String(meal.protein),
      carbs: String(meal.carbs),
      fat: String(meal.fat),
      description: meal.description,
      tags: meal.tags.join(", "),
    });
    setMealDialog(true);
  };

  const saveMeal = () => {
    const m: MealItem = {
      id: editingMeal ? editingMeal.id : BigInt(Date.now()),
      name: mealForm.name,
      calories: BigInt(Number.parseInt(mealForm.calories) || 0),
      protein: BigInt(Number.parseInt(mealForm.protein) || 0),
      carbs: BigInt(Number.parseInt(mealForm.carbs) || 0),
      fat: BigInt(Number.parseInt(mealForm.fat) || 0),
      description: mealForm.description,
      tags: mealForm.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      imageUrl:
        editingMeal?.imageUrl || "/assets/generated/meal-lunch.dim_400x300.jpg",
      nutritionistApproved: true,
      allergens: [],
    };
    if (editingMeal) {
      setMeals((prev) => prev.map((x) => (x.id === editingMeal.id ? m : x)));
      toast.success("Meal updated!");
    } else {
      setMeals((prev) => [...prev, m]);
      toast.success("Meal added!");
    }
    setMealDialog(false);
  };

  const deleteMeal = (id: bigint) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
    toast.success("Meal removed");
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen flex bg-sidebar">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-60 bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-300",
          "md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/fitbowl-logo-transparent.dim_200x200.png"
              className="w-8 h-8 object-contain bg-sidebar-accent rounded-lg p-1"
              alt=""
            />
            <div>
              <p className="font-display font-bold text-sm text-sidebar-foreground">
                FitBowl
              </p>
              <p className="text-[10px] text-sidebar-foreground/50">
                Admin Panel
              </p>
            </div>
          </div>
        </div>
        <nav className="flex-1 py-4 px-2 space-y-1">
          {sidebarItems.map(({ id, icon: Icon, label }) => (
            <button
              type="button"
              key={id}
              data-ocid={`admin.${id}.link`}
              onClick={() => {
                setSection(id);
                setSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                section === id
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
            data-ocid="admin.exit.link"
          >
            <ChevronLeft size={14} /> Back to App
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden cursor-pointer"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      {/* Main Content */}
      <main className="flex-1 bg-background min-h-screen overflow-auto">
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-border">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            data-ocid="admin.menu.button"
          >
            <MenuIcon size={20} />
          </button>
          <span className="font-display font-bold capitalize">{section}</span>
        </div>

        <div className="p-4 md:p-6">
          {section === "dashboard" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="font-display text-2xl font-bold">
                Dashboard Overview
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    icon: Users,
                    label: "Total Users",
                    value: "248",
                    change: "+12 this week",
                    color: "bg-blue-50 text-blue-600",
                  },
                  {
                    icon: CreditCard,
                    label: "Active Subs",
                    value: "192",
                    change: "+5 today",
                    color: "bg-green-50 text-green-600",
                  },
                  {
                    icon: Truck,
                    label: "Today's Deliveries",
                    value: "87",
                    change: "3 pending",
                    color: "bg-amber-50 text-amber-600",
                  },
                  {
                    icon: TrendingUp,
                    label: "Revenue (MTD)",
                    value: "₹6.7L",
                    change: "+18%",
                    color: "bg-purple-50 text-purple-600",
                  },
                ].map(({ icon: Icon, label, value, change, color }, i) => (
                  <div
                    key={label}
                    data-ocid={`admin.stat.item.${i + 1}`}
                    className="bg-card rounded-2xl p-4 shadow-card"
                  >
                    <div
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center mb-3",
                        color,
                      )}
                    >
                      <Icon size={16} />
                    </div>
                    <p className="font-display font-bold text-2xl">{value}</p>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-xs text-primary mt-1">{change}</p>
                  </div>
                ))}
              </div>
              <div className="bg-card rounded-2xl p-4 shadow-card">
                <h3 className="font-display font-bold mb-4">
                  Recent Deliveries
                </h3>
                <div className="space-y-2">
                  {mockDeliveries.slice(0, 4).map((d, i) => (
                    <div
                      key={`${d.name}-dash`}
                      data-ocid={`admin.delivery.item.${i + 1}`}
                      className="flex items-center gap-3 py-2 border-b border-border last:border-0"
                    >
                      <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                        <Package size={14} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{d.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {d.meal} · {d.time}
                        </p>
                      </div>
                      <Badge
                        className={cn(
                          "text-[10px]",
                          statusColor[d.status] || "bg-secondary",
                        )}
                      >
                        {d.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {section === "customers" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold">Customers</h2>
                <span className="text-sm text-muted-foreground">
                  {customers.length} total
                </span>
              </div>
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Search customers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 rounded-xl"
                  data-ocid="admin.customers.search_input"
                />
              </div>
              <div
                className="bg-card rounded-2xl shadow-card overflow-hidden"
                data-ocid="admin.customers.table"
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Email
                      </TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Joined
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((c, i) => (
                      <TableRow
                        key={c.id}
                        data-ocid={`admin.customer.row.${i + 1}`}
                      >
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell className="text-muted-foreground hidden md:table-cell text-sm">
                          {c.email}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{c.plan}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "text-[10px]",
                              statusColor[c.status] || "bg-secondary",
                            )}
                          >
                            {c.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm hidden md:table-cell">
                          {c.joinDate}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredCustomers.length === 0 && (
                  <div
                    className="py-10 text-center"
                    data-ocid="admin.customers.empty_state"
                  >
                    <p className="text-muted-foreground">No customers found</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {section === "meals" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold">
                  Meal Management
                </h2>
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground rounded-xl shadow-green"
                  onClick={openAddMeal}
                  data-ocid="admin.meals.open_modal_button"
                >
                  <Plus size={14} className="mr-1" /> Add Meal
                </Button>
              </div>
              <div
                className="bg-card rounded-2xl shadow-card overflow-hidden"
                data-ocid="admin.meals.table"
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Meal</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Calories
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Tags
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {meals.map((meal, i) => (
                      <TableRow
                        key={meal.id.toString()}
                        data-ocid={`admin.meal.row.${i + 1}`}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <img
                              src={meal.imageUrl}
                              alt=""
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                            <p className="font-medium text-sm line-clamp-1">
                              {meal.name}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {String(meal.calories)} kcal
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex gap-1 flex-wrap">
                            {meal.tags.slice(0, 2).map((t) => (
                              <Badge
                                key={t}
                                variant="secondary"
                                className="text-[10px]"
                              >
                                {t}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openEditMeal(meal)}
                              data-ocid={`admin.meal.edit_button.${i + 1}`}
                            >
                              <Edit2 size={13} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => deleteMeal(meal.id)}
                              data-ocid={`admin.meal.delete_button.${i + 1}`}
                            >
                              <Trash2 size={13} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          )}

          {section === "subscriptions" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <h2 className="font-display text-2xl font-bold">Subscriptions</h2>
              <div
                className="bg-card rounded-2xl shadow-card overflow-hidden"
                data-ocid="admin.subscriptions.table"
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Cycle
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Next Renewal
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSubs.map((s, i) => (
                      <TableRow
                        key={s.name}
                        data-ocid={`admin.subscription.row.${i + 1}`}
                      >
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{s.plan}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm hidden md:table-cell">
                          {s.cycle}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn("text-[10px]", statusColor[s.status])}
                          >
                            {s.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm hidden md:table-cell">
                          {s.next}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          )}

          {section === "deliveries" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <h2 className="font-display text-2xl font-bold">
                Today's Deliveries
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {["preparing", "out", "delivered"].map((s) => (
                  <div key={s} className="bg-card rounded-2xl p-4 shadow-card">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge
                        className={cn(
                          "capitalize",
                          statusColor[s] || "bg-secondary",
                        )}
                      >
                        {s === "out" ? "Out for Delivery" : s}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {mockDeliveries.filter((d) => d.status === s).length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {mockDeliveries
                        .filter((d) => d.status === s)
                        .map((d, i) => (
                          <div
                            key={`${d.name}-board`}
                            data-ocid={`admin.delivery_board.item.${i + 1}`}
                            className="bg-secondary rounded-xl p-3"
                          >
                            <p className="font-medium text-sm">{d.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {d.meal} · {d.time}
                            </p>
                          </div>
                        ))}
                      {mockDeliveries.filter((d) => d.status === s).length ===
                        0 && (
                        <p className="text-xs text-muted-foreground text-center py-4">
                          None
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {section === "menu" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <h2 className="font-display text-2xl font-bold">
                Menu Management
              </h2>
              <div className="space-y-2">
                {meals.map((meal, i) => (
                  <div
                    key={meal.id.toString()}
                    data-ocid={`admin.menu.item.${i + 1}`}
                    className="bg-card rounded-xl p-3 shadow-xs flex items-center gap-3"
                  >
                    <img
                      src={meal.imageUrl}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {meal.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {String(meal.calories)} kcal
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {menuEnabled[meal.id.toString()] ? "Active" : "Hidden"}
                      </span>
                      <Switch
                        checked={menuEnabled[meal.id.toString()] ?? true}
                        onCheckedChange={(v) =>
                          setMenuEnabled((prev) => ({
                            ...prev,
                            [meal.id.toString()]: v,
                          }))
                        }
                        data-ocid={`admin.menu.toggle.${i + 1}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Dialog open={mealDialog} onOpenChange={setMealDialog}>
        <DialogContent className="max-w-md" data-ocid="admin.meal.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingMeal ? "Edit Meal" : "Add New Meal"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Meal Name</Label>
              <Input
                value={mealForm.name}
                onChange={(e) =>
                  setMealForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Sunrise Quinoa Bowl"
                className="mt-1 rounded-xl"
                data-ocid="admin.meal.name.input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Calories (kcal)</Label>
                <Input
                  type="number"
                  value={mealForm.calories}
                  onChange={(e) =>
                    setMealForm((f) => ({ ...f, calories: e.target.value }))
                  }
                  className="mt-1 rounded-xl"
                  data-ocid="admin.meal.calories.input"
                />
              </div>
              <div>
                <Label>Protein (g)</Label>
                <Input
                  type="number"
                  value={mealForm.protein}
                  onChange={(e) =>
                    setMealForm((f) => ({ ...f, protein: e.target.value }))
                  }
                  className="mt-1 rounded-xl"
                  data-ocid="admin.meal.protein.input"
                />
              </div>
              <div>
                <Label>Carbs (g)</Label>
                <Input
                  type="number"
                  value={mealForm.carbs}
                  onChange={(e) =>
                    setMealForm((f) => ({ ...f, carbs: e.target.value }))
                  }
                  className="mt-1 rounded-xl"
                  data-ocid="admin.meal.carbs.input"
                />
              </div>
              <div>
                <Label>Fat (g)</Label>
                <Input
                  type="number"
                  value={mealForm.fat}
                  onChange={(e) =>
                    setMealForm((f) => ({ ...f, fat: e.target.value }))
                  }
                  className="mt-1 rounded-xl"
                  data-ocid="admin.meal.fat.input"
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={mealForm.description}
                onChange={(e) =>
                  setMealForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Brief description"
                className="mt-1 rounded-xl"
                data-ocid="admin.meal.description.input"
              />
            </div>
            <div>
              <Label>Tags (comma-separated)</Label>
              <Input
                value={mealForm.tags}
                onChange={(e) =>
                  setMealForm((f) => ({ ...f, tags: e.target.value }))
                }
                placeholder="breakfast, vegan, high-protein"
                className="mt-1 rounded-xl"
                data-ocid="admin.meal.tags.input"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setMealDialog(false)}
              data-ocid="admin.meal.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="bg-primary text-primary-foreground"
              onClick={saveMeal}
              data-ocid="admin.meal.save_button"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
