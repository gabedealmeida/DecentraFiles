import { useLocation, Link } from "react-router-dom";
import Header from './Header';

function Navbar(props) {
  const path = useLocation().pathname;
  let fileClass = "";
  let aboutClass = "";
  const active = "bg-blue-700 text-white rounded-md py-2 px-3 text-sm font-medium";
  const inactive = "text-white hover:bg-blue-500 hover:bg-opacity-75 rounded-md py-2 px-3 text-sm font-medium";

  if (path === '/') {
    fileClass = active;
    aboutClass = inactive;
  } else if (path === '/about') {
    aboutClass = active;
    fileClass = inactive;
  }

  return (
    <div className="bg-gradient-to-r from-blue-400 to-blue-700 pb-32">
      <nav className="bg-gradient-to-r from-blue-400 to-blue-700">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="relative h-16 flex items-center justify-between">
            <div className="px-2 flex items-center lg:px-0">
              <div className="flex-shrink-0">
                <img className="block h-8 w-8" src="/DecentraFilesPlane.png" alt="Workflow" />
              </div>
              <div className="hidden lg:block lg:ml-10">
                <div className="flex space-x-4">
                  <Link to="/" className={fileClass}>
                    Files
                  </Link>
                  <Link to="/about" className={aboutClass}>
                    About
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex lg:hidden">
              {/* <!-- Mobile menu button --> */}
              <button className="bg-blue-600 p-2 rounded-md inline-flex items-center justify-center text-blue-200 hover:text-white hover:bg-blue-500 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white" aria-expanded="false">
                <span className="sr-only">Open main menu</span>
                {/* <!--
                  Heroicon name: menu

                  Menu open: "hidden", Menu closed: "block"
                --> */}
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {/* <!--
                  Heroicon name: x

                  Menu open: "block", Menu closed: "hidden"
                --> */}
                <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* <!--
          Mobile menu, toggle classes based on menu state.

          Menu open: "block", Menu closed: "hidden"
        --> */}
        <div className="hidden lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className={fileClass}>
              Files
            </Link>
            <Link to="/about" className={aboutClass}>
              About
            </Link>
          </div>
        </div>
      </nav>
      <Header onUploadButtonClick={props.onUploadButtonClick} />
    </div>
  )
}

export default Navbar;
