import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppBackground from './components/AppBackground';
import Footer from './components/Footer';
import FilesTable from './components/FilesTable';
import About from './components/About';
import UploadForm from './components/UploadForm';
import Modal from './components/Modal';

class App extends React.Component {
  state = {
    modal: { display: false },
    formToggled: false,
    loader: false,
    currentPage: 0,
    numOfFiles: 10,
    totalNumberOfFiles: 0,
    files: [],
    metrics: {
      totalDownloadCount: 0,
      totalUploadCount: 0,
      ratio: 0,
    },
  };

  componentDidMount() {
    this.toggleLoader(true);
    this.fetchTotalNumberOfFiles();
    this.fetchMetrics();
    this.fetchFiles(false).then(() => {
      this.toggleLoader(false);
    });
  }

  fetchMetrics = () => {
    fetch('http://localhost:8086/metrics').then((response) => {
      response.json().then((metrics) => {
        const totalDownloadCount = metrics.total_download_count;
        const totalUploadCount = metrics.total_upload_count;
        this.setState({
          metrics: {
            totalDownloadCount,
            totalUploadCount,
            ratio: Number((totalDownloadCount / totalUploadCount).toFixed(2)),
          },
        });
      });
    });
  };

  onUploadButtonClick = () => {
    this.setState((prevState, props) => {
      return { formToggled: !prevState.formToggled };
    });
  };

  onModalClose = () => {
    this.setState({ modal: { display: false } });
  };

  toggleLoader = (state) => {
    this.setState({ loader: state });
  };

  changePage = (direction) => {
    const numOfFilesTillCurrPage =
      this.state.currentPage * this.state.numOfFiles + this.state.numOfFiles;
    let currentPage = this.state.currentPage;

    if (
      direction === 'Next' &&
      numOfFilesTillCurrPage < this.state.totalNumberOfFiles
    ) {
      this.setState({ currentPage: currentPage + 1 });

      if (numOfFilesTillCurrPage >= this.state.files.length) {
        this.toggleLoader(true);
        this.fetchFiles(
          true,
          (currentPage + 1) * this.state.numOfFiles,
          this.state.numOfFiles
        ).then(() => this.toggleLoader(false));
      }
    } else if (direction === 'Previous' && this.state.currentPage >= 1) {
      this.setState((prevState) => {
        const currentPage = prevState.currentPage - 1;
        return { currentPage };
      });
    } else return;
  };

  pageResultsCount = () => {
    const total = this.state.totalNumberOfFiles;
    const start = this.state.currentPage * this.state.numOfFiles + 1;
    let end =
      this.state.currentPage * this.state.numOfFiles + this.state.numOfFiles;

    if (end > total) end = total;

    return {
      start,
      end,
      total,
    };
  };

  updateFilesListWithNewFile = () => {
    this.fetchFiles(false, 0, this.state.files.length + 1).then(() =>
      this.fetchTotalNumberOfFiles().then(() => this.toggleLoader(false))
    );
  };

  updateFileState = (newFile) => {
    const files = [...this.state.files].map((file) => {
      if (file.id === newFile.id) return newFile;
      return file;
    });

    this.setState({ files });
  };

  fetchASingleFile = (id) => {
    this.removeFilesThatCantBeDownloaded();
    fetch(`http://localhost:8086/singlefile?id=${id}`).then((response) => {
      response
        .json()
        .then((newFile) => {
          this.updateFileState(newFile);
        })
        .catch((error) => console.log(error));
    });
  };

  downloadFile = (id) => {
    this.removeFilesThatCantBeDownloaded();
    return fetch(`http://localhost:8086/download?id=${id}`)
      .then((response) =>
        response.json().then((result) => {
          this.setState({
            modal: { display: true, status: response.status, url: result.url },
          });
          if (response.status === 200) this.updateFileState(result.file);
        })
      )
      .catch((error) => console.log(error));
  };

  fetchTotalNumberOfFiles = () => {
    this.removeFilesThatCantBeDownloaded();
    return fetch('http://localhost:8086/totalnumberoffiles')
      .then((response) =>
        response.json().then((total) => {
          this.setState({ totalNumberOfFiles: Number(total.count) });
        })
      )
      .catch((error) => console.log(error));
  };

  fetchFiles = (partialRequest, offset, limit) => {
    let params = {};
    if (!offset && !limit) {
      params = {
        offset: this.state.currentPage * this.state.numOfFiles,
        limit: this.state.numOfFiles,
      };
    } else {
      params = {
        offset,
        limit,
      };
    }

    this.removeFilesThatCantBeDownloaded();

    if (partialRequest) {
      // Prevent from making a request when files are already in state
      if (
        !!this.state.files[params.offset] ||
        !!this.state.files[params.offset + params.limit - 1]
      ) {
        return;
      }
    }

    const url = new URL('http://localhost:8086');
    url.search = new URLSearchParams(params);
    return fetch(url)
      .then((response) =>
        response.json().then((files) => {
          if (!partialRequest) {
            this.setState({ files: files });
          } else {
            this.setState({ files: [...this.state.files, ...files] });
          }
        })
      )
      .catch((error) => console.log(error));
  };

  removeFilesThatCantBeDownloaded = () => {
    const originalFiles = [...this.state.files];
    const files = originalFiles.filter((file) => {
      const currentDate = new Date();
      const fileExpiration = new Date(file.expiration);
      return file.download_count > 0 && fileExpiration > currentDate;
    });

    const difference = originalFiles.length - files.length;
    this.setState({
      files,
      totalNumberOfFiles: this.state.totalNumberOfFiles - difference,
    });
  };

  filesToDisplay = () => {
    const params = {
      offset: this.state.currentPage * this.state.numOfFiles,
      limit: this.state.numOfFiles,
    };

    return this.state.files.slice(params.offset, params.offset + params.limit);
  };

  render() {
    return (
      <Router>
        <AppBackground>
          <Navbar onUploadButtonClick={this.onUploadButtonClick} />
          <main className="-mt-32">
            <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
                {this.state.modal.display ? (
                  <Modal
                    content={this.state.modal}
                    onModalClose={this.onModalClose}
                  />
                ) : (
                  ''
                )}
                {this.state.formToggled ? (
                  <UploadForm
                    onUploadButtonClick={this.onUploadButtonClick}
                    updateFilesListWithNewFile={this.updateFilesListWithNewFile}
                    toggleLoader={this.toggleLoader}
                    fetchMetrics={this.fetchMetrics}
                  />
                ) : (
                  ''
                )}
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={() => (
                      <FilesTable
                        files={this.filesToDisplay()}
                        changePage={this.changePage}
                        pageResultsCount={this.pageResultsCount()}
                        displayLoader={this.state.loader}
                        downloadFile={this.downloadFile}
                        metrics={this.state.metrics}
                        fetchMetrics={this.fetchMetrics}
                      />
                    )}
                  />
                  <Route exact path="/about" component={About} />
                </Switch>
              </div>
            </div>
          </main>
        </AppBackground>
        <Footer />
      </Router>
    );
  }
}

export default App;
