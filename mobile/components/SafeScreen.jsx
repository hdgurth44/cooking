// This is a helper component used to wrap the children components of the main root layout in a safe area view. It helps in order to have the bottom tabs start all the way at the bottom.

import { View } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS } from '../constants/colors'

const SafeScreen = ({children}) => {
    const insets = useSafeAreaInsets();
    return (
    <View style={{paddingTop: insets.top, flex: 1, backgroundColor: COLORS.background}}>
        {children}
    </View>
  )
}

export default SafeScreen