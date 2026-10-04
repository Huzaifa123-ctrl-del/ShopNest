"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function Tshirts() {
  const [products, setProducts] = useState([])
  
  useEffect(() => {
    fetch("/api/getProducts")
      .then(r=>r.json())
      .then(d=> {
        // ✅ Sirf t-shirts filter
        let filtered = (d.products || []).filter(p => 
          p.category.toLowerCase().includes("tshirt") || 
          p.category.toLowerCase().includes("t-shirt") ||
          p.category.toLowerCase() === "tshirts"
        )
        setProducts(filtered)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-2">ShopNest T-Shirts</h1>
        <p className="text-gray-500 mb-8">{products.length} Premium T-Shirts Found</p>

        {products.length === 0 ? <p className="text-center py-20 font-bold">No T-Shirts found.T-shirts are Out of Stock.</p> :

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map(item => (
            <Link key={item._id} href={`/products/${item.slug}`}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border">
                <div className="h-64 bg-gray-100 relative overflow-hidden">
                  <img 
                    src={item.img || `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500`} 
                    alt={item.title}
                    className="h-full w-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-black text-white text-xs px-3 py-1 rounded-full">{item.size}</span>
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-gray-800 line-clamp-1">{item.title}</h2>
                  <p className="text-sm text-gray-400">{item.color} - {item.category}</p>
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-lg font-bold">Rs. {item.price}</p>
                    <p className="text-lg font-bold">Quantity: {item.availableQty}</p>
                    <span className={`text-xs px-2 py-1 rounded ${item.availableQty > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.availableQty > 0 ? `In Stock` : `Out of Stock`}
                    </span>
                  </div>
                  <div className="w-full mt-3 bg-black text-white py-2 rounded-lg text-sm text-center group-hover:bg-gray-800">View Details</div>
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