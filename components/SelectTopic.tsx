import { Fragment, ReactNode } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { VscCheck } from 'react-icons/vsc';
import { HiChevronUpDown } from 'react-icons/hi2';
import { topics } from '../utils/constants';

interface SelectedTopicProps {
  selectedTopic: { name: string; icon: ReactNode };
  setSelectedTopic: (parm: any) => void;
}

export default function SelectTopic({
  selectedTopic,
  setSelectedTopic,
}: SelectedTopicProps) {
  return (
    <Listbox value={selectedTopic} onChange={setSelectedTopic}>
      <div className='relative mt-1'>
        <Listbox.Button className='relative w-full rounded-lg border py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 dark:border-darkBorder'>
          <span className='block truncate'>{selectedTopic.name}</span>
          <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
            <HiChevronUpDown
              className='h-5 w-5 text-gray-400'
              aria-hidden='true'
              size={20}
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave='transition ease-in duration-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <Listbox.Options className='absolute mt-1 max-h-52 w-full overflow-auto rounded-md border bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-darkBorder dark:bg-dark sm:text-sm'>
            {[{ name: 'No Topic', icon: '' }, ...topics].map((topic, idx) => (
              <Listbox.Option
                key={idx}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active
                      ? 'bg-pink-200 dark:bg-darkBtnHover'
                      : 'text-gray-900 dark:text-gray-100'
                  }`
                }
                value={topic}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      {topic.name}
                    </span>
                    {selected ? (
                      <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-primary'>
                        <VscCheck
                          size={20}
                          className='h-5 w-5'
                          aria-hidden='true'
                        />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
