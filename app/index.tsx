import { ActivityIndicator, View } from 'react-native';
import { COLORS } from '../src/constants';

export default function IndexScreen() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.background,
      }}
    >
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}