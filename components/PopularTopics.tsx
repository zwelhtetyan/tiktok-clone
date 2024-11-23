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
          : 'border-gray-200 bg-gray-100 text-gray-800 hover:border-gray-300 hover:bg-gray-200 dark:bg-darkBtn dark:text-gray-200 dark:hover:bg-darkBtnHover'
      } flex h-12 w-12 items-center justify-center rounded-full border text-sm dark:border-darkSecondary lg:h-auto lg:w-auto lg:px-3 lg:py-2`}
    >
      {topic.icon} <p className='ml-2 hidden lg:block'>{topic.name}</p>
    </button>
  );
}

export default function PopularTopics() {
  return (
    <div className='mb-2'>
      <h2 className='mb-3 hidden font-semibold text-gray-500 dark:text-gray-400 lg:block'>
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
