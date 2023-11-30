import { Motion } from '@legendapp/motion';
import { useEffect, useState } from 'react';

import type { BotQA } from '@/types';

import Answer from './Answer';

interface HelpHistoryItem {
  botQA: BotQA;
  id: string;
}
const helpHistory: HelpHistoryItem[] = [
  {
    botQA: {
      done: true,
      question: '',
      answer:
        "Hello stranger,\nI'm wingler™, your very own personal assistant for the road!",
    },
    id: '1',
  },
  {
    botQA: {
      question: '',
      answer: 'U can try saying:\n"wingler, play best of joy"',
    },
    id: '2',
  },
  {
    botQA: {
      question: '',
      answer:
        'Or ask for directions like this:\n"wingler, maps, restaurang i Eskilstuna"',
    },
    id: '3',
  },
];

const Help = () => {
  const [displayedItems, setDisplayedItems] = useState<HelpHistoryItem[]>([]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < helpHistory.length) {
        setDisplayedItems((prevItems) => {
          const newItem = helpHistory[index];
          if (newItem !== undefined) return [...prevItems, newItem];
          return prevItems;
        });

        index += 1;
      } else {
        clearInterval(interval);
      }
    }, 2000);

    return () => {
      clearInterval(interval);
      setDisplayedItems([]);
    };
  }, []);

  return (
    <>
      {displayedItems.map((item) => (
        <Motion.View
          key={item.id}
          className="flex-1"
          initial={{ y: 50, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ y: 20 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <Answer content={item.botQA.answer} />
        </Motion.View>
      ))}
    </>
  );
};

export default Help;
