"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserOrder() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // PRIVATE CHECK
    let token = localStorage.getItem("shopnest_token");
    let u = localStorage.getItem("shopnest_user");

    if (!token ||!u) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(u));

    let savedOrders = localStorage.getItem("shopnest_orders");
    let lastCart = localStorage.getItem("last_order");

    // Agar checkout se aya hai to order save karo
    if (lastCart) {
      let parsed = JSON.parse(lastCart);
      let allOrders = savedOrders? JSON.parse(savedOrders) : [];
      allOrders.push(parsed);
      localStorage.setItem("shopnest_orders", JSON.stringify(allOrders));
      localStorage.removeItem("last_order");
      localStorage.removeItem("cart");
      setOrders([...allOrders].reverse());
    } else if (savedOrders) {
      setOrders(JSON.parse(savedOrders).reverse());
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="p-20 text-center font-bold">Checking login...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="text-7xl mb-4">🔒</div>
        <h1 className="text-3xl font-black text-[#0f1e3d]">My Private Orders</h1>
        <p className="text-slate-400 mt-2">Hi {user?.name}, aapka koi order nahi hai</p>
        <p className="text-xs text-slate-400 mt-1">Ye page sirf aap dekh sakte ho, admin bhi nahi</p>
        <Link href="/" className="inline-block mt-6 bg-[#0f1e3d] text-white px-8 py-3 rounded-full font-bold">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#0f1e3d]">My Orders 🔒 Private</h1>
          <p className="text-sm text-slate-400 mt-1">Hi {user?.name}, total {orders.length} orders (sirf aapke liye)</p>
        </div>
        <button
          onClick={()=>{
            if(confirm("Sare orders delete karne hain?")){
              localStorage.removeItem("shopnest_orders");
              setOrders([]);
            }
          }}
          className="text-xs bg-red-50 cursor-pointer hover:opacity-60 text-red-600 px-4 py-2 rounded-full font-bold"
        >
          Clear History
        </button>
      </div>

      <div className="space-y-6">
        {orders.map((order, idx) => (
          <div key={order.id || idx} className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
              <div>
                <p className="text-xs font-bold tracking-widest text-slate-400">ORDER ID</p>
                <p className="font-black text-sm">#SHOPNEST-{order.id?.toString().slice(-6)}</p>
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest text-slate-400">DATE</p>
                <p className="font-bold text-sm">{order.date}</p>
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest text-slate-400">TOTAL</p>
                <p className="font-black text-[#0f1e3d]">Rs. {order.total}</p>
              </div>
              <div className="px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-black">✅ CONFIRMED</div>
            </div>

            {order.delivery && (
              <div className="bg-[#f8fafc] p-3 rounded-xl text-xs mb-4">
                <p className="font-bold">Deliver to: {order.delivery.name}, {order.delivery.address}, {order.delivery.city} - {order.delivery.pincode}</p>
                <p className="text-slate-500">{order.delivery.phone}</p>
              </div>
            )}

            <div className="border-t border-dashed border-slate-200 pt-4 space-y-3">
              {order.items && Object.keys(order.items).map((k) => (
                <div key={k} className="flex justify-between items-center bg-[#f8fafc] p-3 rounded-xl">
                  <div>
                    <p className="font-bold text-sm">{order.items[k].name}</p>
                    <p className="text-xs text-slate-400">{order.items[k].size} / {order.items[k].variant} x {order.items[k].qty}</p>
                  </div>
                  <p className="font-bold text-sm">Rs. {order.items[k].price * order.items[k].qty}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}