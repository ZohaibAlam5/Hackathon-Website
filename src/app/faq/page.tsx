
import Header from "../Components/component1";
import Foot from "../Components/component2";
import Bottom1 from "../Components/component3";
import Heading from "../Components/component4";

export default function Home(){
    return(
        <div>
            <Header/>
           <Heading name="FAQ"/>

           <div className="flex flex-col md:flex-row justify-between items-start bg-gray-50 p-8 space-y-12 md:space-y-0 md:space-x-8">
      {/* General Information Section */}
      <div className="w-full md:w-1/2 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">General Information</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Eu dictumst cum et vel euismod condimentum?
            </h3>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt
              sed tristique nulla odio, consequat gravida sagittis.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Magna bibendum et fermentum eros.
            </h3>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt
              sed tristique nulla odio, consequat gravida sagittis.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Odio malesuada hac etis consectetur scelerisque?
            </h3>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt
              sed tristique nulla odio, consequat gravida sagittis.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Eti id blandit idaboro bai velit qua mare?
            </h3>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt
              sed tristique nulla odio, consequat gravida sagittis.
            </p>
          </div>
        </div>
      </div>

      {/* Ask a Question Form */}
      <div className="w-full md:w-1/2 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Ask a Question</h2>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Subject"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Type Your Message"
    
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <button
            type="submit"
            className="w-full py-2 text-white bg-pink-500 rounded-md hover:bg-pink-600 transition"
          >
            Send Mail
          </button>
        </form>
      </div>
    </div>
    <Bottom1/>
     <Foot/>
        </div>
        
    )
}