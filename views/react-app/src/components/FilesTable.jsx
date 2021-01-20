import React from 'react';
import Pagination from './Pagination';
import Loader from './Loader';
import Metrics from './Metrics';
import { format } from 'timeago.js';

function FilesTable({ files, changePage, pageResultsCount, displayLoader, downloadFile, fetchMetrics, metrics }) {
  const image = <svg className="text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>;

  const text = <svg className="text-gray-400" xmlns="http://www.w3.org/2000/svg"   fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>;

  const video = <svg className="text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>;

  const other = <svg className="text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>;

  const downloadsLeftColorClass = (maxDownloadCount, downloadCount) => {
    let color;
    const division = Number(downloadCount) / Number(maxDownloadCount);
    if (division > .70) color = 'bg-green-100 text-green-800';
    else if (division > .30) color = 'bg-yellow-100 text-yellow-800';
    else color = 'bg-red-100 text-red-800';
    return color;
  };

  const handleDownload = (event) => {
    downloadFile(event.target.id).then(() => fetchMetrics());
  }

  const filesToDisplay = files.map((file) => {
    let icon;
    if (file.type === 'Image') icon = image;
    else if (file.type === 'Text') icon = text;
    else if (file.type === 'Video') icon = video;
    else if (file.type === 'Other') icon = other;

    const color = downloadsLeftColorClass(file.max_download_count, file.download_count);

    return (
      <tr key={file.id}>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-8 w-8">
              {icon}
            </div>
            <div className="ml-4">
              <div className="text-sm font-semibold text-gray-700">
                {file.name}
          </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-500">{file.max_download_count}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={"px-2 inline-flex text-xs leading-5 font-semibold rounded-full " + color}>
            {file.download_count}
      </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {format(file.expiration)}
    </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button onClick={handleDownload} id={file.id} type="button" className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-semibold rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600">
            Download
          </button>
        </td>
      </tr>
    )
  })

  return (
    <React.Fragment>
      {displayLoader ? <Loader /> : '' }
      <Metrics metrics={metrics} />
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File Name
                </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Max # of Downloads
                </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Downloads Left
                </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expires In
                </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  { filesToDisplay }
                </tbody>
              </table>
              <Pagination changePage={changePage} pageResultsCount={pageResultsCount} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default FilesTable;
