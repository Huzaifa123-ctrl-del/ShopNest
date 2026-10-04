"use client";
import { useEffect, useState } from "react";

export default function Admin(){
  const [orders, setOrders] = useState([]);
  useEffect(()=>{
    fetch("/api/admin/orders").then(r=>r.json()).then(d=>setOrders(d.orders));
  },[]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Orders ({orders.length})</h1>
      {orders.length === 0 && <p className="mt-4 text-red-500">No orders in DB - checkout API fail ho raha hai</p>}
      {orders.map(o=>(
        <div key={o._id} className="border p-3 mt-3 rounded">
          <p>ID: {o._id}</p>
          <p>Amount: Rs. {o.amount}</p>
          <p>Address: {o.address}</p>
          <p>Status: {o.status}</p>
          <p>Products: {o.products.length}</p>
        </div>
      ))}
    </div>
  );
}