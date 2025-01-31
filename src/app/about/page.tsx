import Image from "next/image";
import Header from "../Components/component1";
import Foot from "../Components/component2";
import Link from "next/link";

import img1 from "../images/about1.jpg"
import img2 from "../images/about2.jpg"
import img3 from "../images/about3.jpg"
import img4 from "../images/about4.jpg"
import Heading from "../Components/component4";


export default function Home(){
    return(
        <div>
            <Header/>
            <div>
            <Heading name="About"/>
           </div>
    <div className="space-y-16 p-8 bg-gray-50">
      {/* About Section */}
      <section className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8">
        <div className="w-full md:w-1/2">
          <Image
            src={img1}
            alt="About Our Business"
            className="rounded-lg shadow-lg"
            width={1140}
            height={600}
          />
        </div>
        <div className="w-full md:w-1/2 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Know About Our Ecommerce Business, History
          </h2>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mattis neque ultrices tristique amet erat vitae
            eget dolor lobortis. Accumsan faucibus vitae lobortis quis bibendum quam.
          </p>
          <br></br>
          <Link href="/contact">
          <button className="px-6 py-2 text-white bg-pink-500 rounded-md hover:bg-pink-600 transition">
            Contact Us
          </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Our Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Feature Cards */}
          {[
            { title: "Free Delivery", icon: "🚚" },
            { title: "100% Cash Back", icon: "💵" },
            { title: "Quality Product", icon: "🎖️" },
            { title: "24/7 Support", icon: "📞" },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white shadow-md rounded-md hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa purus gravida.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Client Section */}
      <section className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Our Client Say!</h2>
        <div className="space-y-4">
          {/* Profile Images */}
          <div className="flex justify-center space-x-4">
            <Image
              src={img2}
              alt="Client 1"
              className="w-16 h-16 rounded-full object-cover"
              width={80}
              height={80}
            />
            <Image
              src={img3}
              alt="Client 2"
              className="w-16 h-16 rounded-full object-cover"
              width={80}
              height={80}
            />
            <Image
              src={img4}
              alt="Client 3"
              className="w-16 h-16 rounded-full object-cover"
              width={80}
              height={80}
            />
          </div>
          {/* Clients */}
          <div>
            <h3 className="text-lg font-bold text-gray-800">Selina Gomez</h3>
            <p className="text-gray-600 mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non odio at sit quam vel dui sollicitudin aliquet
              et arcu. Vitae et enim nunc, sed sapien egestas ac nam.
            </p>
            <div className="mt-4">
              <span className="block w-12 h-1 bg-pink-500 mx-auto"></span>
            </div>
          </div>
        </div>
      </section>
    </div>
            <Foot/>

        </div>
        
    )
}