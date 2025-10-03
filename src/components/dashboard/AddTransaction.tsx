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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddTransaction() {
  const [categoryId, setCategoryId] = useState("");
  const [categoryText, setCategoryText] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [currency, setCurrency] = useState("INR");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [transactionDate, setTransactionDate] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [categories, setCategories] = useState<
    Array<{ id: string; category_name: string; type: "income" | "expense" }>
  >([]);

  const supabase = createClient();
  const currencies = ["INR", "USD", "EUR", "GBP", "JPY"];

  // Suggested categories
  const suggestedCategories: Record<"income" | "expense", string[]> = {
    income: ["Salary", "Bonus", "Investment", "Gift", "Other"],
    expense: [
      "Food",
      "Grocery",
      "Transport",
      "Entertainment",
      "Rent",
      "Bills",
      "Shopping",
      "Other",
    ],
  };

  // Fetch logged-in user
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    getUser();
  }, [supabase]);

  // Fetch categories and add defaults if empty
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, category_name, type")
        .order("category_name", { ascending: true });

      let categoriesData = data || [];

      // Add default categories if table is empty
      if (!data || data.length === 0) {
        const defaultCategories = [
          { category_name: "Salary", type: "income" },
          { category_name: "Bonus", type: "income" },
          { category_name: "Investment", type: "income" },
          { category_name: "Gift", type: "income" },
          { category_name: "Food", type: "expense" },
          { category_name: "Grocery", type: "expense" },
          { category_name: "Transport", type: "expense" },
          { category_name: "Entertainment", type: "expense" },
          { category_name: "Rent", type: "expense" },
          { category_name: "Bills", type: "expense" },
        ];
        const { data: inserted } = await supabase
          .from("categories")
          .insert(defaultCategories)
          .select();
        categoriesData = inserted || [];
      }

      setCategories(categoriesData as any);
    };
    fetchCategories();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!userId) {
      console.error("User not signed in");
      return;
    }
    if (!transactionDate) {
      console.error("Transaction date is required");
      return;
    }
  
    let finalCategoryId: string | null = null;
    let finalCategoryName = "";
  
    if (categoryId === "__custom__") {
      // Insert custom category into DB
      const { data: newCat, error: catError } = await supabase
        .from("categories")
        .insert([{ user_id: userId, category_name: categoryText, type }]) // ✅ add user_id
        .select()
        .single();
  
      if (catError) {
        console.error("Error creating category:", catError.message);
        return;
      }
  
      finalCategoryId = newCat.id;
      finalCategoryName = newCat.category_name;
  
      // Add to local state
      setCategories((prev) => [...prev, newCat]);
    } else {
      // Existing category (selected from dropdown or suggested)
      const selectedCategory = categories.find((c) => c.id === categoryId);
      if (selectedCategory) {
        finalCategoryId = selectedCategory.id;
        finalCategoryName = selectedCategory.category_name;
      } else {
        // In case user picked a suggested plain-text category not in DB
        const { data: newCat, error: catError } = await supabase
          .from("categories")
          .insert([{ user_id: userId, category_name: categoryId, type }])
          .select()
          .single();
  
        if (catError) {
          console.error("Error creating suggested category:", catError.message);
          return;
        }
  
        finalCategoryId = newCat.id;
        finalCategoryName = newCat.category_name;
        setCategories((prev) => [...prev, newCat]);
      }
    }
  
    // ✅ Now insert into transactions with category_id
    const { data, error } = await supabase.from("transactions").insert([
      {
        user_id: userId,
        category_id: finalCategoryId, // ✅ always correct FK
        category_name: finalCategoryName,
        type,
        currency,
        payment_method: paymentMethod,
        notes: note,
        amount: parseFloat(amount),
        transaction_date: transactionDate,
      },
    ]);
  
    if (error) {
      console.error("❌ Error inserting transaction:", error.message);
    } else {
      console.log("✅ Inserted transaction:", data);
  
      // reset form
      setCategoryId("");
      setCategoryText("");
      setAmount("");
      setNote("");
      setType("expense");
      setCurrency("INR");
      setPaymentMethod("cash");
      setTransactionDate("");
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
          {/* Type */}
          <div className="grid gap-3">
            <Label>Type</Label>
            <Select onValueChange={(v) => setType(v as any)} value={type}>
              <SelectTrigger>
                <SelectValue />
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
                {/* Suggested categories */}
                {suggestedCategories[type].map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}

                {/* Existing categories from DB */}
                {categories
                  .filter((c) => c.type === type)
                  .map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.category_name}
                    </SelectItem>
                  ))}

                {/* Custom option */}
                <SelectItem value="__custom__">Add Custom</SelectItem>
              </SelectContent>
            </Select>

            {categoryId === "__custom__" && (
              <Input
                className="mt-2"
                placeholder="Enter custom category"
                value={categoryText}
                onChange={(e) => setCategoryText(e.target.value)}
                required
              />
            )}
          </div>

          {/* Currency */}
          <div className="grid gap-3">
            <Label>Currency</Label>
            <Select onValueChange={setCurrency} value={currency}>
              <SelectTrigger>
                <SelectValue />
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
                <SelectValue />
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
            <Label>Transaction Date</Label>
            <Input
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              required
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
