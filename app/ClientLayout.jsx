"use client";
import { useEffect, useState,Suspense  } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartContext } from "./context/CartContext";
import LoadingBar from "@/components/LoadingBar"; 

export default function ClientLayout({ children }) {
  const [cart, setCart] = useState({});
  const [subTotal, setSubTotal] = useState(0);

  useEffect(() => {
    try {
      let saved = localStorage.getItem("cart")
      if (saved) {
        let myCart = JSON.parse(saved);
        setCart(myCart);
        let subt = 0;
        for (let key in myCart) subt += myCart[key].price * myCart[key].qty;
        setSubTotal(subt);
      }
    } catch (err) {
      localStorage.clear();
    }
  }, []);

  const saveCart = (myCart) => {
    localStorage.setItem("cart", JSON.stringify(myCart));
    let subt = 0;
    for (let key in myCart) subt += myCart[key].price * myCart[key].qty;
    setSubTotal(subt);
  };

  const addToCart = (itemCode, qty, price, name, size, variant) => {
    let newCart = {...cart };
    if (itemCode in cart) newCart[itemCode].qty = cart[itemCode].qty + qty;
    else newCart[itemCode] = { qty, price, name, size, variant };
    setCart(newCart);
    saveCart(newCart);
  };

  const removeFromCart = (itemCode, qty) => {
    let newCart = {...cart };
    if (itemCode in cart) newCart[itemCode].qty = cart[itemCode].qty - qty;
    if (newCart[itemCode]?.qty <= 0) delete newCart[itemCode];
    setCart(newCart);
    saveCart(newCart);
  };

  const clearCart = () => {
    setCart({});
    saveCart({});
  };

  return (
    <CartContext.Provider value={{ cart, subTotal, addToCart, removeFromCart, clearCart }}>
         <Suspense fallback={null}>
        <LoadingBar />
      </Suspense>
      <Navbar />
      <div className="w-full flex-1">{children}</div>
      <Footer />
    </CartContext.Provider>
  );
}