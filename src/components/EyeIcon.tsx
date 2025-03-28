import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import colors from '../styles/colors';

export default function EyeIcon() {
  return (
    <Svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke={colors.primary}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <Circle cx="12" cy="12" r="3" />
    </Svg>
  );
}
