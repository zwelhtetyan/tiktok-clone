import Image from 'next/image';
import Link from 'next/link';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { IoIosCopy, IoMdShareAlt } from 'react-icons/io';
import { nativeShareVia, shareVia } from '../../utils/shareVia';
import { socialIcons } from '../../utils/constants';
import useLike from '../../hooks/useLike';
import useCopy from '../../hooks/useCopy';
import { BsHeartFill } from 'react-icons/bs';
import { RiMessage2Fill } from 'react-icons/ri';
import useCheckTouchDevice from '../../hooks/useCheckTouchDevice';
import { useSession } from 'next-auth/react';
import { Video } from '../../types';
import { useRouter } from 'next/router';
import { ROOT_URL } from '../../utils';
import millify from 'millify';

interface Props {
  likes: { _key?: string; _ref: string; _type?: string }[];
  setShowLogin: Dispatch<SetStateAction<boolean>>;
  video: Video;
}

interface ShareLinkProps {
  src: string;
  name: string;
  POST_URL: string;
  caption: string;
}

function ShareLink({ src, name, POST_URL, caption }: ShareLinkProps) {
  return (
    <Link
      target='_blank'
      href={shareVia(name, POST_URL, caption)!}
      className='flex items-center py-2 px-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-darkBtnHover'
    >
      <Image
        src={src}
        alt='social_icon'
        width={30}
        height={30}
        className='w-7 h-7 cursor-pointer mr-2'
      />
      <p className='text-sm font-semibold text-gray-800 dark:text-gray-200'>
        Share to {name}
      </p>
    </Link>
  );
}

export default function Reaction({ likes, setShowLogin, video }: Props) {
  const [totalLikes, setTotalLikes] = useState(likes);

  const { liking, handleLike } = useLike();
  const { isCopied, copyToClipboard } = useCopy();
  const { isTouchDevice } = useCheckTouchDevice();
  const { data: user }: any = useSession();
  const router = useRouter();

  const POST_URL = `${ROOT_URL}/video/${video._id}`;
  const isAlreadyLike = totalLikes?.find((u) => u._ref === user?._id);

  async function likeHandler() {
    if (!user) {
      setShowLogin(true);
      return;
    }

    const obj = {
      userId: user._id,
      postId: video._id,
      like: isAlreadyLike ? false : true,
    };

    const updatedPost = await handleLike(obj);

    setTotalLikes(updatedPost.likes);
  }

  return (
    <div className='hidden sm:flex w-12 h-full flex-col items-center justify-end space-y-3 ml-4'>
      {/* like */}
      <div className='flex flex-col items-center'>
        <button
          onClick={likeHandler}
          disabled={liking}
          className={`reaction-btn ${
            isAlreadyLike ? 'text-primary dark:text-primary' : ''
          }`}
        >
          <BsHeartFill size={18} />
        </button>
        <p className='text-sm mt-1'>{millify(totalLikes?.length || 0)}</p>
      </div>

      {/* comment */}
      <div className='flex flex-col items-center'>
        <button
          onClick={() => router.push(`/video/${video._id}`)}
          className='reaction-btn'
        >
          <RiMessage2Fill size={18} />
        </button>
        <p className='text-sm mt-1'>{millify(video.comments?.length || 0)}</p>
      </div>

      {/* share */}
      {isTouchDevice ? (
        <button
          className='reaction-btn'
          onClick={() => nativeShareVia(video.caption, POST_URL)}
        >
          <IoMdShareAlt size={22} />
        </button>
      ) : (
        <div className='relative group'>
          <button className='reaction-btn'>
            <IoMdShareAlt size={20} />
          </button>

          <div>
            <div className='w-[240px] absolute bottom-14 -left-3 hidden group-hover:block'>
              <div className='rounded-md bg-slate-100 dark:bg-darkSecondary border border-gray-200 dark:border-darkBorder'>
                {socialIcons.map((item) => (
                  <ShareLink
                    key={item.name}
                    src={item.icon}
                    name={item.name}
                    POST_URL={POST_URL}
                    caption={video.caption}
                  />
                ))}

                <div
                  onClick={() => copyToClipboard(POST_URL)}
                  className='flex items-center py-2 px-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-darkBtnHover'
                >
                  <div className='mr-2 w-7 h-7 flex items-center justify-center'>
                    <IoIosCopy size={20} />
                  </div>
                  <p className='text-sm font-semibold text-gray-800 dark:text-gray-200'>
                    {isCopied ? 'Copied' : 'Copy link'}
                  </p>
                </div>
              </div>

              <div className='mt-3' />
            </div>
            <p className='text-xs mt-1 text-gray-600 dark:text-gray-200'>
              Share
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
