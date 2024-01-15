import { LinearGradient } from 'expo-linear-gradient';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import type { ViewToken } from 'react-native';
import { FlatList, View } from 'react-native';

import useHistoryStore from '@/store/useHistoryStore';
import { useRefStore } from '@/store/useRefStore';
import useSettingsStore from '@/store/useSettingsStore';
import type { RhinoInferenceObject } from '@/types';

import Bubble from './Bubble'; // replace with your actual path
import TextChat from './TextChat';

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
  const { showTextChat } = useSettingsStore();

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const keys = viewableItems.map((item: ViewToken) => item.key);
      setVisibleItems(keys);
    },
    [],
  );

  useEffect(() => {
    if (chatRef.current) setChatRef(chatRef);
    // clearHistory();
  }, [chatRef, setChatRef]);

  return (
    <>
      <LinearGradient
        colors={['#000000', '#00000000', 'transparent']}
        className="absolute top-0 z-50 h-40 w-full"
      />
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
        ListFooterComponent={
          <View style={{ height: showTextChat ? 82 : 10 }} />
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
      {showTextChat && (
        <>
          <LinearGradient
            colors={['#00000000', '#000000']}
            className="absolute bottom-0 z-40 h-20 w-full"
          />
          <TextChat />
        </>
      )}
    </>
  );
};

export default Chat;
