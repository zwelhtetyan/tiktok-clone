import Head from 'next/head';
import Layout from '../../components/Layout';
import axios from 'axios';
import { ROOT_URL } from '../../utils';
import { User, Video } from '../../types';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BsHeartFill } from 'react-icons/bs';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import NoResult from '../../components/NoResult';
import TabItem from '../../components/TabItem';
import Header from './Header';
import millify from 'millify';
import useStore from '../../store';

interface Props {
  data: {
    user: User;
    userCreatedPosts: Video[];
    userLikedPosts: Video[];
  };
}

interface VideoItemProps {
  videoURL: string;
  likes: number;
  caption: string;
  videoId: string;
}

function VideoItem({ videoURL, likes, caption, videoId }: VideoItemProps) {
  return (
    <Link
      href={`/video/${videoId}`}
      className='flex w-52 flex-col items-center xs:w-auto'
    >
      <div className='relative flex h-[290px] w-52 items-center justify-center overflow-hidden rounded-md bg-black xs:h-[250px] xs:w-auto'>
        <video src={videoURL} className='object-cover' />

        <div className='absolute bottom-0 left-0 flex w-full items-center p-2 py-3 text-sm text-white backdrop-blur-sm'>
          <BsHeartFill size={18} className='mr-1' /> {millify(likes)}
        </div>
      </div>
      <p className='mt-1 line-clamp-1 self-start text-sm text-gray-900 dark:text-gray-300'>
        {caption}
      </p>
    </Link>
  );
}

export default function Profile({ data }: Props) {
  // destructure
  const { user: userInfo, userCreatedPosts, userLikedPosts } = data;

  // states
  const [user, setUser] = useState(userInfo);
  const [tab, setTab] = useState(0);

  // refs
  const bioRef = useRef<HTMLTextAreaElement>(null);

  // hooks
  const { data: currentUser }: any = useSession();
  const router = useRouter();
  const { setCurrentVideo } = useStore();

  const isCurrentUserProfile = user?._id === currentUser?._id;

  const hasNoUser =
    !userInfo && !userCreatedPosts.length && !userLikedPosts.length;

  useEffect(() => {
    setTab(0);
    setUser(userInfo);
  }, [router.query.id, userInfo]);

  useEffect(() => {
    setCurrentVideo(0, false, null);
  }, [setCurrentVideo]);

  const TITLE = hasNoUser ? 'No User Found' : `${user?.userName} | TikTok`;

  return (
    <Layout>
      <Head>
        <title>{TITLE}</title>
        <meta
          property='og:url'
          content={`https://tiktok-clone-zhy.vercel.app/profile/${router.query.id}`}
        ></meta>
      </Head>

      <div className='h-[calc(100vh-97px)] overflow-y-auto pl-2 sm:pl-4'>
        {hasNoUser ? (
          <NoResult title='No user found!' />
        ) : (
          <>
            <Header
              bioRef={bioRef}
              user={user}
              setUser={setUser}
              userCreatedPosts={userCreatedPosts}
            />

            <div className='mt-4'>
              {/* tab menu */}
              <div className='flex items-center'>
                <TabItem name='Videos' tabIdx={0} tab={tab} setTab={setTab} />
                <TabItem name='Liked' tabIdx={1} tab={tab} setTab={setTab} />
              </div>

              {/* no result */}
              {tab === 0 && userCreatedPosts?.length < 1 ? (
                <NoResult
                  title={
                    isCurrentUserProfile
                      ? 'Upload your first video'
                      : 'No uploaded videos yet!'
                  }
                  desc={
                    isCurrentUserProfile ? 'Your videos will appear here.' : ''
                  }
                />
              ) : tab === 1 && userLikedPosts?.length < 1 ? (
                <NoResult
                  title='No liked videos yet!'
                  desc={
                    isCurrentUserProfile
                      ? 'Videos you liked will appear here'
                      : ''
                  }
                />
              ) : (
                // videos
                <div className='mt-4 grid place-items-center gap-x-3 gap-y-5 pb-4 xs:grid-cols-auto-fill-180 xs:place-items-stretch'>
                  {tab === 0 ? (
                    <>
                      {userCreatedPosts?.map((post) => (
                        <VideoItem
                          key={post._id}
                          videoURL={post.video.asset.url}
                          likes={post.likes?.length || 0}
                          caption={post.caption}
                          videoId={post._id}
                        />
                      ))}
                    </>
                  ) : (
                    <>
                      {userLikedPosts?.map((post) => (
                        <VideoItem
                          key={post._id}
                          videoURL={post.video.asset.url}
                          likes={post.likes?.length || 0}
                          caption={post.caption}
                          videoId={post._id}
                        />
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps({
  params: { id: userId },
}: {
  params: { id: string };
}) {
  const { data } = await axios.get(`${ROOT_URL}/api/user/${userId}`);

  return { props: { data } };
}
