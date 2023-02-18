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
  const { data: user }: any = useSession();
  const router = useRouter();

  const [videoAsset, setVideoAsset] = useState<SanityAssetDocument | null>(
    null
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
    if (!user) {
      router.back();
    }
  }, [user, router]);

  return (
    <Layout>
      <Head>
        <title>Upload | Tik Tok</title>
        <meta
          property='og:url'
          content='https://tiktok-clone-zhy.vercel.app/upload'
        ></meta>
      </Head>

      <div className='w-full h-[calc(100vh-97px)] overflow-hidden overflow-y-auto text-gray-600 dark:text-gray-200'>
        <div className='border shadow-sm dark:border-darkBtn max-w-4xl mx-auto p-4 xs:p-6 rounded-lg mb-10 xs:mb-0 overflow-hidden'>
          <div className='mb-8'>
            <h2 className='text-2xl font-bold'>Upload video</h2>
            <p className='text-[rgba(22,24,35,0.5)] dark:text-gray-400'>
              Post a video to your account
            </p>
          </div>

          <div className='flex flex-col-reverse md:flex-row items-center'>
            {/* left */}
            <label
              htmlFor='video'
              className={`${
                isUploading ? 'bg-gray-100 dark:bg-darkBtnHover' : ''
              } ${
                videoAsset ? 'p-0 bg-black border-none' : 'p-4'
              } flex flex-col items-center justify-center w-[260px] h-[458px] rounded-lg border-2 border-dashed border-gray-300 hover:border-primary text-gray-500 cursor-pointer transition-all`}
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
                  <div className='border-2 border-l-primary animate-spin w-12 h-12 rounded-full' />
                  <h3 className='mt-4 text-lg animate-pulse tracking-wide'>
                    Uploading...
                  </h3>
                </>
              ) : (
                <>
                  <div className='flex justify-center text-gray-300'>
                    <FaCloudUploadAlt size={45} />
                  </div>
                  <h3 className='font-semibold text-lg mb-6 text-black dark:text-gray-200'>
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
                    className='w-0 h-0'
                    onChange={uploadFile}
                  />
                  {isLargeFile ? (
                    <p className='mt-4 text-sm text-center text-red-500 font-semibold'>
                      {isLargeFile.message}
                    </p>
                  ) : (
                    ''
                  )}
                </>
              )}
            </label>

            {/* right */}
            <div className='flex-1 md:pl-8 w-full mb-10 md:mb-0'>
              <label htmlFor='caption' className='block mb-2 font-semibold'>
                Caption
              </label>
              <input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                type='text'
                autoComplete='off'
                id='caption'
                className='block border shadow-md outline-none w-full rounded-lg py-2 px-3 dark:bg-transparent dark:border-darkBorder'
              />

              <p className='mb-2 mt-6 font-semibold'>Choose a topic</p>
              <SelectTopic
                selectedTopic={selectedTopic}
                setSelectedTopic={setSelectedTopic}
              />

              <div className='mt-12 hidden md:flex items-center justify-center gap-4'>
                <button
                  onClick={handleDiscard}
                  disabled={isPosting || (!caption && !videoAsset)}
                  className='btn-secondary py-2 w-36 disabled:cursor-not-allowed'
                >
                  Discard
                </button>

                <button
                  onClick={handleUpload}
                  className='btn-primary py-2 w-36 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-darkBtnHover disabled:text-gray-400 dark:disabled:text-gray-500'
                  disabled={!caption || !videoAsset || isPosting}
                >
                  {isPosting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>

          {/* mobile layout */}
          <div className='mt-10 xs:mt-12 flex md:hidden items-center justify-center gap-4'>
            <button
              onClick={handleDiscard}
              disabled={isPosting || !caption || !videoAsset}
              className='btn-secondary py-2 w-36 disabled:cursor-not-allowed'
            >
              Discard
            </button>

            <button
              onClick={handleUpload}
              className='btn-primary py-2 w-36 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-darkBtnHover disabled:text-gray-400 dark:disabled:text-gray-500'
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
