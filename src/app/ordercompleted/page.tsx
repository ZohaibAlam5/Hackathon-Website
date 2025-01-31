import Header from "../Components/component1";
import Foot from "../Components/component2";
import Bottom1 from "../Components/component3";
import Link from "next/link";
import Heading from "../Components/component4";

export default function Home(){
    return(
        <div>
            <Header/>
          <Heading name="Order Completed"/>

<div className="bg-gray-50 flex items-center justify-center py-4">
  <div className="max-w-md w-full text-center bg-white p-8 rounded-lg shadow">
    <div className="flex justify-center items-center space-x-4 mb-6">
      <div className="bg-blue-100 p-3 rounded-full">
        <svg className="w-6 h-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3"></path>
        </svg>
      </div>
      <div className="bg-yellow-100 px-3 py-1 rounded-full font-bold text-yellow-600">H S</div>
    </div>
    <h1 className="text-2xl font-semibold text-gray-800">Your Order Is Completed!</h1>
    <p className="text-gray-600 mt-4">Thank you for your order! Your order is being processed and will be completed within 3–6 hours. You will receive an email confirmation when your order is completed.</p>
    <Link href="/shop"><button className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-lg mt-6">Continue Shopping</button></Link>
  </div>
  </div>
  <Bottom1/>
            <Foot/>
        </div>
    )
}