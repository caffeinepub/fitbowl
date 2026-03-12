import Map "mo:core/Map";
import Array "mo:core/Array";
import List "mo:core/List";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Bool "mo:core/Bool";
import Int "mo:core/Int";
import Float "mo:core/Float";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type UserProfile = {
    name : Text;
    age : Nat;
    gender : Text;
    height : Float;
    weight : Float;
    fitnessGoal : Text;
    dietaryPreferences : [Text];
    allergies : [Text];
    activityLevel : Text;
    isOnboardingCompleted : Bool;
  };

  module UserProfile {
    public func compareByName(profile1 : UserProfile, profile2 : UserProfile) : Order.Order {
      Text.compare(profile1.name, profile2.name);
    };
  };

  type Subscription = {
    userId : Principal;
    plan : Text;
    billingCycle : Text;
    status : Text;
    startDate : Time.Time;
    isActive : Bool;
  };

  module Subscription {
    public func compareByStartDate(s1 : Subscription, s2 : Subscription) : Order.Order {
      Int.compare(s1.startDate, s2.startDate);
    };
  };

  type Meal = {
    id : Nat;
    name : Text;
    description : Text;
    calories : Nat;
    protein : Nat;
    carbs : Nat;
    fat : Nat;
    tags : [Text];
    nutritionistApproved : Bool;
    allergens : [Text];
    imageUrl : Text;
  };

  module Meal {
    public func compareByName(meal1 : Meal, meal2 : Meal) : Order.Order {
      Text.compare(meal1.name, meal2.name);
    };
  };

  type DailyMealOrder = {
    id : Nat;
    userId : Principal;
    date : Time.Time;
    selectedMeals : [Nat];
    deliveryTime : Nat;
    deliveryAddress : Text;
    status : Text;
    skip : Bool;
  };

  type ProgressEntry = {
    date : Time.Time;
    value : Float;
  };

  type Notification = {
    id : Nat;
    userId : Principal;
    message : Text;
    notificationType : Text;
    read : Bool;
    timestamp : Time.Time;
  };

  type PaymentRecord = {
    id : Nat;
    userId : Principal;
    amount : Nat;
    date : Time.Time;
    method : Text;
    subscriptionPlan : Text;
    status : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let subscriptions = Map.empty<Principal, Subscription>();
  let meals = Map.empty<Nat, Meal>();
  let dailyOrders = Map.empty<Nat, DailyMealOrder>();
  let progressTracking = Map.empty<Principal, [ProgressEntry]>();
  let notifications = Map.empty<Nat, Notification>();
  let payments = Map.empty<Nat, PaymentRecord>();

  var mealIdCounter = 0;
  var orderIdCounter = 0;
  var notificationIdCounter = 0;
  var paymentIdCounter = 0;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access this endpoint");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access this endpoint");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access this endpoint");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerSubscription() : async ?Subscription {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access this endpoint");
    };
    subscriptions.get(caller);
  };

  public query ({ caller }) func getUserSubscription(user : Principal) : async ?Subscription {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access this endpoint");
    };
    subscriptions.get(user);
  };

  public shared ({ caller }) func saveCallerSubscription(subscription : Subscription) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access this endpoint");
    };
    if (caller != subscription.userId) {
      Runtime.trap("Unauthorized: Can only create subscriptions for yourself.");
    };
    subscriptions.add(caller, subscription);
  };

  public shared ({ caller }) func addMeal(meal : Meal) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add meals");
    };
    mealIdCounter += 1;
    let newMeal = { meal with id = mealIdCounter };
    meals.add(mealIdCounter, newMeal);
    mealIdCounter;
  };

  public shared ({ caller }) func updateMeal(mealId : Nat, updatedMeal : Meal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update meals");
    };
    switch (meals.get(mealId)) {
      case (null) { Runtime.trap("Meal not found") };
      case (?_) {
        let newMeal = { updatedMeal with id = mealId };
        meals.add(mealId, newMeal);
      };
    };
  };

  public shared ({ caller }) func deleteMeal(mealId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete meals");
    };
    if (not meals.containsKey(mealId)) {
      Runtime.trap("Meal not found");
    };
    meals.remove(mealId);
  };

  public query ({ caller }) func getMeal(mealId : Nat) : async ?Meal {
    meals.get(mealId);
  };

  public query ({ caller }) func getAllMeals() : async [Meal] {
    meals.values().toArray().sort(Meal.compareByName);
  };

  public shared ({ caller }) func addDailyOrder(order : DailyMealOrder) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access this endpoint");
    };
    if (order.userId != caller) {
      Runtime.trap("Unauthorized: Can only create orders for yourself");
    };
    orderIdCounter += 1;
    let newOrder = { order with id = orderIdCounter };
    dailyOrders.add(orderIdCounter, newOrder);
    orderIdCounter;
  };

  public shared ({ caller }) func updateDailyOrder(orderId : Nat, updatedOrder : DailyMealOrder) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access this endpoint");
    };
    switch (dailyOrders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?existingOrder) {
        if (existingOrder.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own orders");
        };
        let newOrder = { updatedOrder with id = orderId };
        dailyOrders.add(orderId, newOrder);
      };
    };
  };

  public query ({ caller }) func getDailyOrder(orderId : Nat) : async ?DailyMealOrder {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access this endpoint");
    };
    switch (dailyOrders.get(orderId)) {
      case (null) { null };
      case (?order) {
        if (order.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        ?order;
      };
    };
  };

  public query ({ caller }) func getOrdersByUser(user : Principal) : async [DailyMealOrder] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access this endpoint");
    };
    if (not (AccessControl.isAdmin(accessControlState, caller) or (caller == user))) {
      Runtime.trap("Unauthorized: Can generally only view your own orders");
    };
    dailyOrders.values().toArray().filter(func(order) { order.userId == user });
  };

  public shared ({ caller }) func addProgressEntry(value : Float) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access this endpoint");
    };
    let entry : ProgressEntry = {
      date = Time.now();
      value;
    };
    switch (progressTracking.get(caller)) {
      case (null) {
        progressTracking.add(caller, [entry]);
      };
      case (?existingEntries) {
        progressTracking.add(caller, existingEntries.concat([entry]));
      };
    };
  };

  public query ({ caller }) func getProgressEntries() : async [ProgressEntry] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access this endpoint");
    };
    switch (progressTracking.get(caller)) {
      case (null) { [] };
      case (?entries) { entries };
    };
  };

  public shared ({ caller }) func sendNotification(userId : Principal, message : Text, notificationType : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can send notifications");
    };
    notificationIdCounter += 1;
    let notification : Notification = {
      id = notificationIdCounter;
      userId;
      message;
      notificationType;
      read = false;
      timestamp = Time.now();
    };
    notifications.add(notificationIdCounter, notification);
  };

  public query ({ caller }) func getUserNotifications() : async [Notification] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access this endpoint");
    };
    notifications.values().toArray().filter(func(n) { n.userId == caller });
  };

  public shared ({ caller }) func markNotificationAsRead(notificationId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access this endpoint");
    };
    switch (notifications.get(notificationId)) {
      case (null) { Runtime.trap("Notification not found") };
      case (?notification) {
        if (notification.userId != caller) {
          Runtime.trap("Unauthorized: Cannot mark notifications as read for other users");
        };
        let updatedNotification = { notification with read = true };
        notifications.add(notificationId, updatedNotification);
      };
    };
  };

  public shared ({ caller }) func addPaymentRecord(payment : PaymentRecord) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access this endpoint");
    };
    if (payment.userId != caller) {
      Runtime.trap("Unauthorized: Can only create payments for yourself");
    };
    paymentIdCounter += 1;
    let newPayment = { payment with id = paymentIdCounter };
    payments.add(paymentIdCounter, newPayment);
    paymentIdCounter;
  };

  public query ({ caller }) func getPaymentsByUser(user : Principal) : async [PaymentRecord] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access this endpoint");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own payment records");
    };
    payments.values().toArray().filter(func(p) { p.userId == user });
  };

  public query ({ caller }) func getUserId() : async Principal {
    caller;
  };
};
