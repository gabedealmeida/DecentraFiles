import React from 'react';
import { shallow, mount } from 'enzyme';
import Header from '../components/Header';

describe('Testing that the Header component loads properly and displays basic information', () => {
  it.skip('renders without crashing', () => {
    shallow(<Header />);
  });

  it.skip('renders table headers', () => {
    const wrapper = shallow(<Header />);
    const name = 'DecentraFiles';
    const button = 'Upload a File';
    expect(wrapper.contains(name)).toEqual(true);
    expect(wrapper.contains(button)).toEqual(true);
  });
});
