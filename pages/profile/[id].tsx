import Head from 'next/head';
import Layout from '../../components/Layout';
import Image from 'next/image';
import { IoIosCopy } from 'react-icons/io';
import axios from 'axios';
import { ROOT_URL } from '../../utils';
import { User, Video } from '../../types';
import { generateFakeUsername } from '../../utils/generateFakeUsername';
import useCopy from '../../hooks/useCopy';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Link from 'next/link';
import { BsHeartFill } from 'react-icons/bs';
import { IoCheckmarkDoneSharp } from 'react-icons/io5';
import { useSession } from 'next-auth/react';
import useFollow from '../../hooks/useFollow';
import NotLoginModal from '../../components/modal/NotLoginModal';
import { useRouter } from 'next/router';

interface Props {
  data: {
    user: User;
    userCreatedPosts: Video[];
    userLikedPosts: Video[];
  };
}

interface TabItemProps {
  name: string;
  tabIdx: number;
  tab: number;
  setTab: Dispatch<SetStateAction<number>>;
}

interface VideoItemProps {
  videoURL: string;
  likes: number;
  caption: string;
  videoId: string;
}

function Status({ count, name }: { count: number; name: string }) {
  return (
    <p>
      <span className='text-black dark:text-white font-bold text-base mr-1'>
        {count}
      </span>
      {name}
    </p>
  );
}

function TabItem({ name, tabIdx, tab, setTab }: TabItemProps) {
  return (
    <button
      onClick={() => setTab(tabIdx)}
      className={`font-semibold cursor-pointer p-2 w-full max-w-[128px] text-center border-b-[3px] ${
        tab === tabIdx
          ? 'border-b-gray-600 dark:border-b-gray-300'
          : 'border-transparent'
      }`}
    >
      {name}
    </button>
  );
}

function VideoItem({ videoURL, likes, caption, videoId }: VideoItemProps) {
  return (
    <Link
      href={`/video/${videoId}`}
      className='flex flex-col items-center w-52 xs:w-auto'
    >
      <div className='overflow-hidden relative bg-black h-[290px] w-52 xs:w-auto xs:h-[250px] flex items-center justify-center rounded-md'>
        <video src={videoURL} className='object-cover' />

        <div className='text-white absolute bottom-0 left-0 text-sm backdrop-blur-sm w-full flex items-center p-2 py-3'>
          <BsHeartFill size={18} className='mr-1' /> {likes}
        </div>
      </div>
      <p className='mt-1 self-start text-sm line-clamp-1 text-gray-800 dark:text-gray-300'>
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
  const [showLogin, setShowLogin] = useState(false);

  //hooks
  const { data: currentUser }: any = useSession();
  const { isCopied, copyToClipboard } = useCopy();
  const { loadingFollow, handleFollow } = useFollow();
  const router = useRouter();

  const totalLikes = userCreatedPosts.reduce(
    (like: number, item: Video) => like + (item.likes?.length || 0),
    0
  );

  const following = user.following?.length;
  const followers = user.follower?.length;

  const profileURL = `${ROOT_URL}/profile/${user._id}`;

  const isAlreadyFollow = user.follower?.some(
    (u) => u._ref === currentUser?._id
  );

  async function followHandler() {
    if (!currentUser) {
      setShowLogin(true);
      return;
    }

    const obj = {
      userId: currentUser._id,
      creatorId: user._id,
      follow: isAlreadyFollow ? false : true,
    };

    const updatedUsers = await handleFollow(obj);

    const creator = updatedUsers.find((u) => u._id === user._id)!;

    setUser((prev) => ({ ...prev, follower: creator.follower }));
  }

  useEffect(() => {
    setTab(0);
    setUser(userInfo);
  }, [router.query.id, userInfo]);

  return (
    <Layout>
      <Head>
        <title>{user.userName} - TikTok</title>
      </Head>

      <div className='pl-2 lg:pl-4 h-[calc(100vh-97px)] overflow-y-auto'>
        {showLogin && <NotLoginModal onClose={() => setShowLogin(false)} />}
        <header className='w-full max-w-2xl'>
          <div className='flex items-start justify-between w-full'>
            <div className='flex items-center'>
              <Image
                src={user.image}
                alt='user_profile'
                width={200}
                height={200}
                className='w-16 h-16 xs:w-20 xs:h-20 sm:w-28 sm:h-28 rounded-full'
              />

              <div className='ml-2 xs:ml-4'>
                <h2 className='text-base xs:text-xl sm:text-2xl font-extrabold leading-4 xs:leading-5 sm:leading-6'>
                  {user.userName}
                </h2>
                <p className='text-sm xs:text-base sm:text-lg text-gray-600 dark:text-gray-200'>
                  @{generateFakeUsername(user.userName)}
                </p>

                {user._id === currentUser?._id ? (
                  <button className='btn-secondary text-sm xs:text-base font-semibold w-28 xs:w-40 mt-1 xs:mt-2 sm:mt-3'>
                    Edit profile
                  </button>
                ) : isAlreadyFollow ? (
                  <button
                    onClick={followHandler}
                    disabled={loadingFollow}
                    className='btn-secondary text-sm xs:text-base font-semibold w-28 xs:w-40 mt-1 xs:mt-2 sm:mt-3'
                  >
                    Following
                  </button>
                ) : (
                  <button
                    onClick={followHandler}
                    disabled={loadingFollow}
                    className='btn-primary text-sm xs:text-base font-semibold w-28 xs:w-40 mt-1 xs:mt-2 sm:mt-3'
                  >
                    Follow
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => copyToClipboard(profileURL)}
              title='Copy profile'
              className='reaction-btn w-10 h-10'
            >
              {isCopied ? (
                <IoCheckmarkDoneSharp size={18} />
              ) : (
                <IoIosCopy size={20} />
              )}
            </button>
          </div>

          {/* showcase */}
          <div className='text-sm mt-5 flex flex-wrap gap-4 xs:gap-x-6 text-gray-600 dark:text-gray-300'>
            <Status count={following || 0} name='Following' />
            <Status
              count={followers || 0}
              name={followers! > 1 ? 'Followers' : 'Follower'}
            />
            <Status
              count={totalLikes || 0}
              name={totalLikes > 1 ? 'Likes' : 'Like'}
            />
          </div>
        </header>

        <div className='mt-5'>
          {/* tab menu */}
          <div className='flex items-center'>
            <TabItem name='Videos' tabIdx={0} tab={tab} setTab={setTab} />
            <TabItem name='Liked' tabIdx={1} tab={tab} setTab={setTab} />
          </div>

          {/* videos */}
          <div className='mt-4 grid place-items-center xs:place-items-stretch xs:grid-cols-auto-fill-180 gap-x-3 gap-y-5 pb-4'>
            {tab === 0 ? (
              <>
                {userCreatedPosts.map((post) => (
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
                {userLikedPosts.map((post) => (
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
        </div>
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
