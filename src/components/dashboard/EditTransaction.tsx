"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Transaction = {
  transaction_id: string;
  category: string;
  type: string;
  payment_method: string;
  note: string | null;
  amount: number;
  currency: string;
  transaction_date: string;
};

export default function EditTransaction({
  transaction,
  onUpdated,
}: {
  transaction: Transaction | null;
  onUpdated: () => void;
}) {
  const supabase = createClient();

  // local state prefilled with transaction values
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [type, setType] = useState("expense");
  const [currency, setCurrency] = useState("INR");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [transactionDate, setTransactionDate] = useState("");

  const categories = [
    "Food & Dining",
    "Transport",
    "Shopping",
    "Bills & Utilities",
    "Rent / Housing",
    "Health & Medical",
    "Entertainment",
    "Education",
    "Travel & Vacation",
    "Personal Care",
    "Gifts & Donations",
    "Others / Miscellaneous",
    "Add Custom",
  ];

  const currencies = ["INR", "USD", "EUR", "GBP", "JPY"];

  // 👇 Prefill when transaction changes
  useEffect(() => {
    if (transaction) {
      setCategory(transaction.category || "");
      setAmount(transaction.amount?.toString() || "");
      setNote(transaction.note || "");
      setType(transaction.type || "expense");
      setCurrency(transaction.currency || "INR");
      setPaymentMethod(transaction.payment_method || "cash");
      setTransactionDate(
        transaction.transaction_date
          ? new Date(transaction.transaction_date).toISOString().split("T")[0]
          : ""
      );
    }
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!transaction) return;

  const finalCategory =
    category === "Add Custom" && customCategory ? customCategory : category;

  const { error } = await supabase
    .from("transactions")
    .update({
      category: finalCategory,
      type,
      currency,
      payment_method: paymentMethod,
      note,
      amount: parseFloat(amount),
      transaction_date: new Date(transactionDate).toISOString(),
    })
    .eq("transaction_id", transaction.transaction_id);

  if (error) {
    console.error("❌ Error updating transaction:", error.message);
  } else {
    console.log("✅ Transaction updated");
    onUpdated(); // refresh table in parent and close dialog
  }
};


  return (
    <Dialog open={!!transaction} onOpenChange={() => onUpdated()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* Category */}
          <div className="grid gap-3">
            <Label>Category</Label>
            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {category === "Add Custom" && (
              <Input
                className="mt-2"
                placeholder="Enter custom category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
              />
            )}
          </div>

          {/* Type */}
          <div className="grid gap-3">
            <Label>Type</Label>
            <Select onValueChange={setType} value={type}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Currency */}
          <div className="grid gap-3">
            <Label>Currency</Label>
            <Select onValueChange={setCurrency} value={currency}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((cur) => (
                  <SelectItem key={cur} value={cur}>
                    {cur}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Method */}
          <div className="grid gap-3">
            <Label>Payment Method</Label>
            <Select onValueChange={setPaymentMethod} value={paymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="debitcard">Debit Card</SelectItem>
                <SelectItem value="creditcard">Credit Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="grid gap-3">
            <Label>Transaction Date</Label>
            <Input
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
            />
          </div>

          {/* Note */}
          <div className="grid gap-3">
            <Label>Note</Label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Grocery shopping"
            />
          </div>

          {/* Amount */}
          <div className="grid gap-3">
            <Label>Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 500"
              required
            />
          </div>

          {/* Footer */}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
