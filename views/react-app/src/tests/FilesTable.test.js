import React from 'react';
import { shallow, mount } from 'enzyme';
import FilesTable from '../components/FilesTable';

describe('Testing that the Header component loads properly and displays basic information', () => {
  it('renders without crashing', () => {
    shallow(<FilesTable files={[]} />);
  });

  it('renders table headers', () => {
    const wrapper = shallow(<FilesTable files={[]} />);
    const name = 'File Name';
    const max = 'Max # of Downloads';
    const downloadsLeft = 'Downloads Left';
    const expiration = 'Expires In';
    expect(wrapper.contains(name)).toEqual(true);
    expect(wrapper.contains(max)).toEqual(true);
    expect(wrapper.contains(downloadsLeft)).toEqual(true);
    expect(wrapper.contains(expiration)).toEqual(true);
  });
});

describe('FilesTable displays the proper component', () => {
  it('accepts files, metrics, and pageResultsCount prop', () => {
    const files = [
      {
        created_at: '2021-01-19T02:15:39.839Z',
        download_count: 88,
        expiration: '2021-01-20T08:15:39.000Z',
        id: 73,
        max_download_count: 88,
        name: 'Houston1898',
        type: 'Video',
      },
    ];

    const metrics = {
      totalUploadCount: 0,
      totalDownloadCount: 0,
    };

    const pageResultsCount = { start: 0, end: 10 };

    const wrapper = mount(
      <FilesTable
        files={files}
        metrics={metrics}
        pageResultsCount={pageResultsCount}
      />
    );

    expect(wrapper.props().files).toEqual(files);
    expect(wrapper.props().metrics).toEqual(metrics);
    expect(wrapper.props().pageResultsCount).toEqual(pageResultsCount);
  });
});
