import Head from 'next/head';
import { FaCloudUploadAlt } from 'react-icons/fa';
import SelectTopic from '../components/SelectTopic';
import { client } from '../utils/client';
import { useEffect, useState } from 'react';
import { SanityAssetDocument } from '@sanity/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import axios from 'axios';
import { ROOT_URL } from '../utils';

interface Event<T = EventTarget> {
  target: T;
}

const noTopic = { name: 'No Topic', icon: '' };

export default function Upload() {
  const { data: user, status }: any = useSession();
  const router = useRouter();

  const [videoAsset, setVideoAsset] = useState<SanityAssetDocument | null>(
    null,
  );
  const [caption, setCaption] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(noTopic);
  const [isUploading, setIsUploading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isLargeFile, setIsLargeFile] = useState({ message: '' });

  async function uploadFile(e: Event<HTMLInputElement>) {
    const selectedFile = e.target.files![0] as File;
    const fileTypes = ['video/mp4', 'video/webm'];

    if (selectedFile && fileTypes.includes(selectedFile.type)) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setIsLargeFile({ message: 'file size should not exceed 10MB' });
        return;
      } else {
        setIsLargeFile({ message: '' });
      }

      setIsUploading(true);

      try {
        const video = await client.assets.upload('file', selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        });

        setVideoAsset(video);
        setIsUploading(false);
      } catch (error) {
        setIsUploading(false);
        console.log(error);
      }
    }
  }

  async function handleUpload() {
    if (!caption || !videoAsset) return;

    setIsPosting(true);

    const doc = {
      _type: 'post',
      caption,
      video: {
        _type: 'file',
        asset: {
          _type: 'reference',
          _ref: videoAsset._id,
        },
      },
      userId: user?._id,
      postedBy: {
        _type: 'postedBy',
        _ref: user?._id,
      },
      topic: selectedTopic.name === 'No Topic' ? '' : selectedTopic.name,
    };

    await axios.post(`${ROOT_URL}/api/post`, doc);

    handleDiscard();

    router.push('/');

    setIsPosting(false);
  }

  function handleDiscard() {
    setVideoAsset(null);
    setCaption('');
    setSelectedTopic(noTopic);
    setIsPosting(false);
  }

  useEffect(() => {
    if (status !== 'loading' && !user) {
      router.back();
    }
  }, [user, router, status]);

  return (
    <Layout>
      <Head>
        <title>Upload | Tik Tok</title>
        <meta
          property='og:url'
          content='https://tiktok-clone-zhy.vercel.app/upload'
        ></meta>
      </Head>

      <div
        style={{
          height:
            'calc(100vh - 97px - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
        }}
        className='w-full overflow-hidden overflow-y-auto text-gray-600 dark:text-gray-200'
      >
        <div className='mx-auto mb-10 max-w-4xl overflow-hidden rounded-lg border p-4 shadow-sm dark:border-darkBtn xs:mb-0 xs:p-6'>
          <div className='mb-8'>
            <h2 className='text-2xl font-bold'>Upload video</h2>
            <p className='text-[rgba(22,24,35,0.5)] dark:text-gray-400'>
              Post a video to your account
            </p>
          </div>

          <div className='flex flex-col-reverse items-center md:flex-row'>
            {/* left */}
            <label
              htmlFor='video'
              className={`${
                isUploading ? 'bg-gray-100 dark:bg-darkBtnHover' : ''
              } ${
                videoAsset ? 'border-none bg-black p-0' : 'p-4'
              } flex h-[458px] w-[260px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-500 transition-all hover:border-primary`}
            >
              {videoAsset ? (
                <video
                  src={videoAsset.url}
                  autoPlay
                  controls
                  loop
                  muted
                  className='video h-full w-full object-center'
                />
              ) : isUploading ? (
                <>
                  <div className='h-12 w-12 animate-spin rounded-full border-2 border-l-primary' />
                  <h3 className='mt-4 animate-pulse text-lg tracking-wide'>
                    Uploading...
                  </h3>
                </>
              ) : (
                <>
                  <div className='flex justify-center text-gray-300'>
                    <FaCloudUploadAlt size={45} />
                  </div>
                  <h3 className='mb-6 text-lg font-semibold text-black dark:text-gray-200'>
                    Select video to upload
                  </h3>
                  <p className='mb-2 text-sm'>MP4 or WebM</p>
                  <p className='mb-2 text-sm'>720x1280 resolution or higher</p>
                  <p className='mb-2 text-sm'>Up to 30 minutes</p>
                  <p className='mb-6 text-sm'>Less than 10 MB</p>
                  <p className='btn-primary w-4/5 py-2 text-center'>
                    Select file
                  </p>
                  <input
                    id='video'
                    type='file'
                    accept='video/mp4, video/webm'
                    className='h-0 w-0'
                    onChange={uploadFile}
                  />
                  {isLargeFile ? (
                    <p className='mt-4 text-center text-sm font-semibold text-red-500'>
                      {isLargeFile.message}
                    </p>
                  ) : (
                    ''
                  )}
                </>
              )}
            </label>

            {/* right */}
            <div className='mb-10 w-full flex-1 md:mb-0 md:pl-8'>
              <label htmlFor='caption' className='mb-2 block font-semibold'>
                Caption
              </label>
              <input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                type='text'
                autoComplete='off'
                id='caption'
                className='block w-full rounded-lg border px-3 py-2 shadow-md outline-none dark:border-darkBorder dark:bg-transparent'
              />

              <p className='mb-2 mt-6 font-semibold'>Choose a topic</p>
              <SelectTopic
                selectedTopic={selectedTopic}
                setSelectedTopic={setSelectedTopic}
              />

              <div className='mt-12 hidden items-center justify-center gap-4 md:flex'>
                <button
                  onClick={handleDiscard}
                  disabled={isPosting || (!caption && !videoAsset)}
                  className='btn-secondary w-36 py-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:bg-darkBtnHover dark:disabled:text-gray-500'
                >
                  Discard
                </button>

                <button
                  onClick={handleUpload}
                  className='btn-primary w-36 py-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:bg-darkBtnHover dark:disabled:text-gray-500'
                  disabled={!caption || !videoAsset || isPosting}
                >
                  {isPosting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>

          {/* mobile layout */}
          <div className='mt-10 flex items-center justify-center gap-4 xs:mt-12 md:hidden'>
            <button
              onClick={handleDiscard}
              disabled={isPosting || (!caption && !videoAsset)}
              className='btn-secondary w-36 py-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:bg-darkBtnHover dark:disabled:text-gray-500'
            >
              Discard
            </button>

            <button
              onClick={handleUpload}
              className='btn-primary w-36 py-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:bg-darkBtnHover dark:disabled:text-gray-500'
              disabled={!caption || !videoAsset || isPosting}
            >
              {isPosting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
