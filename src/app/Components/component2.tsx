export default function Foot(){
    return(
      <footer className="bg-purple-50 text-gray-700">
        {/* Top Section */}
        <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Left Column - Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-950">Hekto</h2>
            <div className="mt-4">
              <input
                type="email"
                placeholder="Enter Email Address"
                className="w-full px-4 py-2 text-sm border rounded-md focus:ring-2 focus:ring-purple-600 focus:outline-none"
              />
              <button className="w-full mt-2 px-4 py-2 text-sm text-white bg-pink-500 rounded-md hover:bg-pink-600">
                Sign Up
              </button>
            </div>
            <p className="mt-4 text-sm">
              Contact Info <br />
              17 Princess Road, London, Greater London NW1 8JR, UK
            </p>
          </div>
  
          {/* Categories Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>Laptops & Computers</li>
              <li>Cameras & Photography</li>
              <li>Smart Phones & Tablets</li>
              <li>Video Games & Consoles</li>
              <li>Waterproof Headphones</li>
            </ul>
          </div>
  
          {/* Customer Care Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Care</h3>
            <ul className="space-y-2 text-sm">
              <li>My Account</li>
              <li>Discount</li>
              <li>Returns</li>
              <li>Orders History</li>
              <li>Order Tracking</li>
            </ul>
          </div>
  
          {/* Pages Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Pages</h3>
            <ul className="space-y-2 text-sm">
              <li>Blog</li>
              <li>Browse the Shop</li>
              <li>Category</li>
              <li>Pre-Built Pages</li>
              <li>Visual Composer Elements</li>
              <li>WooCommerce Pages</li>
            </ul>
          </div>
        </div>
  
        {/* Bottom Section */}
        <div className="bg-purple-100">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center text-sm">
            <p className="text-gray-600">©Webecy - All Rights Reserved</p>
            <div className="flex space-x-4">
              <a href="#" className="text-purple-600 hover:text-purple-800">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-purple-600 hover:text-purple-800">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-purple-600 hover:text-purple-800">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
