import React from 'react';
import { shallow, mount } from 'enzyme';
import UploadForm from '../components/UploadForm';

describe('Testing that the UploadForm component loads properly and displays basic information', () => {
  it('renders without crashing', () => {
    shallow(<UploadForm />);
  });

  it('renders form fields titles', () => {
    const wrapper = shallow(<UploadForm />);
    const name = 'File Name';
    const max = 'Max Number of Downloads';
    const expiration = 'Hours From Now Until Expiration';
    const type = 'File Type';
    const file = 'File';

    expect(wrapper.contains(name)).toEqual(true);
    expect(wrapper.contains(max)).toEqual(true);
    expect(wrapper.contains(expiration)).toEqual(true);
    expect(wrapper.contains(type)).toEqual(true);
    expect(wrapper.contains(file)).toEqual(true);
  });
});
