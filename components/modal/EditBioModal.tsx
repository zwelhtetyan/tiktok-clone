import { Dialog, Transition } from '@headlessui/react';
import { Fragment, RefObject } from 'react';

interface Props {
  onClose(): void;
  handleSaveBio(): Promise<void>;
  bioRef: RefObject<HTMLTextAreaElement>;
  savingBio: boolean;
  bio: string;
}

export default function EditBioModal({
  onClose,
  bioRef,
  handleSaveBio,
  savingBio,
  bio,
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
                    Bio
                  </Dialog.Title>
                  <div className='mt-4 flex-col items-center flex justify-center'>
                    <textarea
                      ref={bioRef}
                      defaultValue={bio}
                      placeholder='Bio'
                      className='w-full h-28 border outline-none rounded-lg py-2 px-3 dark:bg-transparent border-gray-200 dark:border-darkBorder'
                    />

                    <div className='w-full mt-4 flex items-center justify-end gap-3'>
                      <button
                        onClick={onClose}
                        disabled={savingBio}
                        className='btn-secondary py-2 px-6 disabled:cursor-not-allowed'
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveBio}
                        disabled={savingBio}
                        className='btn-primary py-2 px-6 disabled:cursor-not-allowed'
                      >
                        {savingBio ? 'Saving...' : 'Save'}
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
