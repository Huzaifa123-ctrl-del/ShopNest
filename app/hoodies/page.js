"use client"
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function HoodiesPage() {
  const [products, setProducts] = useState([]);
  const [filterSize, setFilterSize] = useState("");

  useEffect(() => {
    fetch("/api/getProducts")
     .then(r => r.json())
     .then(d => {
        let filtered = (d.products || []).filter(p => p.category.toLowerCase().includes("hoodie"));
        setProducts(filtered);
      });
  }, []);

  const displayProducts = filterSize? products.filter(p=>p.size===filterSize) : products;

  return (
   <div className="w-full bg-[#f8fafc] min-h-screen">
    <main className="w-full">
      <Image
        src="/homepage.jpg"
        alt="Homepage Banner"
        width={1920}
        height={600}
        className="w-full h-auto block"
        priority
      />
    </main>

      {/* 1. HEADER */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-[13px] text-slate-500"><Link href="/" className="hover:text-[#2563eb]">Home</Link> / <span className="text-slate-900 font-semibold">Hoodies</span></p>

          <div className="flex flex-col lg:flex-row justify-between gap-6 mt-5">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#eef5ff] text-[#2563eb] text-[11px] font-bold px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> WINTER DROP LIVE - {products.length} Products
              </div>
              <h1 className="text-4xl font-extrabold text-[#0f1e3d] mt-3 leading-tight">Stay Warm,<br/> <span className="text-[#2563eb]">Stay Stylish.</span></h1>
              <p className="text-sm text-slate-500 mt-3 max-w-md">400GSM premium fleece, inside warm fleece, no color fade after wash.</p>
            </div>

            <div className="bg-[#0f1e3d] rounded-[20px] p-1 flex gap-1 self-start">
              {["All", "Pullover", "Zipper", "Oversized"].map((f,i)=>(
                <button key={f} className={`px-5 py-2.5 rounded-full text-sm font-semibold transition ${i===0? 'bg-white text-[#0f1e3d]' : 'text-white/60 hover:text-white'}`}>{f}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. SIZE FILTER + SORT */}
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {["S","M","L","XL","XXL"].map(s=>(
            <button key={s} onClick={()=>setFilterSize(filterSize===s?"":s)} className={`shrink-0 w-10 h-10 rounded-full border text-sm font-bold transition ${filterSize===s?'bg-[#0f1e3d] text-white border-[#0f1e3d]':'border-slate-200 bg-white hover:bg-[#0f1e3d] hover:text-white'}`}>{s}</button>
          ))}
          <span className="w-px h-10 bg-slate-200 mx-2 hidden md:block"></span>
          <button className="shrink-0 px-4 h-10 rounded-full border border-slate-200 bg-white text-sm">Black</button>
          <button className="shrink-0 px-4 h-10 rounded-full border border-slate-200 bg-white text-sm">Grey</button>
          <button className="shrink-0 px-4 h-10 rounded-full border border-slate-200 bg-white text-sm">Navy</button>
        </div>
        <select className="border border-slate-200 rounded-full px-5 py-2.5 text-sm font-medium bg-white outline-none self-start">
          <option>Sort by: Popular</option>
          <option>Price Low to High</option>
          <option>Price High to Low</option>
        </select>
      </div>

      {/* 3. GRID */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        {displayProducts.length===0? <p className="text-center py-20 font-bold">No Hoodies for {filterSize || 'this filter'}. Hoodies are Out of Stock.</p> :
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {displayProducts.map((p)=>(
            <Link key={p._id} href={`/products/${p.slug}`}>
            <div className="group bg-white rounded-[24px] border border-slate-100 overflow-hidden hover:shadow-[0_15px_40px_rgba(37,99,235,0.12)] hover:-translate-y-1 transition-all duration-300">

              <div className="absolute z-10 top-3 left-3 flex gap-2">
                <span className="bg-[#0f1e3d] text-white text-[10px] font-black px-3 py-1 rounded-full">400GSM</span>
                <span className="bg-white/90 text-[#0f1e3d] text-[10px] font-bold px-3 py-1 rounded-full border">{p.color}</span>
              </div>
              <div className="absolute z-10 top-3 right-3 bg-white/90 backdrop-blur text-[#0f1e3d] text-[10px] font-bold px-3 py-1 rounded-full border border-slate-100">{p.size}</div>

              <div className="aspect-[4/5] bg-gradient-to-b from-[#eef5ff] to-[#f8fafc] flex items-center justify-center relative overflow-hidden">
                <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>

              <div className="p-5">
                <h3 className="font-bold text-[#0f1e3d] text-[15px] leading-tight line-clamp-1">{p.title}</h3>
                <p className="text-[11px] text-slate-400 mt-1">400 GSM • Inside Fleece • {p.availableQty} left</p>

                <div className="flex items-center gap-2 mt-3">
                  <span className="font-black text-[#0f1e3d] text-lg">Rs. {p.price}</span>
                  <span className="text-xs text-slate-400 line-through">Rs. {p.price + 800}</span>
                  <span className="ml-auto text-[11px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {Math.round(((p.price+800 - p.price)/(p.price+800))*100)}% OFF
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 mt-4">
                  <div className="col-span-3 bg-[#0f1e3d] text-white rounded-full py-3 text-sm font-bold cursor-pointer group-hover:bg-[#2563eb] transition text-center">VIEW DETAILS</div>
                  <button className="w-full h-[44px] rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50">♡</button>
                </div>
              </div>
            </div>
            </Link>
          ))}
        </div>
        }

        {/* 4. WINTER BANNER */}
        <div className="mt-14 bg-[#eef5ff] rounded-[28px] border border-[#dbeafe] p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-[#0f1e3d] text-2xl font-black">Winter Sale - Flat 30% OFF</h2>
            <p className="text-slate-500 text-sm mt-2">On all hoodies. Limited stock for winter collection.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full px-5 py-3 text-sm font-bold border border-slate-200">CODE: <span className="text-[#2563eb]">WINTER30</span></div>
            <button className="bg-[#0f1e3d] text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-[#162a50] cursor-pointer transition">Shop Now →</button>
          </div>
        </div>
      </div>
    </div>
  )
}