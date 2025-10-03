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
  id: string;
  category_id: string | null;
  category_name?: string | null;
  type: "income" | "expense";
  payment_method: string | null;
  notes: string | null;
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
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [currency, setCurrency] = useState("INR");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [transactionDate, setTransactionDate] = useState("");
  const [categories, setCategories] = useState<Array<{ id: string; category_name: string; type: "income" | "expense" }>>([]);
  const currencies = ["INR", "USD", "EUR", "GBP", "JPY"];

  // 👇 Prefill when transaction changes
  useEffect(() => {
    if (transaction) {
      setCategoryId(transaction.category_id || "");
      setAmount(transaction.amount?.toString() || "");
      setNote(transaction.notes || "");
      setType(transaction.type || "expense");
      setCurrency(transaction.currency || "INR");
      setPaymentMethod(transaction.payment_method || "cash");
      setTransactionDate(transaction.transaction_date || "");
    }
  }, [transaction]);

  // Fetch categories for selection
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, category_name, type")
        .order("category_name", { ascending: true });
    };
    fetchCategories();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!transaction) return;

    // find the selected category's name to keep denormalized column in sync
    const selected = categories.find((c) => c.id === categoryId);
    const category_name = selected ? selected.category_name : null;

    const { error } = await supabase
      .from("transactions")
      .update({
        category_id: categoryId || null,
        category_name,
        type,
        currency,
        payment_method: paymentMethod,
        notes: note,
        amount: parseFloat(amount),
        transaction_date: transactionDate,
      })
      .eq("id", transaction.id);

    if (error) {
      console.error("Error updating transaction:", error.message);
    } else {
      console.log("Transaction updated");
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
          {/* Type */}
          <div className="grid gap-3">
            <Label>Type</Label>
            <Select onValueChange={(v) => setType(v as any)} value={type}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="grid gap-3">
            <Label>Category</Label>
            <Select onValueChange={setCategoryId} value={categoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter((c) => c.type === type)
                  .map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.category_name}
                    </SelectItem>
                  ))}
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
