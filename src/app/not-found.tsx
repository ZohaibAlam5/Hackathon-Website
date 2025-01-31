
import Foot from "./Components/component2";
import Bottom1 from "./Components/component3";
import Image from "next/image";
import Link from "next/link";

import notfound from "../app/images/notfound.jpg"
import Header from "./Components/component1";

export default function NotFound(){
   return(
    <div>
        <Header/>

        <div className="bg-gray-50">
             <section className="bg-purple-100 text-center py-10">
               <h1 className="text-3xl font-bold text-gray-800">404 Page Not Found</h1>
               <p className="mt-2 text-gray-600"></p>
            </section>
           </div>
    <div className="flex justify-center">
        <Image
        src={notfound}
        alt="OOPS THE PAGE YOU REQUESTED WAS NOT FOUND"
        className="rounded-md"
        width={800}
        height={300}
        />
    </div>    
        <div className="flex justify-center">
          <Link href="/">
        <button className="px-6 py-2 text-white bg-pink-500 rounded-md hover:bg-pink-600 transition">
            Back To Home
          </button>
          </Link>
        </div>  
    
        <Bottom1/>
        <Foot/>
    
    </div>
   ) 

}