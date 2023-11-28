import { memo, useCallback, useEffect, useRef, useState } from 'react';
import type { ViewToken } from 'react-native';
import { FlatList, View } from 'react-native';

import useHistoryStore from '@/store/useHistoryStore';
import { useRefStore } from '@/store/useRefStore';
import type { RhinoInferenceObject } from '@/types';

import Bubble from './Bubble'; // replace with your actual path

type ViewableItem = {
  item: any; // Replace 'any' with the type of your data
  key: string;
  index: number | null;
  isViewable: boolean;
  section?: any; // Replace 'any' with the type of your section data
};

interface QnAProps {
  item: RhinoInferenceObject;
  index: number;
  isVisible: boolean;
}

const QnA = memo(({ item, index, isVisible }: QnAProps) => {
  const [show, setShow] = useState(item.botQA.done);
  const style = index === 0 ? 'mt-24' : 'mt-0';
  const { question, answer } = item.botQA;

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
          <Bubble
            id={item.id}
            type={answer.type}
            content={answer}
            visible={isVisible}
          />
        ))}
    </View>
  );
});

const Chat = () => {
  // export default function Chat() {
  const { setChatRef } = useRefStore();
  const { history } = useHistoryStore();
  const chatRef = useRef<FlatList<RhinoInferenceObject>>(null);
  const [visibleItems, setVisibleItems] = useState<string[]>([]);
  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const keys = viewableItems.map((item: ViewableItem) => item.key);
      setVisibleItems(keys);
    },
    [],
  );

  useEffect(() => {
    if (chatRef.current) {
      setChatRef(chatRef);
    }
  }, [chatRef, setChatRef]);

  useEffect(() => {
    chatRef.current?.scrollToEnd({ animated: true });
  }, [history]);

  return (
    <View>
      <FlatList
        ref={chatRef}
        className="h-full"
        data={history}
        // initialScrollIndex={history.length - 1}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 75,
          minimumViewTime: 1000,
        }}
        renderItem={({ item, index }) => (
          <QnA
            key={item.id}
            index={index}
            item={item}
            isVisible={visibleItems.includes(item.id)}
          />
        )}
      />
    </View>
  );
};

export default Chat;
