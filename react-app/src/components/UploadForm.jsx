import React from 'react';

class UploadForm extends React.Component {
  state = {
    fileName: '',
    maxDownloads: '',
    expirationHours: '',
    fileType: 'Text',
    selectedFile: '',
  }

  handleUploadButtonClick = () => {
    this.props.onUploadButtonClick();
  }

  handleChange = (event) => {
    const key = event.target.id;
    let value = event.target.value;
    if (key === 'selectedFile') value = event.target.files[0];
    this.setState({ [key]: value });
  }

  transferDataToUploadService = (data) => {
    const params = { ...this.state };
    delete params.selectedFile;
    const url = new URL('http://localhost:8085');
    url.search = new URLSearchParams(params);

    fetch(url, {
      method: 'POST',
      body: data,
    }).then(() => {
      this.props.updateFilesListWithNewFile();
    }).then(() => this.props.fetchMetrics()).catch((error) => console.log(error));
  }

  turnInputsIntoFormData = () => {
    const data = new FormData();
    data.append('selectedFile', this.state.selectedFile);
    return data;
  }

  resetState = () => {
    this.setState({
      fileName: '',
      maxDownloads: '',
      expirationHours: '',
      fileType: 'Text',
      selectedFile: '',
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.toggleLoader(true);
    const data = this.turnInputsIntoFormData();
    this.transferDataToUploadService(data);
    this.resetState();
    this.props.onUploadButtonClick();
  }

  formatChosenFile = () => {
    const name = this.state.selectedFile.name;
    if (name.length < 16) return name;
    const extension = this.state.selectedFile.name.split('.').slice(-1)[0];
    return this.state.selectedFile.name.slice(0, 10) + '...' + extension;
  }

  render() {
    return (
      <React.Fragment>
        <form className="space-y-8 divide-y divide-gray-200 grid mb-24" onSubmit={this.handleSubmit}>
          <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5 md:w-2/3 justify-self-center shadow overflow-hidden border-b border-gray-200 sm:rounded-lg px-6 pt-5 pb-6">
            <div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Upload
          </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Choose your settings and we'll handle the rest!
          </p>
              </div>

              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label for="fileName" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    File Name
            </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input type="text" name="fileName" id="fileName" autocomplete="abc" className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md" value={this.state.fileName} onChange={this.handleChange} required />
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label for="maxDownloads" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Max Number of Downloads
            </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input type="number" name="maxDownloads" id="maxDownloads" autocomplete="10" className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md" value={this.state.maxDownloads} onChange={this.handleChange} required />
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label for="expirationHours" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Hours From Now Until Expiration
            </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input type="number" name="expirationHours" id="expirationHours" autocomplete="" className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md" value={this.state.expirationHours} onChange={this.handleChange} required />
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label for="fileType" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    File Type
            </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <select id="fileType" name="fileType" autocomplete="Text" className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md" onChange={this.handleChange} value={this.state.fileType}>
                      <option>Text</option>
                      <option>Image</option>
                      <option>Video</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label for="selectedFile" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    File
                  </label>
                  <div className="mt-2 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label for="selectedFile" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            <span>Upload a file</span>
                            <input id="selectedFile" name="selectedFile" type="file" className="sr-only" onChange={this.handleChange} required />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          Text, Image, Video...
                        </p>
                        { this.state.selectedFile === '' ? '': <p className="text-xs text-gray-500">
                        {'Chosen file: ' + this.formatChosenFile()}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-5">
              <div className="flex justify-end">
                <button type="button" onClick={this.handleUploadButtonClick} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Cancel
                </button>
                <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </form>
      </React.Fragment>
    )
  }
}

export default UploadForm;
