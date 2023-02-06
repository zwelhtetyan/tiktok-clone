import { RiMessage2Fill } from 'react-icons/ri';
import UserProfile from '../UserProfile';
import { BsHeartFill } from 'react-icons/bs';
import { Video } from '../../types';
import { formatDate } from '../../utils/formatDate';
import { isTouchDevice } from '../../utils/isTouchDevice';
import { nativeShareVia, shareVia } from '../../utils/shareVia';
import { IoMdShareAlt } from 'react-icons/io';
import { socialIcons } from '../../utils/constants';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface Props {
  post: Video;
  handleLike(): Promise<void>;
  liking: boolean;
  POST_URL: string;
}

export default function Header({ post, handleLike, liking, POST_URL }: Props) {
  const [isCopied, setIsCopied] = useState(false);

  const { data: user }: any = useSession();

  const isAlreadyLike = post.likes?.find((u) => u._ref === user?._id);

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

        {isTouchDevice() ? (
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
}
