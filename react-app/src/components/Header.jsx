import { useLocation } from "react-router-dom";

function Header(props) {
  const path = useLocation().pathname;

  function handleUploadButtonClick() {
    props.onUploadButtonClick();
  }

  return (
    <header className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2">
        <h1 className="text-3xl font-bold text-white">
          DecentraFiles
      </h1>
      {path === '/' ?
        <button type="button" onClick={handleUploadButtonClick} className="w-1/4 justify-self-end inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-green-400 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400">
        <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      Upload a File
    </button> :
    ''
    }

      </div>
    </header>
  )
}

export default Header;
