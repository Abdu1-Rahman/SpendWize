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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoAdd } from "react-icons/io5";
import { createClient } from "@/utils/supabase/client"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AddTransaction() {
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [type, setType] = useState("expense");
  const [currency, setCurrency] = useState("INR");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [transactionDate, setTransactionDate] = useState(""); // ✅ new state
  const [userId, setUserId] = useState(null);

  const supabase = createClient();

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

  // ✅ fetch the logged-in user
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
      }
    };

    getUser();
  }, [supabase]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      console.error("User not signed in");
      return;
    }

    if (!amount || isNaN(parseFloat(amount))) {
      console.error("Invalid amount");
      return;
    }

    if (!transactionDate) {
      console.error("Transaction date is required");
      return;
    }

    const finalCategory =
      category === "Add Custom" && customCategory ? customCategory : category;

    const { data, error } = await supabase.from("transactions").insert([
      {
        category: finalCategory,
        type,
        currency,
        payment_method: paymentMethod,
        note,
        amount: parseFloat(amount),
        user_id: userId,
        transaction_date: new Date(transactionDate).toISOString(), // ✅ use selected date
      },
    ]);

    if (error) {
      console.error("❌ Error inserting transaction:", error.message);
    } else {
      console.log("✅ Inserted transaction:", data);
      setCategory("");
      setCustomCategory("");
      setAmount("");
      setNote("");
      setType("expense");
      setCurrency("INR");
      setPaymentMethod("cash");
      setTransactionDate(""); // reset
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-emerald-500 text-white flex items-center gap-2">
          <IoAdd />
          Add Transaction
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a New Transaction</DialogTitle>
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
                required
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

          {/* Transaction Date */}
          <div className="grid gap-3">
            <Label htmlFor="transactionDate">Transaction Date</Label>
            <Input
              id="transactionDate"
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              required
            />
          </div>

          {/* Note */}
          <div className="grid gap-3">
            <Label htmlFor="note">Note</Label>
            <Input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. from 7/11"
            />
          </div>

          {/* Amount */}
          <div className="grid gap-3">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
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
