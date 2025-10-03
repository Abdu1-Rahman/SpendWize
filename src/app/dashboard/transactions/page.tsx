"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import EditTransaction from "@/components/dashboard/EditTransaction";

type Transaction = {
  id: string;
  category_id: string | null;
  category_name: string | null;
  type: "income" | "expense";
  payment_method: string | null;
  notes: string | null;
  amount: number;
  currency: string;
  transaction_date: string;
  created_at?: string | null;
  updated_at?: string | null;
};

const TransactionsPage = () => {
  const supabase = createClient();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTxn, setEditingTxn] = useState<Transaction | null>(null);

  // Fetch transactions from Supabase
  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select(
        "id, category_id, category_name, type, payment_method, notes, amount, currency, transaction_date, created_at, updated_at"
      )
      .order("transaction_date", { ascending: false });

    if (error) {
      console.error("Error fetching transactions:", error.message);
    } else {
      setTransactions(data || []);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Delete transaction
  const handleDelete = async (transactionId: string) => {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", transactionId);

    if (error) {
      console.error("Error deleting transaction:", error.message);
    } else {
      setTransactions((prev) => prev.filter((txn) => txn.id !== transactionId));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Transactions</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions.map((txn, index) => (
            <TableRow key={txn.id || `txn-${index}`}>
              <TableCell>{txn.category_name || "-"}</TableCell>
              <TableCell className="capitalize">{txn.type}</TableCell>
              <TableCell className="capitalize">{txn.payment_method || "-"}</TableCell>
              <TableCell>{txn.notes || "-"}</TableCell>
              <TableCell>
                {txn.amount?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell>{txn.currency}</TableCell>
              <TableCell>
                {txn.transaction_date
                  ? new Date(txn.transaction_date).toLocaleDateString()
                  : "-"}
              </TableCell>
              <TableCell>
                {txn.created_at
                  ? new Date(txn.created_at).toLocaleString()
                  : "-"}
              </TableCell>
              <TableCell>
                {txn.updated_at
                  ? new Date(txn.updated_at).toLocaleString()
                  : "-"}
              </TableCell>
              <TableCell className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingTxn(txn)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(txn.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* EditTransaction dialog */}
      {editingTxn && (
        <EditTransaction
          transaction={editingTxn}
          onUpdated={() => {
            setEditingTxn(null); // close dialog
            fetchTransactions(); // refresh table
          }}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
