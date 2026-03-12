import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  Building2,
  CheckCircle,
  ChevronDown,
  CreditCard,
  RotateCcw,
  Smartphone,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { useApp } from "../context/AppContext";
import { mockPayments } from "../data/mockData";

type PaymentMethod = "upi" | "card" | "netbanking";

const banks = [
  "HDFC Bank",
  "ICICI Bank",
  "SBI",
  "Axis Bank",
  "Kotak Mahindra",
  "Yes Bank",
];

const planPrices: Record<string, number> = {
  Lite: 1999,
  Balance: 3499,
  Complete: 4999,
};

export default function PaymentPage() {
  const { subscription } = useApp();
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [autoRenew, setAutoRenew] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [bank, setBank] = useState("");

  const planName = subscription?.plan || "Balance";
  const amount = planPrices[planName] || 3499;

  const handlePay = async () => {
    setPaying(true);
    await new Promise((r) => setTimeout(r, 2000));
    setPaying(false);
    setPaySuccess(true);
  };

  if (paySuccess) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-background px-6"
        data-ocid="payment.success_state"
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          <div className="w-24 h-24 rounded-full bg-primary/15 flex items-center justify-center mb-5">
            <CheckCircle size={48} className="text-primary" />
          </div>
          <h2 className="font-display text-3xl font-bold mb-2">
            Payment Successful!
          </h2>
          <p className="text-muted-foreground mb-1">
            ₹{amount.toLocaleString()} paid
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            {planName} Plan · {method.toUpperCase()}
          </p>
          <Button
            className="bg-primary text-primary-foreground shadow-green rounded-xl px-8"
            onClick={() => setPaySuccess(false)}
            data-ocid="payment.back.button"
          >
            Back to Billing
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      <PageHeader
        title="Payment & Billing"
        subtitle="Manage your subscription"
        showNotification
      />

      <div className="px-4 space-y-5">
        {/* Current Plan */}
        <div
          className="bg-primary rounded-2xl p-4 text-primary-foreground"
          data-ocid="payment.plan.card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-foreground/70 text-xs">Active Plan</p>
              <p className="font-display font-bold text-xl mt-0.5">
                {planName}
              </p>
              <p className="text-sm text-primary-foreground/70 mt-1">
                ₹{amount.toLocaleString()} / month
              </p>
            </div>
            <div className="text-right">
              <Badge className="bg-white/20 text-primary-foreground mb-2">
                Active
              </Badge>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-xs text-primary-foreground/70">
                  Auto-renew
                </span>
                <Switch
                  checked={autoRenew}
                  onCheckedChange={setAutoRenew}
                  className="data-[state=checked]:bg-white/30"
                  data-ocid="payment.autorenew.switch"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-card rounded-2xl p-4 shadow-card">
          <h3 className="font-semibold mb-3">Payment Method</h3>
          <div className="flex gap-2 mb-4">
            {(["upi", "card", "netbanking"] as PaymentMethod[]).map((m) => (
              <button
                type="button"
                key={m}
                data-ocid={`payment.${m}.tab`}
                onClick={() => setMethod(m)}
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all capitalize",
                  method === m
                    ? "border-primary bg-primary/8 text-primary"
                    : "border-border text-muted-foreground",
                )}
              >
                {m === "upi" && (
                  <>
                    <Smartphone size={12} className="inline mr-1" />
                    UPI
                  </>
                )}
                {m === "card" && (
                  <>
                    <CreditCard size={12} className="inline mr-1" />
                    Card
                  </>
                )}
                {m === "netbanking" && (
                  <>
                    <Building2 size={12} className="inline mr-1" />
                    Net Banking
                  </>
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={method}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {method === "upi" && (
                <div>
                  <Label>UPI ID</Label>
                  <Input
                    placeholder="name@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="mt-1.5 rounded-xl"
                    data-ocid="payment.upi.input"
                  />
                </div>
              )}
              {method === "card" && (
                <div className="space-y-3">
                  <div>
                    <Label>Card Number</Label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      maxLength={19}
                      className="mt-1.5 rounded-xl font-mono"
                      data-ocid="payment.card_number.input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Expiry</Label>
                      <Input
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="mt-1.5 rounded-xl"
                        data-ocid="payment.expiry.input"
                      />
                    </div>
                    <div>
                      <Label>CVV</Label>
                      <Input
                        placeholder="123"
                        type="password"
                        maxLength={3}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="mt-1.5 rounded-xl"
                        data-ocid="payment.cvv.input"
                      />
                    </div>
                  </div>
                </div>
              )}
              {method === "netbanking" && (
                <div>
                  <Label>Select Bank</Label>
                  <Select value={bank} onValueChange={setBank}>
                    <SelectTrigger
                      className="mt-1.5 rounded-xl"
                      data-ocid="payment.bank.select"
                    >
                      <SelectValue placeholder="Choose your bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {banks.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <Button
            className="w-full mt-4 h-12 rounded-xl bg-primary text-primary-foreground shadow-green font-semibold"
            onClick={handlePay}
            disabled={paying}
            data-ocid="payment.pay.primary_button"
          >
            {paying ? (
              <>
                <RotateCcw size={16} className="mr-2 animate-spin" />{" "}
                Processing...
              </>
            ) : (
              `Pay ₹${amount.toLocaleString()}`
            )}
          </Button>
        </div>

        {/* Payment History */}
        <div>
          <h3 className="font-display text-lg font-bold mb-3">
            Payment History
          </h3>
          <div className="space-y-2">
            {mockPayments.map((p, i) => (
              <div
                key={p.id.toString()}
                data-ocid={`payment.history.item.${i + 1}`}
                className="bg-card rounded-xl p-3 shadow-xs flex items-center gap-3"
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                    p.status === "success" ? "bg-green-100" : "bg-red-100",
                  )}
                >
                  <CreditCard
                    size={15}
                    className={
                      p.status === "success" ? "text-green-600" : "text-red-600"
                    }
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">
                    {p.subscriptionPlan} Plan
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(Number(p.date)).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    · {p.method}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">
                    ₹{Number(p.amount).toLocaleString()}
                  </p>
                  <Badge
                    className={cn(
                      "text-[10px] px-1.5 py-0",
                      p.status === "success"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600",
                    )}
                  >
                    {p.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
