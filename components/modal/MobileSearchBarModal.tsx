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
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl border bg-white p-6 text-left align-middle shadow-xl transition-all dark:border-darkBorder dark:bg-darkSecondary dark:text-white'>
                  <Dialog.Title
                    as='h3'
                    className='border-b border-b-gray-200 pb-4 text-lg font-bold leading-5 dark:border-b-darkBorder'
                  >
                    TikTok Search
                  </Dialog.Title>

                  <form
                    onSubmit={handleSearch}
                    className='mb-2 mt-6 flex items-center justify-between overflow-hidden rounded-full border bg-gray-100 focus-within:border-gray-300 focus-within:bg-gray-200 dark:border-transparent dark:bg-darkBtnHover dark:text-white dark:focus-within:border-gray-500 dark:focus-within:bg-darkSecondary'
                  >
                    <input
                      ref={searchInputRef}
                      // defaultValue={router.query.q || ''}
                      type='text'
                      placeholder='Search accounts and videos'
                      className='peer w-full flex-1 border-none bg-transparent p-2 pl-4 outline-none dark:placeholder-gray-500'
                    />

                    <button
                      type='submit'
                      className='flex h-10 w-11 cursor-pointer items-center justify-center border-l border-l-gray-200 text-gray-400 peer-focus:border-l-gray-300 dark:border-l-gray-500 dark:peer-focus:border-l-gray-500'
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
