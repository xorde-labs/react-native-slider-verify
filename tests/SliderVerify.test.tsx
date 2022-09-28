import React from 'react';
import 'react-native';
/* Note: test renderer must be required after react-native */
import * as renderer from 'react-test-renderer';

/**
 * Tests for a component
 */

import { SliderVerify } from '../src/SliderVerify';

it('renders correctly', () => {
	renderer.create(<SliderVerify />);
});
