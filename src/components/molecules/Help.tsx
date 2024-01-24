import { Motion } from '@legendapp/motion';
import { useEffect, useState } from 'react';

import type { BotQA } from '@/types';

import Answer from './Answer';
import ImageBubble from './Image';
import Logo from './Logo';

interface HelpHistoryItem {
  botQA: BotQA;
  id: string;
}
const helpHistory: HelpHistoryItem[] = [
  // {
  //   botQA: {
  //     question: '',
  //     answer: {
  //       uri: 'https://i.etsystatic.com/10823390/r/il/35be00/1353801568/il_570xN.1353801568_7l7w.jpg',
  //     },
  //   },
  //   id: '0',
  // },
  {
    botQA: {
      question: '',
      answer: "Hello, I'm [font-moon text-xl text-accent]wingler™[]",
    },
    id: '1',
  },
  {
    botQA: {
      question: '',
      answer: `Your best buddy on the road!`,
    },
    id: '22',
  },
  // {
  //   botQA: {
  //     question: '',
  //     answer: `Play a song like this:                  [mb-2 bg-accent block text-primary-black px-3 rounded-full]wingler[] [bg-accent-secondary text-primary-black px-3 rounded-full]play song[] [bg-orange-500 text-primary-black px-3 rounded-full]best of joy[]`,
  //   },
  //   id: '2',
  // },
  {
    botQA: {
      question: '',
      answer:
        'Ask for directions by voice, like this:[mb-2 bg-accent block text-primary-black px-3 rounded-full]wingler[] [bg-accent-secondary text-primary-black px-3 rounded-full]maps[] [bg-orange-500 text-primary-black px-3 rounded-full]food in Eskilstuna[]',
    },
    id: '3',
  },
  {
    botQA: {
      question: '',
      answer: 'Have fun!',
    },
    id: '4',
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
    }, 1000);

    return () => {
      clearInterval(interval);
      setDisplayedItems([]);
    };
  }, []);

  return (
    <>
      <Logo />
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
          {typeof item.botQA.answer === 'string' ? (
            <Answer content={item.botQA.answer} />
          ) : (
            <ImageBubble content={item.botQA.answer.uri as string} />
          )}
        </Motion.View>
      ))}
    </>
  );
};

export default Help;
