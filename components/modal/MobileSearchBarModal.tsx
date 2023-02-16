import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import { FormEvent, Fragment, useRef } from 'react';
import { IoSearchOutline } from 'react-icons/io5';

interface Props {
  onClose(): void;
}

export default function MobileSearchBarModal({ onClose }: Props) {
  const router = useRouter();

  const searchInputRef = useRef<HTMLInputElement>(null);

  function handleSearch(e: FormEvent) {
    e.preventDefault();

    const searchTerm = searchInputRef.current?.value!.trim();

    if (!searchTerm) return;

    router.push(`/search?q=${searchTerm}`);

    onClose();
  }

  return (
    <>
      <Transition appear show={true} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden border dark:border-darkBorder rounded-2xl dark:text-white bg-white dark:bg-darkSecondary p-6 text-left align-middle shadow-xl transition-all'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg font-bold leading-5 border-b border-b-gray-200 dark:border-b-darkBorder pb-4'
                  >
                    TikTok Search
                  </Dialog.Title>

                  <form
                    onSubmit={handleSearch}
                    className='mt-6 mb-2 flex justify-between items-center dark:text-white bg-gray-100 dark:bg-darkBtnHover rounded-full overflow-hidden border dark:border-transparent focus-within:border-gray-300 dark:focus-within:border-gray-500 focus-within:bg-gray-200 dark:focus-within:bg-darkSecondary'
                  >
                    <input
                      ref={searchInputRef}
                      // defaultValue={router.query.q || ''}
                      type='text'
                      placeholder='Search accounts and videos'
                      className='flex-1 w-full peer p-2 pl-4 border-none outline-none bg-transparent dark:placeholder-gray-500'
                    />

                    <button
                      type='submit'
                      className='w-11 h-10 flex items-center justify-center border-l text-gray-400 border-l-gray-200 dark:border-l-gray-500 peer-focus:border-l-gray-300 dark:peer-focus:border-l-gray-500 cursor-pointer'
                    >
                      <IoSearchOutline size={23} />
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
