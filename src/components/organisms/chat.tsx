import { Motion } from '@legendapp/motion';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';

import type { RhinoInferenceObject } from '@/types';

const winglerLogo = require('../../../assets/logo.png');
const userAvatar = require('../../../assets/Maximilian.png');

const QnA = ({
  item,
  index,
}: {
  item: RhinoInferenceObject;
  index: Number;
}) => {
  const style = index === 0 ? 'mt-60' : 'mt-0';
  // set a timer for 1 second then set show to true
  const [show, setShow] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 1000);
  });
  return (
    <View key={item.id} className={style}>
      <Motion.View
        className="mx-4 flex-1 items-end"
        initial={{ y: -50, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ y: 20 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <View className="h-14 w-14 justify-center rounded-full border border-gray-700 bg-black">
          <Image
            resizeMode="contain"
            className="h-full w-full"
            source={userAvatar}
          />
        </View>
        <View className="mx-14 flex-1 flex-row rounded-xl rounded-tr-none bg-indigo-900 px-6 py-4">
          <Text className="flex-wrap text-xl text-white">
            {item.botQA.question}
          </Text>
        </View>
      </Motion.View>
      {show && (
        <Motion.View
          className="mx-4 flex-1 items-start "
          initial={{ y: -50, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            type: 'spring',
            damping: 20,
          }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ y: 20 }}
        >
          <View className="h-14 w-14 justify-center rounded-full border border-gray-700 bg-black">
            <Image
              resizeMode="contain"
              className="h-9 w-full"
              source={winglerLogo}
            />
          </View>
          <View className="mx-14 flex-1 flex-row rounded-xl rounded-tl-none bg-teal-600 px-6 py-4">
            <Text className="flex-wrap text-xl text-white">
              {item.botQA.answer}
            </Text>
          </View>
        </Motion.View>
      )}
    </View>
  );
};

export default function Chat({ history }: { history: RhinoInferenceObject[] }) {
  const scrollViewRef = useRef<ScrollView>(null);
  return (
    <View>
      <ScrollView
        className=""
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {history.map((item, index) => (
          <QnA key={item.id} index={index} item={item} />
        ))}
      </ScrollView>
      <LinearGradient
        colors={['rgba(0,0,0,1)', 'rgba(0,0,0,1)', 'transparent']}
        className="absolute z-40 h-1/3 w-full"
      />
    </View>
  );
}
