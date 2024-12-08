import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

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
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl border bg-white p-6 text-left align-middle shadow-xl transition-all dark:border-darkBorder dark:bg-darkSecondary dark:text-white'>
                  <Dialog.Title
                    as='h3'
                    className='border-b border-b-gray-200 pb-4 text-lg font-bold leading-5 dark:border-b-darkBorder'
                  >
                    Delete {type}
                  </Dialog.Title>
                  <div className='mt-4 flex flex-col items-center justify-center'>
                    <div>
                      <h4 className='line-clamp-1 w-full text-center font-bold'>
                        {text}
                      </h4>
                      <p className='mt-1 text-sm text-gray-500 dark:text-gray-300'>
                        Are you sure you want to delete this {type}?
                      </p>
                    </div>

                    <div className='mt-4 flex w-full items-center justify-end gap-3'>
                      <button
                        onClick={onClose}
                        disabled={deleting}
                        className='btn-secondary px-6 py-2 disabled:cursor-not-allowed'
                      >
                        Close
                      </button>
                      <button
                        onClick={deleteHandler}
                        disabled={deleting}
                        className='btn-primary px-6 py-2 disabled:cursor-not-allowed'
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
