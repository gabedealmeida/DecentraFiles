import React from 'react';
import { shallow, mount } from 'enzyme';
import App from '../App';

describe('Testing that the Header component loads properly in its most basic form', () => {
  it('renders without crashing', () => {
    shallow(<App />);
  });
});
