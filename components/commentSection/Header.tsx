import { RiMessage2Fill } from 'react-icons/ri';
import UserProfile from '../UserProfile';
import { BsHeartFill } from 'react-icons/bs';
import { User, Video } from '../../types';
import { formatDate } from '../../utils/formatDate';
import { nativeShareVia, shareVia } from '../../utils/shareVia';
import { IoMdShareAlt } from 'react-icons/io';
import { socialIcons } from '../../utils/constants';
import Link from 'next/link';
import Image from 'next/image';
import { memo, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { AiTwotoneDelete } from 'react-icons/ai';
import useCheckTouchDevice from '../../hooks/useCheckTouchDevice';
import { ROOT_URL } from '../../utils';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Props {
  post: Video;
  POST_URL: string;
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setPost: React.Dispatch<React.SetStateAction<Video>>;
}

export default memo(function Header({
  post,
  POST_URL,
  setShowLogin,
  setPost,
}: Props) {
  const [isCopied, setIsCopied] = useState(false);
  const [liking, setLiking] = useState(false);
  const [deletingPost, setDeletingPost] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

  const router = useRouter();

  const { data: user }: any = useSession();
  const { isTouchDevice } = useCheckTouchDevice();

  const isAlreadyLike = post.likes?.find((u) => u._ref === user?._id);
  const isAlreadyFollow = post.postedBy.follower?.find(
    (u) => u._ref === user?._id
  );

  async function handleLike() {
    if (!user) {
      setShowLogin(true);
      return;
    }

    setLiking(true);

    const obj = {
      userId: user._id,
      postId: post._id,
      like: isAlreadyLike ? false : true,
    };

    const { data: updatedPost }: { data: Video } = await axios.put(
      `${ROOT_URL}/api/post/like`,
      obj
    );

    setLiking(false);
    setPost((post) => ({ ...post, likes: updatedPost.likes }));
  }

  async function handleDeletePost() {
    setDeletingPost(true);

    await axios.delete(`${ROOT_URL}/api/post/${post._id}`);

    setDeletingPost(false);

    router.push('/');
  }

  async function handleFollow() {
    if (!user) {
      setShowLogin(true);
      return;
    }

    setLoadingFollow(true);

    const obj = {
      userId: user._id,
      creatorId: post.postedBy._id,
      follow: isAlreadyFollow ? false : true,
    };

    const { data: updatedUsers }: { data: User[] } = await axios.put(
      `${ROOT_URL}/api/user`,
      obj
    );

    const creator = updatedUsers.find((u) => u._id === post.postedBy._id)!;

    setLoadingFollow(false);

    setPost((post) => ({
      ...post,
      postedBy: { ...post.postedBy, follower: creator.follower! },
    }));
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(POST_URL);
    setIsCopied(true);
  }

  useEffect(() => {
    const INTERVAL = setTimeout(() => setIsCopied(false), 1000);

    return () => clearInterval(INTERVAL);
  }, [isCopied]);

  return (
    <header className='p-4 lg:p-6 border-b dark:border-b-darkBorder'>
      <div className='w-full flex items-center justify-between mb-2'>
        <div className='flex items-center'>
          <UserProfile
            src={post.postedBy.image}
            className='mr-2 xs:mr-3 xs:w-14 xs:h-14'
          />

          <div>
            <h2 className='text-lg font-bold leading-6'>
              {post.postedBy.userName}
            </h2>
            <p className='text-gray-400 text-sm'>
              {formatDate(post._createdAt!)}
            </p>
          </div>
        </div>

        {/* follow | unfollow */}
        {post.postedBy._id === user?._id ? (
          deletingPost ? (
            <div className='w-9 h-9 rounded-full flex items-center justify-center'>
              <div className='spinner' />
            </div>
          ) : (
            <div
              onClick={handleDeletePost}
              className='reaction-btn text-red-600 cursor-pointer'
            >
              <AiTwotoneDelete size={20} />
            </div>
          )
        ) : isAlreadyFollow ? (
          <button
            onClick={handleFollow}
            disabled={loadingFollow}
            className='btn-secondary text-sm px-2'
          >
            Following
          </button>
        ) : (
          <button
            disabled={loadingFollow}
            onClick={handleFollow}
            className='btn-primary text-sm px-2'
          >
            Follow
          </button>
        )}
      </div>

      <p>{post.caption}</p>

      <div className='mt-6 flex items-center justify-between flex-wrap'>
        <div className='flex items-center'>
          <div className='flex items-center mr-4 md:mr-6 text-sm'>
            <button
              onClick={handleLike}
              disabled={liking}
              className={`reaction-btn mr-1 md:mr-2 ${
                isAlreadyLike ? 'text-primary' : ''
              }`}
            >
              <BsHeartFill size={18} />
            </button>

            {post.likes?.length || 0}
          </div>
          <div className='flex items-center text-sm'>
            <button className='reaction-btn mr-1 md:mr-2'>
              <RiMessage2Fill size={18} />
            </button>
            {post.comments?.length || 0}
          </div>
        </div>

        {isTouchDevice ? (
          <button
            className='reaction-btn'
            onClick={() => nativeShareVia(post.caption, POST_URL)}
          >
            <IoMdShareAlt size={22} />
          </button>
        ) : (
          <div className='flex items-center gap-2'>
            {socialIcons.map((item, idx) => (
              <Link
                target='_blank'
                href={shareVia(item.name, POST_URL, post.caption)!}
                key={idx}
              >
                <Image
                  src={item.icon}
                  alt='social_icon'
                  width={30}
                  height={30}
                  className='w-7 h-7 cursor-pointer'
                />
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className='mt-6 w-full flex items-center h-9'>
        <div className='h-full pl-2 pr-1 flex-1 bg-gray-100 dark:bg-darkSecondary text-sm rounded-l-md flex items-center overflow-hidden'>
          <p className='truncate'>{POST_URL}</p>
        </div>

        <button
          onClick={copyToClipboard}
          className='h-full w-20 text-sm rounded-r-md bg-gray-200 dark:bg-darkBtn hover:bg-gray-300 dark:hover:bg-darkBtnHover'
        >
          {isCopied ? 'Copied' : 'Copy link'}
        </button>
      </div>
    </header>
  );
});
