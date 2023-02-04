import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { socialIcons } from '../utils/constants';
import { RiMessage2Fill } from 'react-icons/ri';
import { BsHeartFill } from 'react-icons/bs';
import { formatDate } from '../utils/formatDate';
import { Video } from '../types';
import { useRouter } from 'next/router';
import { ROOT_URL } from '../utils';
import NotLogin from './NotLogin';
import { useSession } from 'next-auth/react';
import axios from 'axios';

interface DetailProps {
  videoDetail: Video;
}

export default function CommentSection({ videoDetail }: DetailProps) {
  const [post, setPost] = useState(videoDetail);

  const router = useRouter();
  const { data: user }: any = useSession();
  const [isCopied, setIsCopied] = useState(false);

  const isAlreadyLike = post?.likes?.find((u) => u._ref === user?._id);

  function copyToClipboard() {
    navigator.clipboard.writeText(ROOT_URL + router.asPath);
    setIsCopied(true);
  }

  async function handleLike() {
    const obj = {
      userId: user._id,
      postId: post._id,
      like: isAlreadyLike ? false : true,
    };

    const { data: updatedPost } = await axios.put(
      `${ROOT_URL}/api/post/like`,
      obj
    );

    setPost((post) => ({ ...post, likes: updatedPost.likes }));
  }

  useEffect(() => {
    const INTERVAL = setTimeout(() => setIsCopied(false), 3000);

    return () => clearInterval(INTERVAL);
  }, [isCopied]);

  return (
    <div className='flex flex-col w-[500px] h-screen border-l dark:border-l-darkBorder'>
      <header className='p-6 border-b dark:border-b-darkBorder'>
        <div className='w-full flex items-center justify-between mb-2'>
          <div className='flex items-center'>
            <Image
              src={post.postedBy.image}
              width={100}
              height={100}
              alt='profile_img'
              className='w-12 h-12 xs:w-14 xs:h-14 rounded-full mr-2 xs:mr-3 p-[4px] duration-200 hover:bg-gray-200 dark:hover:bg-darkSecondary cursor-pointer'
            />

            <div>
              <h2 className='text-lg font-bold leading-6'>
                {post.postedBy.userName}
              </h2>
              <p className='text-gray-500 text-sm'>
                {formatDate(post._createdAt!)}
              </p>
            </div>
          </div>
        </div>

        <p>{post.caption}</p>

        <div className='mt-6 flex items-center justify-between'>
          <div className='flex items-center'>
            <div className='flex items-center mr-6 text-sm'>
              {user ? (
                <button
                  onClick={handleLike}
                  className={`reaction-btn ${
                    isAlreadyLike ? 'text-primary' : ''
                  }`}
                >
                  <BsHeartFill size={18} />
                </button>
              ) : (
                <NotLogin />
              )}
              {post.likes?.length}
            </div>
            <div className='flex items-center text-sm'>
              <button className='reaction-btn'>
                <RiMessage2Fill size={18} />
              </button>
              5
            </div>
          </div>

          <div className='flex items-center gap-2'>
            {socialIcons.map((item, idx) => (
              <Image
                key={idx}
                src={item.icon}
                alt='social_icon'
                width={30}
                height={30}
                className='w-7 h-7 cursor-pointer'
              />
            ))}
          </div>
        </div>

        <div className='mt-6 w-full flex items-center h-9'>
          <div className='h-full pl-2 pr-1 flex-1 bg-gray-100 dark:bg-darkSecondary text-sm rounded-l-md flex items-center overflow-hidden'>
            <p className='truncate'>{ROOT_URL + router.asPath}</p>
          </div>

          <button
            onClick={copyToClipboard}
            className='h-full w-24 text-sm rounded-r-md bg-gray-200 dark:bg-darkBtn hover:bg-gray-300 dark:hover:bg-darkBtnHover'
          >
            {isCopied ? 'Copied' : 'Copy link'}
          </button>
        </div>
      </header>

      <div className='flex-1 p-6'>hi</div>

      <div className='flex items-center w-full px-6 py-4 border-t dark:border-t-darkBorder'>
        <input
          placeholder='Add comment...'
          type='text'
          className='flex-1 bg-gray-200 dark:bg-darkSecondary border-none outline-none p-2 pl-4 rounded-lg caret-primary'
        />

        <button
          className='py-2 px-3 disabled:text-gray-600 text-primary font-semibold disabled:cursor-not-allowed'
          disabled
        >
          Post
        </button>
      </div>
    </div>
  );
}
