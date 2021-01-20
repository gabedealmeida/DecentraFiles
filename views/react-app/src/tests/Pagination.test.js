import React from 'react';
import { shallow, mount } from 'enzyme';
import Pagination from '../components/Pagination';

describe('Testing that the Pagination component loads properly and displays basic information', () => {
  it('renders without crashing', () => {
    shallow(<Pagination pageResultsCount={{}} />);
  });

  it('renders buttons text', () => {
    const wrapper = shallow(<Pagination pageResultsCount={{}} />);
    const previous = 'Previous';
    const next = 'Next';

    expect(wrapper.contains(previous)).toEqual(true);
    expect(wrapper.contains(next)).toEqual(true);
  });
});

describe('Pagination displays the proper component', () => {
  it('accepts pageResultsCount prop', () => {
    const pageResultsCount = { start: 0, end: 10 };

    const wrapper = mount(<Pagination pageResultsCount={pageResultsCount} />);

    expect(wrapper.props().pageResultsCount).toEqual(pageResultsCount);
  });
});
