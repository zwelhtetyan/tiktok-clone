import axios from 'axios';
import Head from 'next/head';
import { ROOT_URL } from '../../utils';
import { Video } from '../../types';
import { RxCross2 } from 'react-icons/rx';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { formatDate } from '../../utils/formatDate';
import { BsHeartFill } from 'react-icons/bs';
import { RiMessage2Fill } from 'react-icons/ri';

interface DetailProps {
  videoDetail: Video;
}

export default function Detail({ videoDetail }: DetailProps) {
  const router = useRouter();

  console.log(videoDetail);

  return (
    <>
      <Head>
        <title>{videoDetail.caption} | Tik Tok</title>
      </Head>

      <div className='dark:bg-dark dark:text-white min-h-screen w-full flex'>
        <div className='flex-1 h-screen bg-img-blur bg-no-repeat bg-cover object-cover'>
          <div
            onClick={() => router.back()}
            title='back'
            className='absolute flex items-center justify-center text-white bg-[#7e7b7b5e] w-9 h-9 rounded-full top-2 left-2 cursor-pointer hover:bg-[#5c59595e]'
          >
            <RxCross2 size={23} />
          </div>

          <div className='bg-black h-full max-w-[390px]  flex items- justify-center mx-auto cursor-pointer'>
            <video
              src={videoDetail.video.asset.url}
              autoPlay
              loop
              controls
              className='w-full h-full'
            />
          </div>
        </div>

        <div className='w-[500px] h-screen border-l border-l- border-l-darkBorder p-6'>
          <header>
            <div className='w-full flex items-center justify-between mb-2'>
              <div className='flex items-center'>
                <Image
                  src={videoDetail.postedBy.image}
                  width={100}
                  height={100}
                  alt='profile_img'
                  className='w-12 h-12 xs:w-14 xs:h-14 rounded-full mr-2 xs:mr-3 p-[4px] duration-200 hover:bg-gray-200 dark:hover:bg-darkSecondary cursor-pointer'
                />

                <div>
                  <h2 className='text-lg font-bold leading-5'>
                    {videoDetail.postedBy.userName}
                  </h2>
                  <p className='text-gray-500 text-sm'>
                    {formatDate(videoDetail._createdAt!)}
                  </p>
                </div>
              </div>
            </div>
            <p>{videoDetail.caption}</p>

            <div className='mt-6 flex'>
              <div className='flex items-center'>
                <div className='flex items-center mr-6 text-sm'>
                  <button className='reaction-btn'>
                    <BsHeartFill size={18} />
                  </button>
                  11
                </div>
                <div className='flex items-center text-sm'>
                  <button className='reaction-btn'>
                    <RiMessage2Fill size={18} />
                  </button>
                  5
                </div>
              </div>

              <div></div>
            </div>
          </header>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({
  params: { id },
}: {
  params: { id: string };
}) {
  const res = await axios.get(`${ROOT_URL}/api/post/${id}`);

  return { props: { videoDetail: res.data } };
}
