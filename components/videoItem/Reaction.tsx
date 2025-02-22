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
import { useSetPrevScroll } from '../../hooks/usePrevScroll';

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
      className='flex cursor-pointer items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-darkBtnHover'
    >
      <Image
        src={src}
        alt='social_icon'
        width={30}
        height={30}
        className='mr-2 h-7 w-7 cursor-pointer'
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

  const { data: user }: any = useSession();
  const { isCopied, copyToClipboard } = useCopy();
  const { isTouchDevice } = useCheckTouchDevice();
  const { handleFollow, handleUnFollow } = useFollow();

  const {
    followLoadingIds,
    currentFollowedUserIds,
    currentUnFollowedUserIds,
    videoContainerRef,
    setFollowLoadingId,
    removeFollowLoadingId,
    setCurrentFollowedUserIds,
    removeCurrentFollowedUserIds,
    setCurrentUnFollowedUserIds,
    removeCurrentUnFollowedUserIds,
  } = useStore();
  const { keepScrollBeforeNavigate } = useSetPrevScroll(videoContainerRef!);

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
    <div className='absolute bottom-0 left-1/2 flex w-full max-w-80 -translate-x-1/2 select-none flex-wrap items-start justify-between gap-3 sm:static sm:ml-4 sm:h-full sm:w-12 sm:max-w-[unset] sm:transform-none sm:flex-col sm:flex-nowrap sm:justify-end'>
      {/* follow or delete */}
      {isCreator ? (
        <div className='flex flex-col items-center'>
          <button
            onClick={() => setShowDeleteModal(true)}
            className={`reaction-btn mb-2`}
          >
            <MdDelete size={25} color='red' />
          </button>
        </div>
      ) : (
        <div className='relative mb-4'>
          <Link
            onClick={keepScrollBeforeNavigate}
            href={`/profile/${postedBy._id}`}
            className='flex h-14 w-14 flex-col items-center overflow-hidden rounded-full'
          >
            <Image
              src={postedBy.image}
              alt='user avatar'
              className='h-full w-full bg-gray-200 object-cover dark:bg-[#7e7b7b5e]'
              width={60}
              height={60}
            />
          </Link>

          {alreadyFollow ? (
            <button
              onClick={followHandler}
              disabled={followLoading}
              className='absolute -bottom-3 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-none bg-gray-100 outline-none'
            >
              {followLoading ? (
                <PiSpinnerGap className='animate-spin' />
              ) : (
                <IoMdCheckmark className='font-bold text-primary' />
              )}
            </button>
          ) : (
            <button
              onClick={followHandler}
              disabled={followLoading}
              className='absolute -bottom-3 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-none bg-primary outline-none'
            >
              {followLoading ? (
                <PiSpinnerGap className='animate-spin text-white' />
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
        <p className='mt-1 text-sm'>{millify(totalLikes || 0)}</p>
      </div>

      {/* comment */}
      <Link
        onClick={keepScrollBeforeNavigate}
        href={`/video/${video._id}`}
        aria-label='video'
        className='flex flex-col items-center'
      >
        <button className='reaction-btn'>
          <RiMessage2Fill size={22} />
        </button>
        <p className='mt-1 text-sm'>{millify(video.comments?.length || 0)}</p>
      </Link>

      {/* share */}
      {isTouchDevice ? (
        <button
          className='reaction-btn'
          onClick={() => nativeShareVia(video.caption, POST_URL)}
        >
          <IoMdShareAlt size={28} />
        </button>
      ) : (
        <div className='group relative'>
          <button className='reaction-btn'>
            <IoMdShareAlt size={28} />
          </button>

          <div className='absolute bottom-16 right-0 hidden w-[240px] group-hover:block xl:-left-3'>
            <div className='rounded-md border border-gray-200 bg-slate-100 dark:border-darkBorder dark:bg-darkSecondary'>
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
                className='flex cursor-pointer items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-darkBtnHover'
              >
                <div className='mr-2 flex h-7 w-7 items-center justify-center'>
                  <IoIosCopy size={25} />
                </div>
                <p className='text-sm font-semibold text-gray-800 dark:text-gray-200'>
                  {isCopied ? 'Copied' : 'Copy link'}
                </p>
              </div>
            </div>

            <div className='mt-3' />
          </div>

          <p className='mt-1 text-center text-xs text-gray-600 dark:text-gray-200'>
            Share
          </p>
        </div>
      )}
    </div>
  );
}
