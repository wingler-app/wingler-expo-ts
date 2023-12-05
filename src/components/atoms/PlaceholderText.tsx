import { Text, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

// @ts-ignore
import * as Colors from '../../styles/colors';

const PlaceHolderText = () => {
  return (
    <SkeletonPlaceholder
      borderRadius={4}
      backgroundColor={Colors.primary.black}
      highlightColor={Colors.primary.dark}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: 120, height: 20, borderRadius: 50 }} />
        <View style={{ marginLeft: 20 }}>
          <Text style={{ marginTop: 6, fontSize: 14, lineHeight: 18 }}>
            Hello world
          </Text>
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default PlaceHolderText;
