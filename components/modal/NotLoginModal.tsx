import { Dialog, Transition } from '@headlessui/react';
import { signIn } from 'next-auth/react';
import { Fragment } from 'react';

interface Props {
  onClose(): void;
}

export default function NotLoginModal({ onClose }: Props) {
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
                    Login to TikTok
                  </Dialog.Title>
                  <div className='mt-6 flex flex-col items-center justify-center'>
                    <p className='mb-4 text-sm tracking-wide text-gray-500 dark:text-gray-300'>
                      Continue with google
                    </p>

                    <div className='flex items-center gap-3'>
                      <button
                        onClick={onClose}
                        className='btn-secondary px-6 py-2'
                      >
                        Close
                      </button>
                      <button
                        onClick={() => signIn('google')}
                        className='btn-primary px-6 py-2'
                      >
                        Login
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
