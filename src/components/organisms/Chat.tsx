import { LinearGradient } from 'expo-linear-gradient';
import { memo, useEffect, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';

import useHistoryStore from '@/store/useHistoryStore';
import type { RhinoInferenceObject } from '@/types';

import Bubble from './Bubble';

const QnA = memo(
  ({ item, index }: { item: RhinoInferenceObject; index: Number }) => {
    const [show, setShow] = useState(item.botQA.done);
    const style = index === 0 ? 'mt-24' : 'mt-0';
    const { question, answer } = item.botQA;
    console.log('QnA', item.botQA.answer);

    useEffect(() => {
      if (!show) {
        setTimeout(() => {
          setShow(true);
        }, 1000);
      }
    }, [show]);

    return (
      <View key={item.id} className={style}>
        <Bubble type="user" content={question} />
        {show &&
          (typeof answer === 'string' ? (
            <Bubble type="answer" content={answer} />
          ) : (
            <Bubble id={item.id} type={answer.type} content={answer} />
          ))}
      </View>
    );
  },
);

export default function Chat() {
  const scrollViewRef = useRef<ScrollView>(null);
  const { history } = useHistoryStore();
  return (
    <View>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
        className="h-full"
      >
        {history.map((item, index) => (
          <QnA key={item.id} index={index} item={item} />
        ))}
      </ScrollView>
      <LinearGradient
        colors={['#151523', '#151523', 'transparent']}
        className="absolute z-40 h-24 w-full"
      />
    </View>
  );
}
