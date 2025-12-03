import { format } from "date-fns";

export function exportToCSV(data: any[], filename: string, columns: { key: string; header: string }[]) {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }

  const headers = columns.map((col) => col.header).join(",");
  
  const rows = data.map((row) =>
    columns
      .map((col) => {
        const value = getNestedValue(row, col.key);
        // Escape quotes and wrap in quotes if contains comma
        const stringValue = String(value ?? "");
        if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
      .join(",")
  );

  const csv = [headers, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${format(new Date(), "yyyy-MM-dd")}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

export function exportInvoicesToCSV(invoices: any[]) {
  const columns = [
    { key: "invoice_number", header: "Invoice Number" },
    { key: "customer_type", header: "Customer Type" },
    { key: "status", header: "Status" },
    { key: "subtotal", header: "Subtotal" },
    { key: "tax_amount", header: "Tax" },
    { key: "total", header: "Total" },
    { key: "amount_paid", header: "Amount Paid" },
    { key: "amount_due", header: "Amount Due" },
    { key: "due_date", header: "Due Date" },
    { key: "created_at", header: "Created At" },
  ];
  
  exportToCSV(invoices, "invoices", columns);
}

export function exportTransactionsToCSV(transactions: any[]) {
  const columns = [
    { key: "created_at", header: "Date" },
    { key: "transaction_type", header: "Type" },
    { key: "customer_type", header: "Customer Type" },
    { key: "amount", header: "Amount" },
    { key: "currency", header: "Currency" },
    { key: "status", header: "Status" },
    { key: "payment_method", header: "Payment Method" },
    { key: "card_brand", header: "Card Brand" },
    { key: "card_last_four", header: "Card Last 4" },
    { key: "stripe_payment_intent_id", header: "Stripe Payment Intent" },
  ];
  
  exportToCSV(transactions, "transactions", columns);
}

export function exportSubscriptionsToCSV(subscriptions: any[]) {
  const columns = [
    { key: "id", header: "Subscription ID" },
    { key: "customer_type", header: "Customer Type" },
    { key: "status", header: "Status" },
    { key: "billing_interval", header: "Billing Interval" },
    { key: "monthly_amount", header: "Monthly Amount" },
    { key: "currency", header: "Currency" },
    { key: "current_period_start", header: "Period Start" },
    { key: "current_period_end", header: "Period End" },
    { key: "created_at", header: "Created At" },
  ];
  
  exportToCSV(subscriptions, "subscriptions", columns);
}

export function exportCreditsToCSV(credits: any[]) {
  const columns = [
    { key: "id", header: "Credit ID" },
    { key: "customer_type", header: "Customer Type" },
    { key: "amount", header: "Original Amount" },
    { key: "remaining_amount", header: "Remaining Amount" },
    { key: "currency", header: "Currency" },
    { key: "status", header: "Status" },
    { key: "reason", header: "Reason" },
    { key: "expires_at", header: "Expires At" },
    { key: "created_at", header: "Created At" },
  ];
  
  exportToCSV(credits, "credits", columns);
}
