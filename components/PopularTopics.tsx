import { ReactNode } from 'react';
import { topics } from '../utils/constants';
import { useRouter } from 'next/router';

interface TopicProp {
  topic: { name: string; icon: ReactNode };
}

function Topic({ topic }: TopicProp) {
  const router = useRouter();
  const activeTopic = router.query.topic;

  const clickTopicHandler = (topicName: string) =>
    router.push(`/?topic=${topicName}`);

  return (
    <button
      aria-label={topic.name}
      onClick={() => clickTopicHandler(topic.name)}
      key={topic.name}
      className={`${
        topic.name === activeTopic
          ? 'active-topic'
          : 'border-gray-200 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-darkBtn hover:bg-gray-200 dark:hover:bg-darkBtnHover hover:border-gray-300'
      } rounded-full flex items-center justify-center text-sm w-12 h-12 lg:w-auto lg:h-auto lg:px-3 lg:py-2 border dark:border-darkSecondary
      `}
    >
      {topic.icon} <p className='ml-2 hidden lg:block'>{topic.name}</p>
    </button>
  );
}

export default function PopularTopics() {
  return (
    <div className='mb-2'>
      <h2 className='font-semibold mb-3 text-gray-500 hidden lg:block'>
        Popular Topic
      </h2>

      <div className='flex flex-wrap gap-2'>
        {topics.map((topic) => (
          <Topic key={topic.name} topic={topic} />
        ))}
      </div>
    </div>
  );
}
