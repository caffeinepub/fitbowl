# FitBowl

## Current State
New project — no existing code.

## Requested Changes (Diff)

### Add
- Full-stack FitBowl health meal subscription app
- Multi-step onboarding flow (name, age, gender, height, weight, fitness goal, dietary prefs, allergies, activity level) with personalized meal plan recommendation
- Subscription plans page (1/2/3 meals/day, monthly/yearly/student pricing, subscribe/pause/modify)
- Meal customization (preferences per day, ingredient exclusions, calorie targets, weekly change option, nutritionist badge)
- Daily 5-minute health dashboard (today's meals, nutrition summary, calorie progress bar, weight tracker, daily health tip)
- Stress & wellness section (animated breathing exercise, nutrition tip, energy-boost tips carousel)
- Ordering & delivery page (confirm delivery, delivery status tracker, change delivery time/location, skip meal toggle)
- Progress tracking page (weight chart, calories chart, health goals progress, visual indicators using recharts)
- Notifications panel (delivery updates, wellness reminders, nutrition tips, subscription alerts)
- Payment integration UI (UPI/card/net banking selection, auto-renewal toggle, payment history — mock flow)
- Admin panel at /admin (customer table, meal management, subscription tracker, delivery monitoring, menu update)
- Bottom navigation bar for mobile
- Role-based access (admin vs user)

### Modify
- Nothing (new project)

### Remove
- Nothing

## Implementation Plan
1. Backend: user profiles, subscriptions, meals catalog, orders, delivery status, notifications, payment records, admin CRUD
2. Frontend: onboarding flow, dashboard, subscription page, meal customization, wellness, delivery, progress, notifications, payment, admin panel
3. Authorization component for role-based admin access
4. Mock/sample data seeded throughout
5. Recharts for progress charts
6. Mobile-first responsive with bottom nav bar
