import axios from 'axios';
import Head from 'next/head';
import { ROOT_URL } from '../../utils';
import { Video } from '../../types';
import { RxCross2 } from 'react-icons/rx';
import { useRouter } from 'next/router';
import CommentSection from '../../components/commentSection';
import { useEffect } from 'react';
import NoResult from '../../components/NoResult';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { GetServerSidePropsContext } from 'next';
import { AUTH_OPTIONS } from '../api/auth/[...nextauth]';
import useStore from '../../store';

interface DetailProps {
  videoDetail: Video;
}

export default function VideoDetail({ videoDetail }: DetailProps) {
  const router = useRouter();
  const { setIsRestore } = useStore();

  const TITLE = !videoDetail
    ? 'No video found'
    : `${videoDetail.caption} | TikTok Video`;

  // set isRestore to true before history change to keep previous scroll in next page
  useEffect(() => {
    const onBeforeHistoryChange = () => {
      setIsRestore(true);
    };

    router.events.on('beforeHistoryChange', onBeforeHistoryChange);

    return () => {
      router.events.off('beforeHistoryChange', onBeforeHistoryChange);
    };
  }, [router.events, setIsRestore]);

  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta
          property='og:url'
          content={`https://tiktok-clone-zhy.vercel.app/video/${router.query.id}`}
        ></meta>
      </Head>

      {!videoDetail ? (
        <>
          <NoResult title='No video found!' />
          <Link
            href='/'
            className='mt-2 block text-center text-sm font-bold text-primary hover:underline'
          >
            Back to home
          </Link>
        </>
      ) : (
        <>
          <div className='flex w-full flex-col dark:bg-dark dark:text-white lg:min-h-screen lg:flex-row'>
            {/* left */}
            <div className='h-[480px] w-full bg-img-blur-light bg-cover bg-no-repeat object-cover dark:bg-img-blur-dark lg:h-screen lg:flex-1'>
              <div
                onClick={() => router.back()}
                title='back'
                className='absolute left-2 top-2 hidden h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#7e7b7b5e] text-white hover:bg-[#5c59595e] xs:flex'
              >
                <RxCross2 size={23} />
              </div>

              <div className='items- mx-auto flex h-full max-w-[270px] cursor-pointer justify-center bg-black lg:max-w-[390px]'>
                <video
                  src={videoDetail.video.asset.url}
                  autoPlay
                  loop
                  controls
                  className='h-full w-full'
                />
              </div>
            </div>

            {/* right */}
            <CommentSection videoDetail={videoDetail} />
          </div>
        </>
      )}
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { params, req, res } = context;
  const session = await getServerSession(req, res, AUTH_OPTIONS);
  const videoId = params?.id;
  const currentUserId = session?._id;

  const response = await axios.get(
    `${ROOT_URL}/api/post/${videoId}?currentUserId=${currentUserId}`,
  );

  return { props: { videoDetail: response.data } };
}
