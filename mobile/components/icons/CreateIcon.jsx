import React from 'react';
import Svg, { Path } from 'react-native-svg';

const CreateIcon = ({ focused = false, color = '#000', size = 24 }) => {
  if (focused) {
    // Active/Filled version
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          fillRule="evenodd"
          d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
          clipRule="evenodd"
          fill={color}
        />
      </Svg>
    );
  } else {
    // Inactive/Outlined version
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          fillRule="evenodd"
          d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
          clipRule="evenodd"
          fill={color}
        />
      </Svg>
    );
  }
};

export default CreateIcon;