import Head from 'next/head';
import { FaCloudUploadAlt } from 'react-icons/fa';
import SelectTopic from '../components/SelectTopic';

export default function Upload() {
  return (
    <>
      <Head>
        <title>Upload | Tik Tik</title>
      </Head>

      <div className='border shadow-sm max-w-4xl mx-auto p-6 rounded-lg'>
        <div className='mb-8'>
          <h2 className='text-2xl font-bold'>Upload video</h2>
          <p className='text-[rgba(22,24,35,0.5)]'>
            Post a video to your account
          </p>
        </div>

        <div className='flex items-center'>
          <div className='flex flex-col items-center justify-center w-[260px] h-[458px] rounded-lg border-2 border-dashed border-gray-300 p-4 text-[rgba(22,24,35,0.5)] cursor-pointer hover:border-primary transition-all'>
            <div className='flex justify-center text-gray-300'>
              <FaCloudUploadAlt size={45} />
            </div>
            <h3 className='font-semibold text-lg mb-6 text-black'>
              Select video to upload
            </h3>
            <p className='mb-2 text-sm'>MP4 or WebM</p>
            <p className='mb-2 text-sm'>720x1280 resolution or higher</p>
            <p className='mb-2 text-sm'>Up to 30 minutes</p>
            <p className='mb-6 text-sm'>Less than 2 GB</p>
            <button className='btn-primary w-4/5 py-2'>Select file</button>
          </div>

          <div className='flex-1 pl-8'>
            <label htmlFor='caption' className='block mb-2'>
              Caption
            </label>
            <input
              type='text'
              id='caption'
              className='block shadow-md outline-none w-full rounded-lg py-3 px-3'
            />

            <p className='mb-2 mt-6'>Choose a topic</p>
            <SelectTopic />

            <div className='mt-12 flex items-center justify-center gap-4'>
              <button className='bg-gray-200 rounded py-2 w-36 border-gray-300 hover:border-gray-400'>
                Discard
              </button>
              <button className='btn-primary py-2 w-36'>Post</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
