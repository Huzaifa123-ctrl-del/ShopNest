"use client"
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function GymPage() {
  const [gymItems, setGymItems] = useState([]);

  useEffect(() => {
    fetch("/api/getProducts")
     .then(r => r.json())
     .then(d => {
        let gym = (d.products || []).filter(p => p.category.toLowerCase().includes("gym"));
        setGymItems(gym);
      });
  }, []);

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen">
      <main className="w-full">
        <Image
          src="/hero.png"
          alt="Gym Banner"
          width={1920}
          height={600}
          className="w-full h-auto block"
          priority
        />
      </main>

      <div className="max-w-7xl mx-auto px-6 pb-16 pt-8">
        <h1 className="text-3xl font-black text-[#0f1e3d]">GYM ESSENTIALS</h1>
        <p className="text-slate-500 text-sm mt-1 mb-6">{gymItems.length} Pro Products Found</p>

        {gymItems.length === 0? <p className="text-center py-20">No gym products yet. Gym Products are Out of Stock.</p> :
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {gymItems.map((p) => (
            <Link key={p._id} href={`/products/${p.slug}`}>
              <div className="group relative bg-white rounded-[24px] border border-slate-100 overflow-hidden hover:shadow-[0_15px_40px_rgba(37,99,235,0.12)] hover:-translate-y-1 transition-all duration-300">

                <div className="absolute top-3 left-3 z-10 flex gap-2">
                  <span className="bg-[#0f1e3d] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">{p.category}</span>
                  <span className="bg-[#eef5ff] text-[#2563eb] text-[10px] font-bold px-3 py-1 rounded-full">{p.color} | {p.size}</span>
                </div>

                <div className="aspect-[4/3] bg-gradient-to-b from-[#eef5ff] to-white flex items-center justify-center relative overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="object-contain w-full h-full group-hover:scale-110 group-hover:rotate-3 transition duration-500"
                  />
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-[#0f1e3d] text-[15px] leading-tight line-clamp-2">{p.title}</h3>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="font-black text-[#0f1e3d] text-lg">Rs. {p.price}</span>
                    <span className="text-xs text-slate-400 line-through">Rs. {p.price + 600}</span>
                  </div>
                  <div className="w-full mt-4 bg-[#0f1e3d] text-white rounded-full py-3 text-sm font-bold text-center group-hover:bg-[#2563eb] transition">
                    VIEW PRODUCT →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        }
      </div>
    </div>
  )
}