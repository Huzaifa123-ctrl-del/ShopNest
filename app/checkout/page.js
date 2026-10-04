"use client";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useRouter } from "next/navigation";

export default function Checkout() {
  const { cart, subTotal, clearCart } = useContext(CartContext);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePay = async () => {
    setLoading(true);
    let userId = localStorage.getItem("shopnest_userId") || "demo-user"; // tum login se userId save karo

    let res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, cart, address })
    });
    let data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error);
      return;
    }
    alert(`Order Placed! Real Amount Rs. ${data.amount}`);
    clearCart();
    router.push("/userOrder");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Secure Checkout - DB Verified 🔒</h1>
      <p className="text-sm">Frontend Total: Rs. {subTotal} (DB se verify hoga)</p>
      <textarea value={address} onChange={e=>setAddress(e.target.value)} placeholder="Address" className="w-full border p-3 mt-4 rounded" />
      <button onClick={handlePay} disabled={loading} className="w-full mt-4 bg-black text-white p-3 rounded">
        {loading? "Verifying..." : `Pay Rs. ${subTotal}`}
      </button>
    </div>
  );
}