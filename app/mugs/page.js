"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function MugsPage(){
  const [products, setProducts] = useState([])

  useEffect(()=>{
    fetch("/api/getProducts")
      .then(r=>r.json())
      .then(d=>{
        // mug ya mugs dono accept karega
        let mugs = (d.products || []).filter(p => p.category.toLowerCase().includes("mug"))
        setProducts(mugs)
      })
  },[])

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-black mb-2">Premium Mugs</h1>
      <p className="text-gray-500 mb-8">{products.length} products found</p>

      {products.length === 0 ? <p className="text-2xl font-bold my-4">No mugs yet. Mug's are Out of Stock</p> :
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map(item=>(
          <Link key={item._id} href={`/products/${item.slug}`} className="bg-white rounded-2xl border p-3 hover:shadow-xl transition">
            <img src={item.img} className="w-full h-48 object-cover rounded-xl" />
            <h3 className="font-bold mt-3">{item.title}</h3>
            <p className="text-xs text-gray-500">{item.color} | Qty: {item.availableQty}</p>
            <p className="font-black mt-1">Rs. {item.price}</p>
          </Link>
        ))}
      </div>
      }
    </div>
  )
}