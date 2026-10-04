"use client";
import { createContext, useState, useEffect } from "react";
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});
  const [subTotal, setSubTotal] = useState(0);

  useEffect(() => {
    try {
      let saved = JSON.parse(localStorage.getItem("shopnest_cart") || "{}");
      // Purane cart se price hata do
      let cleanCart = {};
      for (let k in saved) {
        cleanCart[k] = { qty: saved[k].qty, slug: saved[k].slug || k };
      }
      setCart(cleanCart);
    } catch { setCart({}) }
  }, []);

  // Har baar cart badle to subTotal DB se nahi, temporary 0 rakho, final total backend dega
  // Lekin display ke liye hum price ko cart me save hi nahi karenge
  const saveCart = (newCart) => {
    localStorage.setItem("shopnest_cart", JSON.stringify(newCart));
    // subTotal frontend pe sirf qty count, real amount checkout API dega
    let qtyTotal = 0;
    for (let k in newCart) qtyTotal += newCart[k].qty;
    setSubTotal(qtyTotal); // ya 0 rakho, confusion khatam
    setCart(newCart);
  };

  const addToCart = (slug, qty = 1) => {
    let newCart = {...cart };
    if (newCart[slug]) {
      newCart[slug].qty += qty;
    } else {
      newCart[slug] = { qty, slug };
    }
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart({});
    localStorage.removeItem("shopnest_cart");
  };

  return (
    <CartContext.Provider value={{ cart, subTotal, addToCart, clearCart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};