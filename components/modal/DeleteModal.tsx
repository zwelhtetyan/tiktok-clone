import { Dialog, Transition } from '@headlessui/react';
import { Fragment, memo } from 'react';

interface Props {
  onClose(): void;
  deleteHandler(): Promise<void>;
  deleting: boolean;
  type: string;
  text: string;
}

export default function DeleteModal({
  onClose,
  deleteHandler,
  deleting,
  type,
  text,
}: Props) {
  return (
    <>
      <Transition appear show={true} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={() => {}}>
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
                    Delete {type}
                  </Dialog.Title>
                  <div className='mt-4 flex-col items-center flex justify-center'>
                    <div>
                      <h4 className='w-full font-bold text-center line-clamp-1'>
                        {text}
                      </h4>
                      <p className='text-gray-500 dark:text-gray-300 text-sm mt-1'>
                        Are you sure you want to delete this {type}?
                      </p>
                    </div>

                    <div className='w-full mt-4 flex items-center justify-end gap-3'>
                      <button
                        onClick={onClose}
                        disabled={deleting}
                        className='btn-secondary py-2 px-6 disabled:cursor-not-allowed'
                      >
                        Close
                      </button>
                      <button
                        onClick={deleteHandler}
                        disabled={deleting}
                        className='btn-primary py-2 px-6 disabled:cursor-not-allowed'
                      >
                        {deleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
