// ─── Mock Meals ────────────────────────────────────────────────────────────
export const mockMeals = [
  {
    id: BigInt(1),
    name: "Sunrise Quinoa Bowl",
    description:
      "Fluffy quinoa with roasted sweet potato, spinach, and a soft-boiled egg.",
    calories: BigInt(420),
    protein: BigInt(22),
    carbs: BigInt(48),
    fat: BigInt(14),
    tags: ["breakfast", "vegetarian", "high-protein"],
    allergens: ["eggs"],
    nutritionistApproved: true,
    imageUrl: "/assets/generated/meal-breakfast.dim_400x300.jpg",
  },
  {
    id: BigInt(2),
    name: "Açaí Power Bowl",
    description:
      "Blended açaí base with granola, banana, fresh berries, and honey.",
    calories: BigInt(380),
    protein: BigInt(8),
    carbs: BigInt(65),
    fat: BigInt(10),
    tags: ["breakfast", "vegan", "antioxidant"],
    allergens: ["nuts", "gluten"],
    nutritionistApproved: true,
    imageUrl: "/assets/generated/meal-breakfast.dim_400x300.jpg",
  },
  {
    id: BigInt(3),
    name: "Green Goddess Smoothie Bowl",
    description:
      "Spirulina, mango, banana blend topped with chia seeds and coconut.",
    calories: BigInt(310),
    protein: BigInt(12),
    carbs: BigInt(52),
    fat: BigInt(7),
    tags: ["breakfast", "vegan", "low-calorie"],
    allergens: [],
    nutritionistApproved: true,
    imageUrl: "/assets/generated/meal-breakfast.dim_400x300.jpg",
  },
  {
    id: BigInt(4),
    name: "Mediterranean Harvest Bowl",
    description:
      "Grilled chicken over farro with roasted veggies, hummus, and tzatziki.",
    calories: BigInt(580),
    protein: BigInt(42),
    carbs: BigInt(52),
    fat: BigInt(18),
    tags: ["lunch", "non-veg", "high-protein"],
    allergens: ["dairy", "gluten"],
    nutritionistApproved: true,
    imageUrl: "/assets/generated/meal-lunch.dim_400x300.jpg",
  },
  {
    id: BigInt(5),
    name: "Thai Peanut Tofu Bowl",
    description:
      "Crispy tofu on jasmine rice with peanut sauce, shredded cabbage, and lime.",
    calories: BigInt(510),
    protein: BigInt(24),
    carbs: BigInt(58),
    fat: BigInt(19),
    tags: ["lunch", "vegan", "high-fiber"],
    allergens: ["nuts", "soy"],
    nutritionistApproved: true,
    imageUrl: "/assets/generated/meal-lunch.dim_400x300.jpg",
  },
  {
    id: BigInt(6),
    name: "Garden Lentil Soup Bowl",
    description:
      "Warming red lentil soup with cumin, kale, lemon, and whole-grain bread.",
    calories: BigInt(390),
    protein: BigInt(18),
    carbs: BigInt(60),
    fat: BigInt(7),
    tags: ["lunch", "vegan", "iron-rich"],
    allergens: ["gluten"],
    nutritionistApproved: true,
    imageUrl: "/assets/generated/meal-lunch.dim_400x300.jpg",
  },
  {
    id: BigInt(7),
    name: "Miso Glazed Salmon Bowl",
    description:
      "Atlantic salmon with brown rice, edamame, avocado, and sesame ginger dressing.",
    calories: BigInt(620),
    protein: BigInt(46),
    carbs: BigInt(44),
    fat: BigInt(24),
    tags: ["dinner", "non-veg", "omega-3"],
    allergens: ["fish", "soy"],
    nutritionistApproved: true,
    imageUrl: "/assets/generated/meal-dinner.dim_400x300.jpg",
  },
  {
    id: BigInt(8),
    name: "Turmeric Cauliflower Curry Bowl",
    description:
      "Fragrant cauliflower and chickpea curry on basmati with mango chutney.",
    calories: BigInt(450),
    protein: BigInt(16),
    carbs: BigInt(68),
    fat: BigInt(12),
    tags: ["dinner", "vegan", "anti-inflammatory"],
    allergens: [],
    nutritionistApproved: true,
    imageUrl: "/assets/generated/meal-dinner.dim_400x300.jpg",
  },
  {
    id: BigInt(9),
    name: "Herb-Crusted Chicken Bowl",
    description:
      "Rosemary chicken breast with roasted root vegetables and garlic quinoa.",
    calories: BigInt(540),
    protein: BigInt(48),
    carbs: BigInt(42),
    fat: BigInt(16),
    tags: ["dinner", "non-veg", "muscle-gain"],
    allergens: [],
    nutritionistApproved: true,
    imageUrl: "/assets/generated/meal-dinner.dim_400x300.jpg",
  },
  {
    id: BigInt(10),
    name: "Spiced Oat Porridge Bowl",
    description:
      "Steel-cut oats with cinnamon, stewed apple, walnuts, and maple syrup.",
    calories: BigInt(340),
    protein: BigInt(10),
    carbs: BigInt(58),
    fat: BigInt(9),
    tags: ["breakfast", "vegetarian", "heart-healthy"],
    allergens: ["nuts", "gluten"],
    nutritionistApproved: true,
    imageUrl: "/assets/generated/meal-breakfast.dim_400x300.jpg",
  },
  {
    id: BigInt(11),
    name: "Black Bean Burrito Bowl",
    description:
      "Cilantro-lime rice with spiced black beans, pico de gallo, and cashew cream.",
    calories: BigInt(490),
    protein: BigInt(20),
    carbs: BigInt(72),
    fat: BigInt(13),
    tags: ["lunch", "vegan", "high-fiber"],
    allergens: ["nuts"],
    nutritionistApproved: true,
    imageUrl: "/assets/generated/meal-lunch.dim_400x300.jpg",
  },
  {
    id: BigInt(12),
    name: "Grilled Prawn Buddha Bowl",
    description:
      "Tiger prawns with soba noodles, cucumber ribbons, and ponzu dressing.",
    calories: BigInt(430),
    protein: BigInt(38),
    carbs: BigInt(40),
    fat: BigInt(11),
    tags: ["dinner", "non-veg", "low-fat"],
    allergens: ["shellfish", "gluten", "soy"],
    nutritionistApproved: true,
    imageUrl: "/assets/generated/meal-dinner.dim_400x300.jpg",
  },
];

// ─── Weight Progress (30 days: gradual loss from 78 → 75.2) ─────────────────
export const mockWeightData = Array.from({ length: 30 }, (_, i) => {
  const base = new Date();
  base.setDate(base.getDate() - (29 - i));
  const weight = Number.parseFloat(
    (78 - i * 0.093 + (Math.random() - 0.5) * 0.3).toFixed(1),
  );
  return {
    date: base.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
    weight,
    value: weight,
  };
});

// ─── Calorie Data (7 days) ───────────────────────────────────────────────────
export const mockCalorieData = [
  { day: "Mon", consumed: 1650, goal: 1800 },
  { day: "Tue", consumed: 1820, goal: 1800 },
  { day: "Wed", consumed: 1540, goal: 1800 },
  { day: "Thu", consumed: 1780, goal: 1800 },
  { day: "Fri", consumed: 1920, goal: 1800 },
  { day: "Sat", consumed: 1400, goal: 1800 },
  { day: "Sun", consumed: 1710, goal: 1800 },
];

// ─── Notifications ───────────────────────────────────────────────────────────
export const mockNotifications = [
  {
    id: BigInt(1),
    userId: null as any,
    notificationType: "delivery",
    read: false,
    message:
      "Your lunch bowl is out for delivery! Estimated arrival: 12:45 PM.",
    timestamp: BigInt(Date.now() - 1000 * 60 * 20),
  },
  {
    id: BigInt(2),
    userId: null as any,
    notificationType: "wellness",
    read: false,
    message:
      "Time for your 5-minute breathing exercise. Take a mindful break! 🌿",
    timestamp: BigInt(Date.now() - 1000 * 60 * 60),
  },
  {
    id: BigInt(3),
    userId: null as any,
    notificationType: "nutrition",
    read: true,
    message:
      "Great job hitting your protein target yesterday! You consumed 48g of protein.",
    timestamp: BigInt(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: BigInt(4),
    userId: null as any,
    notificationType: "subscription",
    read: true,
    message: "Your Balance plan renews in 7 days. Auto-renewal is ON.",
    timestamp: BigInt(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: BigInt(5),
    userId: null as any,
    notificationType: "delivery",
    read: true,
    message: "Yesterday's dinner was delivered. Rate your meal! ⭐",
    timestamp: BigInt(Date.now() - 1000 * 60 * 60 * 26),
  },
  {
    id: BigInt(6),
    userId: null as any,
    notificationType: "nutrition",
    read: true,
    message:
      "Tip: Drinking 500ml of water before meals can reduce calorie intake by up to 13%.",
    timestamp: BigInt(Date.now() - 1000 * 60 * 60 * 48),
  },
  {
    id: BigInt(7),
    userId: null as any,
    notificationType: "wellness",
    read: true,
    message:
      "Weekly check-in: You've maintained your calorie goal 5 out of 7 days. Keep it up! 💪",
    timestamp: BigInt(Date.now() - 1000 * 60 * 60 * 72),
  },
  {
    id: BigInt(8),
    userId: null as any,
    notificationType: "subscription",
    read: true,
    message:
      "Payment of ₹3,499 received for Balance Plan - Monthly. Invoice #FB-2024-089.",
    timestamp: BigInt(Date.now() - 1000 * 60 * 60 * 96),
  },
];

// ─── Payment History ─────────────────────────────────────────────────────────
export const mockPayments = [
  {
    id: BigInt(1),
    userId: null as any,
    subscriptionPlan: "Balance",
    amount: BigInt(3499),
    method: "UPI",
    status: "success",
    date: BigInt(Date.now() - 1000 * 60 * 60 * 24 * 5),
  },
  {
    id: BigInt(2),
    userId: null as any,
    subscriptionPlan: "Balance",
    amount: BigInt(3499),
    method: "Credit Card",
    status: "success",
    date: BigInt(Date.now() - 1000 * 60 * 60 * 24 * 35),
  },
  {
    id: BigInt(3),
    userId: null as any,
    subscriptionPlan: "Lite",
    amount: BigInt(1999),
    method: "UPI",
    status: "success",
    date: BigInt(Date.now() - 1000 * 60 * 60 * 24 * 65),
  },
  {
    id: BigInt(4),
    userId: null as any,
    subscriptionPlan: "Lite",
    amount: BigInt(1999),
    method: "Net Banking",
    status: "success",
    date: BigInt(Date.now() - 1000 * 60 * 60 * 24 * 95),
  },
  {
    id: BigInt(5),
    userId: null as any,
    subscriptionPlan: "Lite",
    amount: BigInt(1999),
    method: "UPI",
    status: "failed",
    date: BigInt(Date.now() - 1000 * 60 * 60 * 24 * 96),
  },
  {
    id: BigInt(6),
    userId: null as any,
    subscriptionPlan: "Complete",
    amount: BigInt(4999),
    method: "Credit Card",
    status: "success",
    date: BigInt(Date.now() - 1000 * 60 * 60 * 24 * 125),
  },
];

// ─── Admin Customers ─────────────────────────────────────────────────────────
export const mockCustomers = [
  {
    id: "1",
    name: "Priya Sharma",
    email: "priya@example.com",
    plan: "Balance",
    status: "active",
    joinDate: "Jan 12, 2024",
  },
  {
    id: "2",
    name: "Rahul Mehta",
    email: "rahul@example.com",
    plan: "Complete",
    status: "active",
    joinDate: "Feb 3, 2024",
  },
  {
    id: "3",
    name: "Ananya Iyer",
    email: "ananya@example.com",
    plan: "Lite",
    status: "paused",
    joinDate: "Feb 20, 2024",
  },
  {
    id: "4",
    name: "Karan Patel",
    email: "karan@example.com",
    plan: "Balance",
    status: "active",
    joinDate: "Mar 1, 2024",
  },
  {
    id: "5",
    name: "Divya Nair",
    email: "divya@example.com",
    plan: "Complete",
    status: "active",
    joinDate: "Mar 8, 2024",
  },
  {
    id: "6",
    name: "Arjun Gupta",
    email: "arjun@example.com",
    plan: "Lite",
    status: "cancelled",
    joinDate: "Jan 5, 2024",
  },
];

// ─── Health Tips ─────────────────────────────────────────────────────────────
export const healthTips = [
  {
    emoji: "🥗",
    tip: "Eat a rainbow of vegetables daily to ensure you get a wide range of micronutrients.",
    category: "Nutrition",
  },
  {
    emoji: "💧",
    tip: "Aim for 8 glasses of water daily. Add lemon or mint for flavor without calories.",
    category: "Hydration",
  },
  {
    emoji: "🚶",
    tip: "A 15-minute post-meal walk can improve blood sugar regulation by up to 30%.",
    category: "Activity",
  },
  {
    emoji: "😴",
    tip: "Quality sleep of 7-9 hours helps regulate hunger hormones ghrelin and leptin.",
    category: "Recovery",
  },
  {
    emoji: "🫁",
    tip: "Deep breathing for 5 minutes activates the parasympathetic nervous system, reducing cortisol.",
    category: "Wellness",
  },
  {
    emoji: "🧘",
    tip: "Mindful eating — chewing slowly and without screens — improves digestion and satiety.",
    category: "Mindfulness",
  },
];

// ─── Energy Tips ─────────────────────────────────────────────────────────────
export const energyTips = [
  {
    icon: "⚡",
    title: "Power Snack",
    body: "Pair complex carbs with protein for sustained energy. Try apple slices with almond butter.",
  },
  {
    icon: "☀️",
    title: "Morning Light",
    body: "Expose yourself to natural light within 30 minutes of waking to regulate circadian rhythm.",
  },
  {
    icon: "🎵",
    title: "Beat the Slump",
    body: "Listen to upbeat music during the 2-4 PM energy dip. It boosts dopamine naturally.",
  },
  {
    icon: "🌿",
    title: "Green Tea",
    body: "Swap your afternoon coffee for green tea — the L-theanine prevents energy crashes.",
  },
  {
    icon: "🧊",
    title: "Cold Water Splash",
    body: "Splash cold water on your wrists and face to instantly boost alertness within 30 seconds.",
  },
];
