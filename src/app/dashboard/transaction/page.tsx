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
import EditTransaction from "@/components/dashboard/EditTransaction"; // the form we created

const Transactions = () => {
  const supabase = createClient();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTxn, setEditingTxn] = useState<Transaction | null>(null);

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

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
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

  const handleDelete = async (transactionId: string) => {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("transaction_id", transactionId);

    if (error) {
      console.error("Error deleting transaction:", error.message);
    } else {
      setTransactions((prev) =>
        prev.filter((txn) => txn.transaction_id !== transactionId)
      );
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
            <TableHead>Note</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions.map((txn, index) => (
            <TableRow key={txn.transaction_id || `txn-${index}`}>
              <TableCell>{txn.category}</TableCell>
              <TableCell className="capitalize">{txn.type}</TableCell>
              <TableCell className="capitalize">{txn.payment_method}</TableCell>
              <TableCell>{txn.note || "-"}</TableCell>
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
              <TableCell className="flex gap-2 justify-center">
                {/* Edit triggers dialog with selected transaction */}
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
                  onClick={() => handleDelete(txn.transaction_id)}
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

export default Transactions;
