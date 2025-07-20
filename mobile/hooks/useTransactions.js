// react custom hook file

import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { API_URL } from "../constants/api";

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // useCallback is used for performance reasons, it will memoize the function
  const fetchTransactions = useCallback(async () => {
    try {
      if (!userId) {
        console.warn("fetchTransactions: No userId provided");
        setTransactions([]);
        return;
      }
      const url = `${API_URL}/transactions/${userId}`;
      const response = await fetch(url);
      if (!response.ok) {
        const text = await response.text();
        console.error(`HTTP error! status: ${response.status} - ${text}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        console.error("Fetched data is not an array:", data);
        setTransactions([]);
        return;
      }
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
      Alert.alert("Error", "Failed to fetch transactions. Please check your connection.");
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    try {
      if (!userId) {
        console.warn("fetchSummary: No userId provided");
        setSummary({ balance: 0, income: 0, expenses: 0 });
        return;
      }
      const url = `${API_URL}/transactions/summary/${userId}`;
      const response = await fetch(url);
      if (!response.ok) {
        const text = await response.text();
        console.error(`HTTP error! status: ${response.status} - ${text}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!data || typeof data !== 'object') {
        console.error("Fetched summary is not an object:", data);
        setSummary({ balance: 0, income: 0, expenses: 0 });
        return;
      }
      setSummary(data);
    } catch (error) {
      console.error("Error fetching summary:", error);
      setSummary({ balance: 0, income: 0, expenses: 0 });
      Alert.alert("Error", "Failed to fetch summary. Please check your connection.");
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // can be run in parallel
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error("Error loading data:", error);
      Alert.alert("Error", "Failed to load data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete transaction");

      // Refresh data after deletion
      loadData();
      Alert.alert("Success", "Transaction deleted successfully");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      Alert.alert("Error", error.message);
    }
  };

  // Animation helpers for UI (to be used in the transaction list screen)
  // Example: pass a delay prop to each TransactionItem for staggered fade-in
  // Example: trigger a confetti effect on successful transaction creation

  return { transactions, summary, isLoading, loadData, deleteTransaction };
};