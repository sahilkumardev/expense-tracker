"use client";

export function PaymentButton() {
  async function handlePayment() {
    const res = await fetch("/api/payment", { method: "POST" });
    const { url, error } = await res.json();

    if (error) return alert(error);
    window.location.href = url; // redirect to Stripe Checkout
  }

  return <button onClick={handlePayment} className="border py-2 px-4 rounded-2xl bg-primary/30">Pay ₹199</button>;
}
