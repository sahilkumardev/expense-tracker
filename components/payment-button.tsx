"use client";

import React from "react";

export function PaymentButton() {
  const [isPending, startTransition] = React.useTransition();

  const handlePayment = () => {
    startTransition(async () => {
      const res = await fetch("/api/payment", { method: "POST" });
      const { url, error } = await res.json();

      if (error) return alert(error);
      window.location.href = url;
    });
  };

  return (
    <button
      onClick={handlePayment}
      className="border py-2 px-4 rounded-2xl bg-primary/30"
    >
      {isPending ? "Processing..." : "Upgrade to Pro - 199₹"}
    </button>
  );
}
