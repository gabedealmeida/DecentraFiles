import React from 'react';
import { shallow, mount } from 'enzyme';
import Metrics from '../components/Metrics';

describe('Testing that the Metrics component loads properly and displays basic information', () => {
  it('renders without crashing', () => {
    shallow(<Metrics metrics={{}} />);
  });

  it('renders table titles', () => {
    const wrapper = shallow(<Metrics metrics={{}} />);
    const uploads = 'Total Uploads';
    const downloads = 'Total Downloads';
    const ratio = 'Ratio of Downloads to Uploads';

    expect(wrapper.contains(uploads)).toEqual(true);
    expect(wrapper.contains(downloads)).toEqual(true);
    expect(wrapper.contains(ratio)).toEqual(true);
  });
});

describe('Metrics displays the proper component', () => {
  it('accepts metric prop', () => {
    const metrics = {
      totalUploadCount: 0,
      totalDownloadCount: 0,
    };

    const wrapper = mount(<Metrics metrics={metrics} />);

    expect(wrapper.props().metrics).toEqual(metrics);
  });
});
