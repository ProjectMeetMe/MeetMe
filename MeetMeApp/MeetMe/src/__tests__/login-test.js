// __tests__/Intro-test.js
import React from 'react';
import Login from '../pages/login';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<Login />).toJSON();
  expect(tree).toMatchSnapshot();
});