import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Subscription {
    status: string;
    userId: Principal;
    plan: string;
    isActive: boolean;
    billingCycle: string;
    startDate: Time;
}
export interface Meal {
    id: bigint;
    fat: bigint;
    carbs: bigint;
    calories: bigint;
    name: string;
    tags: Array<string>;
    description: string;
    imageUrl: string;
    nutritionistApproved: boolean;
    allergens: Array<string>;
    protein: bigint;
}
export interface DailyMealOrder {
    id: bigint;
    status: string;
    deliveryAddress: string;
    userId: Principal;
    date: Time;
    skip: boolean;
    deliveryTime: bigint;
    selectedMeals: Array<bigint>;
}
export type Time = bigint;
export interface Notification {
    id: bigint;
    userId: Principal;
    notificationType: string;
    read: boolean;
    message: string;
    timestamp: Time;
}
export interface PaymentRecord {
    id: bigint;
    status: string;
    method: string;
    userId: Principal;
    date: Time;
    subscriptionPlan: string;
    amount: bigint;
}
export interface ProgressEntry {
    value: number;
    date: Time;
}
export interface UserProfile {
    age: bigint;
    weight: number;
    height: number;
    activityLevel: string;
    fitnessGoal: string;
    dietaryPreferences: Array<string>;
    name: string;
    isOnboardingCompleted: boolean;
    gender: string;
    allergies: Array<string>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addDailyOrder(order: DailyMealOrder): Promise<bigint>;
    addMeal(meal: Meal): Promise<bigint>;
    addPaymentRecord(payment: PaymentRecord): Promise<bigint>;
    addProgressEntry(value: number): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteMeal(mealId: bigint): Promise<void>;
    getAllMeals(): Promise<Array<Meal>>;
    getCallerSubscription(): Promise<Subscription | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDailyOrder(orderId: bigint): Promise<DailyMealOrder | null>;
    getMeal(mealId: bigint): Promise<Meal | null>;
    getOrdersByUser(user: Principal): Promise<Array<DailyMealOrder>>;
    getPaymentsByUser(user: Principal): Promise<Array<PaymentRecord>>;
    getProgressEntries(): Promise<Array<ProgressEntry>>;
    getUserId(): Promise<Principal>;
    getUserNotifications(): Promise<Array<Notification>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserSubscription(user: Principal): Promise<Subscription | null>;
    isCallerAdmin(): Promise<boolean>;
    markNotificationAsRead(notificationId: bigint): Promise<void>;
    saveCallerSubscription(subscription: Subscription): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendNotification(userId: Principal, message: string, notificationType: string): Promise<void>;
    updateDailyOrder(orderId: bigint, updatedOrder: DailyMealOrder): Promise<void>;
    updateMeal(mealId: bigint, updatedMeal: Meal): Promise<void>;
}
