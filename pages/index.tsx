import axios from 'axios';
import Head from 'next/head';
import { Video } from '../types';
import VideoItem from '../components/videoItem';
import { MouseEvent, useCallback, useEffect, useRef } from 'react';
import { ROOT_URL } from '../utils';
import Layout from '../components/Layout';
import { GetServerSidePropsContext } from 'next';
import NoResult from '../components/NoResult';
import useStore from '../store';
import { getServerSession } from 'next-auth/next';
import { AUTH_OPTIONS } from './api/auth/[...nextauth]';
import { useRestorePreviousScroll } from '../hooks/usePrevScroll';
import { useRouter } from 'next/router';
import { closeSidebar } from '../utils/sidebar-drawer';

const metadata = {
  description:
    'TikTok, also known in China as Douyin, is a short-form video hosting service owned by the Chinese company ByteDance. It hosts user-submitted videos, which can range in duration from 3 seconds to 10 minutes.',
  title: 'TikTok - Make Your Day',
};

interface Props {
  videos: Video[];
}
export type TIntersectingVideo = {
  inView: boolean;
  id: string;
  videoRef: React.RefObject<HTMLVideoElement>;
};

export default function Home({ videos }: Props) {
  const router = useRouter();
  const {
    currentVideo,
    setCurrentVideo,
    setVideoContainerRef,
    isMute,
    toggleMute,
    isRestore,
  } = useStore();

  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  useRestorePreviousScroll(videoContainerRef);

  const handleIntersectingChange = useCallback(
    (video: TIntersectingVideo) => {
      const { inView, videoRef } = video;
      const videoElem = videoRef.current;

      if (!videoElem) return;

      if (!inView) {
        videoElem.pause();
        videoElem.currentTime = 0;
        return;
      }

      videoElem.play();
      setCurrentVideo(videoRef, true);
    },
    [setCurrentVideo],
  );

  // handle mute/unmute
  useEffect(() => {
    const video = currentVideo.videoRef?.current;
    if (!video) return;

    video.muted = isMute;
  }, [isMute, currentVideo]);

  const handleMute = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      toggleMute();
    },
    [toggleMute],
  );

  // set videoContainerRef to global store
  useEffect(() => {
    if (!videoContainerRef) return;
    setVideoContainerRef(videoContainerRef);
  }, [setVideoContainerRef, videoContainerRef]);

  // reset scroll position after topic change
  // Omit `isRestore` from effect's dependency array to avoid unnecessary render
  useEffect(() => {
    const videoContainer = videoContainerRef.current;
    if (!videoContainer || isRestore) return;

    videoContainer.scrollTop = 0;

    // close sidebar on topic change
    closeSidebar();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.topic]);

  return (
    <Layout>
      <Head>
        <title>{metadata.title}</title>
        <meta name='description' content={metadata.description} />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
        <meta property='og:title' content={metadata.title} />
        <meta property='og:description' content={metadata.description} />
        <meta
          property='og:url'
          content='https://tiktok-clone-zhy.vercel.app/'
        ></meta>
        <meta
          property='og:image'
          content='https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kdb7qa7aav7vww7ayiki.png'
        />
      </Head>

      <div
        ref={videoContainerRef}
        style={{
          height:
            'calc(100vh - 97px - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
          scrollbarWidth: 'none',
          scrollSnapType: 'y mandatory',
        }}
        className='video-container w-full space-y-6 overflow-y-auto px-4 md:px-10'
      >
        {videos?.length > 0 ? (
          videos.map((video) => (
            <VideoItem
              handleIntersectingChange={handleIntersectingChange}
              key={video._id}
              post={video}
              isMute={isMute}
              handleMute={handleMute}
            />
          ))
        ) : (
          <NoResult title='No video found!' />
        )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const topic = context.query.topic;
  let videos;

  // retrieve user
  const session = await getServerSession(
    context.req,
    context.res,
    AUTH_OPTIONS,
  );
  const currentUserId = session?._id;

  // query videos
  if (topic) {
    const { data } = await axios.get(
      `${ROOT_URL}/api/post/discover/${topic}?currentUserId=${currentUserId}`,
    );
    videos = data;
  } else {
    const { data } = await axios.get(
      `${ROOT_URL}/api/post?currentUserId=${currentUserId}`,
    );
    videos = data;
  }

  return { props: { videos } };
}
