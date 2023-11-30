import { memo, useCallback, useEffect, useRef, useState } from 'react';
import type { ViewToken } from 'react-native';
import { FlatList, View } from 'react-native';

import useHistoryStore from '@/store/useHistoryStore';
import { useRefStore } from '@/store/useRefStore';
import type { RhinoInferenceObject } from '@/types';

import Bubble from './Bubble'; // replace with your actual path

interface QnAProps {
  item: RhinoInferenceObject;
  index: number;
  isVisible: boolean;
}

const fakeHistory = [
  {
    botQA: {
      question: '',
      answer: {
        type: 'help',
      },
    },
    id: '1',
  },
];

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
      {question !== '' && <Bubble type="user" content={question} />}
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
  const [visibleItems, setVisibleItems] = useState<string[]>([]);
  const { setChatRef } = useRefStore();
  const { history } = useHistoryStore();

  const chatRef = useRef<FlatList<RhinoInferenceObject>>(null);

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const keys = viewableItems.map((item: ViewToken) => item.key);
      setVisibleItems(keys);
    },
    [],
  );

  useEffect(() => {
    if (chatRef.current) setChatRef(chatRef);
  }, [chatRef, setChatRef]);

  return (
    <FlatList
      ref={chatRef}
      className="h-full"
      data={history.length > 0 ? history : fakeHistory}
      onViewableItemsChanged={handleViewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 75,
        minimumViewTime: 500,
      }}
      onContentSizeChange={() =>
        chatRef.current?.scrollToEnd({ animated: true })
      }
      renderItem={({ item, index }) => (
        <QnA
          key={item.id}
          index={index}
          item={item}
          isVisible={visibleItems.includes(item.id)}
        />
      )}
    />
  );
};

export default Chat;
