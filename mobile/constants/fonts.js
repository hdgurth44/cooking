// Font constants for the cooking app
// Using Clash Display SemiBold for titles and Archivo Regular for text

export const FONTS = {
  // Clash Display weights
  ClashDisplaySemiBold: 'ClashDisplay-SemiBold',
  ClashDisplayMedium: 'ClashDisplay-Medium',
  ClashDisplayRegular: 'ClashDisplay-Regular',
  
  // Archivo weights
  ArchivoRegular: 'Archivo-Regular',
  ArchivoMedium: 'Archivo-Medium',
  ArchivoSemiBold: 'Archivo-SemiBold',
  ArchivoBold: 'Archivo-Bold',
  
  // Striper weights
  StriperRegular: 'Striper-Regular',
  
  // Boxing weights
  BoxingRegular: 'Boxing-Regular',
};

// Font families for easy usage
export const FONT_FAMILIES = {
  title: FONTS.ClashDisplaySemiBold,
  subtitle: FONTS.ClashDisplayMedium,
  body: FONTS.ArchivoRegular,
  bodyMedium: FONTS.ArchivoMedium,
  bodySemiBold: FONTS.ArchivoSemiBold,
  bodyBold: FONTS.ArchivoBold,
  decorative: FONTS.StriperRegular,
  display: FONTS.BoxingRegular,
};

// Font loading map for expo-font
export const FONT_ASSETS = {
  [FONTS.ClashDisplaySemiBold]: require('../assets/fonts/ClashDisplay-Variable.ttf'),
  [FONTS.ClashDisplayMedium]: require('../assets/fonts/ClashDisplay-Variable.ttf'),
  [FONTS.ClashDisplayRegular]: require('../assets/fonts/ClashDisplay-Variable.ttf'),
  [FONTS.ArchivoRegular]: require('../assets/fonts/Archivo-Variable.ttf'),
  [FONTS.ArchivoMedium]: require('../assets/fonts/Archivo-Variable.ttf'),
  [FONTS.ArchivoSemiBold]: require('../assets/fonts/Archivo-Variable.ttf'),
  [FONTS.ArchivoBold]: require('../assets/fonts/Archivo-Variable.ttf'),
  [FONTS.StriperRegular]: require('../assets/fonts/Striper-Regular.ttf'),
  [FONTS.BoxingRegular]: require('../assets/fonts/Boxing-Regular.ttf'),
};

// Typography styles with sizes and line heights
export const TYPOGRAPHY = {
  h1: {
    fontFamily: FONT_FAMILIES.title,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '600', // SemiBold
  },
  h2: {
    fontFamily: FONT_FAMILIES.title,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '600',
  },
  h3: {
    fontFamily: FONT_FAMILIES.title,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
  },
  h4: {
    fontFamily: FONT_FAMILIES.subtitle,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '500',
  },
  h5: {
    fontFamily: FONT_FAMILIES.subtitle,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '500',
  },
  h6: {
    fontFamily: FONT_FAMILIES.subtitle,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  body1: {
    fontFamily: FONT_FAMILIES.body,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  body2: {
    fontFamily: FONT_FAMILIES.body,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  caption: {
    fontFamily: FONT_FAMILIES.body,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
  button: {
    fontFamily: FONT_FAMILIES.bodyMedium,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  buttonSmall: {
    fontFamily: FONT_FAMILIES.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
};
