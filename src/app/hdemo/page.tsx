
import Header from "../Components/component1";
import Foot from "../Components/component2";
import Link from "next/link";
import Image from "next/image";

export default function ShoppingInformation() {
  // Array of products
  const products = [
    {
      id: 1,
      name: 'Product 1',
      size: 'XL',
      price: 50.0,
      image: '/hdemo1.jpg',
    },
    {
      id: 2,
      name: 'Product 2',
      size: 'M',
      price: 45.0,
      image: '/hdemo2.jpg',
    },
    {
      id: 3,
      name: 'Product 3',
      size: 'L',
      price: 60.0,
      image: '/hdemo3.jpg',
    },
    // Add more products as needed
  ];

  // Calculate subtotal
  const subtotal = products.reduce((sum, product) => sum + product.price, 0);

  return (
    <div>
    <Header/>
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:space-x-6">
        {/* Left Column */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow">
          <h1 className="text-xl font-semibold text-gray-800 mb-4">Hekto Demo</h1>
          <div>
            <h2 className="text-gray-700 font-semibold mb-2">Contact Information</h2>
            <input
              type="email"
              placeholder="Email or mobile phone number"
              className="w-full border-gray-300 border rounded-md px-4 py-2 mb-4"
            />
            <label className="flex items-center space-x-2 text-sm text-gray-600">
              <input type="checkbox" className="border-gray-300 rounded" />
              <span>Keep me up to date on news and exclusive offers</span>
            </label>
          </div>
          <div className="mt-6">
            <h2 className="text-gray-700 font-semibold mb-2">Shipping Address</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First name (optional)"
                className="border-gray-300 border rounded-md px-4 py-2"
              />
              <input
                type="text"
                placeholder="Last name"
                className="border-gray-300 border rounded-md px-4 py-2"
              />
            </div>
            <input
              type="text"
              placeholder="Address"
              className="w-full border-gray-300 border rounded-md px-4 py-2 mt-4"
            />
            <input
              type="text"
              placeholder="Apartment, suite, etc. (optional)"
              className="w-full border-gray-300 border rounded-md px-4 py-2 mt-4"
            />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <input
                type="text"
                placeholder="City"
                className="border-gray-300 border rounded-md px-4 py-2"
              />
              <input
                type="text"
                placeholder="Postal Code"
                className="border-gray-300 border rounded-md px-4 py-2"
              />
            </div>
            
            <Link href="/shop"><button className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-lg mt-6 w-full">
              Continue Shopping
            </button>
            </Link>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 mt-8 md:mt-0 bg-white p-6 rounded-lg shadow">
          <ul className="space-y-4">
            {products.map((product) => (
              <li key={product.id} className="flex justify-between items-center">
                <div className="flex items-center">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={40}
                    height={40}
                  />
                  <div className="ml-4">
                    <h4 className="text-gray-700 font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-500">Size: {product.size}</p>
                  </div>
                </div>
                <p className="text-gray-800 font-medium">${product.price.toFixed(2)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 text-right">
            <p className="text-gray-600">Subtotal: ${subtotal.toFixed(2)}</p>
            <p className="text-gray-600">Shipping: Calculated at checkout</p>
            <p className="font-semibold text-gray-800 mt-2">Total: ${subtotal.toFixed(2)}</p>
          </div>
          <Link href="/cart"><button className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg mt-4 w-full">
            Proceed to Checkout
          </button></Link>
        </div>
      </div>
    </div>
    <Foot/>
    </div>
    
  );
}

            
       