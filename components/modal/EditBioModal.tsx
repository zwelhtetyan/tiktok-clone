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
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl border bg-white p-6 text-left align-middle shadow-xl transition-all dark:border-darkBorder dark:bg-darkSecondary dark:text-white'>
                  <Dialog.Title
                    as='h3'
                    className='border-b border-b-gray-200 pb-4 text-lg font-bold leading-5 dark:border-b-darkBorder'
                  >
                    Bio
                  </Dialog.Title>
                  <div className='mt-4 flex flex-col items-center justify-center'>
                    <textarea
                      ref={bioRef}
                      defaultValue={bio}
                      placeholder='Bio'
                      className='h-28 w-full rounded-lg border border-gray-200 px-3 py-2 outline-none dark:border-darkBorder dark:bg-transparent'
                    />

                    <div className='mt-4 flex w-full items-center justify-end gap-3'>
                      <button
                        onClick={onClose}
                        disabled={savingBio}
                        className='btn-secondary px-6 py-2 disabled:cursor-not-allowed'
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveBio}
                        disabled={savingBio}
                        className='btn-primary px-6 py-2 disabled:cursor-not-allowed'
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
