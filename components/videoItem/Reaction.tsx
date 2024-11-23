import Image from 'next/image';
import Link from 'next/link';
import { IoIosCopy, IoMdCheckmark, IoMdShareAlt } from 'react-icons/io';
import { nativeShareVia, shareVia } from '../../utils/shareVia';
import { socialIcons } from '../../utils/constants';
import useCopy from '../../hooks/useCopy';
import { BsHeartFill } from 'react-icons/bs';
import { RiMessage2Fill } from 'react-icons/ri';
import useCheckTouchDevice from '../../hooks/useCheckTouchDevice';
import { Video } from '../../types';
import { ROOT_URL } from '../../utils';
import millify from 'millify';
import { AiOutlinePlus } from 'react-icons/ai';
import { PiSpinnerGap } from 'react-icons/pi';

import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { MdDelete } from 'react-icons/md';
import { useSession } from 'next-auth/react';
import useStore from '../../store';
import useFollow from '../../hooks/useFollow';

interface Props {
  totalLikes: number;
  video: Video;
  likeUnlikeHandler: () => Promise<void>;
  isAlreadyLike: boolean;
  liking: boolean;
  setShowLoginModal: Dispatch<SetStateAction<boolean>>;
  setShowDeleteModal: Dispatch<SetStateAction<boolean>>;
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

export default function Reaction({
  totalLikes,
  video,
  likeUnlikeHandler,
  isAlreadyLike,
  liking,
  setShowLoginModal,
  setShowDeleteModal,
}: Props) {
  const { postedBy } = video;

  const [isCreator, setIsCreator] = useState(false);
  const [alreadyFollow, setAlreadyFollow] = useState(!!postedBy.isFollowed);

  const { isCopied, copyToClipboard } = useCopy();
  const { isTouchDevice } = useCheckTouchDevice();
  const { handleFollow, handleUnFollow } = useFollow();

  const {
    followLoadingIds,
    currentFollowedUserIds,
    currentUnFollowedUserIds,
    setFollowLoadingId,
    removeFollowLoadingId,
    setCurrentFollowedUserIds,
    removeCurrentFollowedUserIds,
    setCurrentUnFollowedUserIds,
    removeCurrentUnFollowedUserIds,
  } = useStore();

  const { data: user }: any = useSession();

  const followLoading = followLoadingIds.includes(postedBy._id);

  useEffect(() => {
    setIsCreator(postedBy._id === user?._id);
  }, [user, postedBy._id]);

  const POST_URL = `${ROOT_URL}/video/${video._id}`;

  async function followHandler(e: MouseEvent) {
    e.stopPropagation();
    if (!user) return setShowLoginModal(true);

    const obj = { userId: user._id, creatorId: postedBy?._id };

    setFollowLoadingId(obj.creatorId);

    if (alreadyFollow) {
      await handleUnFollow(obj);

      removeFollowLoadingId(obj.creatorId);
      setCurrentUnFollowedUserIds(obj.creatorId);
      removeCurrentFollowedUserIds(obj.creatorId);
    } else {
      await handleFollow(obj);

      removeFollowLoadingId(obj.creatorId);
      setCurrentFollowedUserIds(obj.creatorId);
      removeCurrentUnFollowedUserIds(obj.creatorId);
    }
  }

  // check already follow or not
  useEffect(() => {
    const isCurrentlyFollow = currentFollowedUserIds.includes(postedBy._id);
    const isCurrentlyUnFollow = currentUnFollowedUserIds.includes(postedBy._id);

    if (postedBy.isFollowed && !isCurrentlyUnFollow) {
      setAlreadyFollow(true);
    } else if (!postedBy.isFollowed && isCurrentlyFollow) {
      setAlreadyFollow(true);
    } else {
      setAlreadyFollow(false);
    }
  }, [
    currentFollowedUserIds,
    currentUnFollowedUserIds,
    postedBy._id,
    postedBy.isFollowed,
  ]);

  return (
    <div className='hidden sm:flex w-12 h-full flex-col items-center justify-end space-y-3 ml-4 select-none'>
      {/* follow or delete */}
      {isCreator ? (
        <div className='flex flex-col items-center'>
          <button
            onClick={() => setShowDeleteModal(true)}
            className={`reaction-btn mb-1`}
          >
            <MdDelete size={25} color='red' />
          </button>
        </div>
      ) : (
        <div className='relative mb-4'>
          <Link
            href={`/profile/${postedBy._id}`}
            className='flex flex-col items-center w-14 h-14 rounded-full overflow-hidden'
          >
            <Image
              src={postedBy.image}
              alt='user avatar'
              className='w-full h-full object-cover bg-gray-200 dark:bg-[#7e7b7b5e]'
              width={60}
              height={60}
            />
          </Link>

          {alreadyFollow ? (
            <button
              onClick={followHandler}
              disabled={followLoading}
              className='border-none outline-none w-6 h-6 rounded-full flex justify-center items-center bg-gray-100 absolute left-1/2 -translate-x-1/2 -bottom-3'
            >
              {followLoading ? (
                <PiSpinnerGap className='animate-spin' />
              ) : (
                <IoMdCheckmark className='text-primary font-bold' />
              )}
            </button>
          ) : (
            <button
              onClick={followHandler}
              disabled={followLoading}
              className='border-none outline-none w-6 h-6 rounded-full flex justify-center items-center bg-primary absolute left-1/2 -translate-x-1/2 -bottom-3'
            >
              {followLoading ? (
                <PiSpinnerGap className='text-white animate-spin' />
              ) : (
                <AiOutlinePlus className='text-white' />
              )}
            </button>
          )}
        </div>
      )}

      {/* like */}
      <div className='flex flex-col items-center'>
        <button
          onClick={likeUnlikeHandler}
          disabled={liking}
          className={`reaction-btn ${
            isAlreadyLike ? 'text-primary dark:text-primary' : ''
          }`}
        >
          <BsHeartFill size={22} />
        </button>
        <p className='text-sm mt-1'>{millify(totalLikes || 0)}</p>
      </div>

      {/* comment */}
      <Link
        // onClick={handleViewVideoDetail}
        href={`/video/${video._id}`}
        aria-label='video'
        className='flex flex-col items-center'
      >
        <button className='reaction-btn'>
          <RiMessage2Fill size={22} />
        </button>
        <p className='text-sm mt-1'>{millify(video.comments?.length || 0)}</p>
      </Link>

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
            <IoMdShareAlt size={22} />
          </button>

          <div className='w-[240px] absolute bottom-16 -left-3 hidden group-hover:block'>
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
                  <IoIosCopy size={25} />
                </div>
                <p className='text-sm font-semibold text-gray-800 dark:text-gray-200'>
                  {isCopied ? 'Copied' : 'Copy link'}
                </p>
              </div>
            </div>

            <div className='mt-3' />
          </div>

          <p className='text-xs mt-1 text-center text-gray-600 dark:text-gray-200'>
            Share
          </p>
        </div>
      )}
    </div>
  );
}
