import { User, Video } from '../types';
import { IoIosCopy, IoMdPause, IoMdShareAlt } from 'react-icons/io';
import { IoPlay } from 'react-icons/io5';
import { HiVolumeOff, HiVolumeUp } from 'react-icons/hi';
import { Dispatch, MouseEvent, SetStateAction, useRef, useState } from 'react';
import { pauseAllVideo } from '../utils/pauseAllVideo';
import { updateActionBtn } from '../utils/updateActionBtn';
import Link from 'next/link';
import UserProfile from './UserProfile';
import { generateFakeUsername } from '../utils/generateFakeUsername';
import { useSession } from 'next-auth/react';
import ShowFollowOrDelete from './ShowFollowOrDelete';
import { ObjProps } from '../hooks/useFollow';
import useDeletePost from '../hooks/useDeletePost';
import NotLoginModal from './modal/NotLoginModal';
import DeleteModal from './modal/DeleteModal';
import { useRouter } from 'next/router';
import { BsHeartFill } from 'react-icons/bs';
import { RiMessage2Fill } from 'react-icons/ri';
import useLike from '../hooks/useLike';
import Image from 'next/image';
import { socialIcons } from '../utils/constants';
import { nativeShareVia, shareVia } from '../utils/shareVia';
import { ROOT_URL } from '../utils';
import useCopy from '../hooks/useCopy';
import useCheckTouchDevice from '../hooks/useCheckTouchDevice';

interface Props {
  video: Video;
  isMute: boolean;
  id: number;
  handleMute(e: MouseEvent): void;
  postedBy: User;
  setAllPostedBy: Dispatch<SetStateAction<any>>;
  loadingFollow: boolean;
  handleFollow: (obj: ObjProps) => Promise<User[]>;
  setCurrentUserId: Dispatch<SetStateAction<string>>;
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

export default function VideoItem({
  video: { _id: videoId, caption, video, likes, comments },
  postedBy,
  setAllPostedBy,
  isMute,
  id,
  handleMute,
  loadingFollow,
  handleFollow,
  setCurrentUserId,
}: Props) {
  //states
  const [showLogin, setShowLogin] = useState(false);
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const [totalLikes, setTotalLikes] = useState(likes);

  // refs
  const videoRef = useRef<HTMLVideoElement>(null);

  //hooks
  const router = useRouter();
  const { data: user }: any = useSession();
  const { deletingPost, handleDeletePost } = useDeletePost();
  const { liking, handleLike } = useLike();
  const { isCopied, copyToClipboard } = useCopy();
  const { isTouchDevice } = useCheckTouchDevice();

  const isAlreadyFollow = postedBy.follower?.some((u) => u._ref === user?._id)!;
  const isAlreadyLike = totalLikes?.find((u) => u._ref === user?._id);
  const POST_URL = `${ROOT_URL}/detail/${videoId}`;

  const handlePlayPause = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const videoElem = videoRef.current!;

    if (!videoElem.paused) {
      videoElem.pause();
      updateActionBtn(id.toString(), true);
    } else {
      const videoElems = document.querySelectorAll('.video');
      pauseAllVideo(videoElems, false);
      videoElem.play();
      updateActionBtn(id.toString());
    }
  };

  async function deletePostHandler() {
    await handleDeletePost(videoId);

    setShowDeletePostModal(false);

    router.push('/');
  }

  async function followHandler() {
    if (!user) {
      setShowLogin(true);
      return;
    }

    setCurrentUserId(postedBy._id);

    const obj = {
      userId: user._id,
      creatorId: postedBy._id,
      follow: isAlreadyFollow ? false : true,
    };

    const updatedUsers = await handleFollow(obj);

    const creator = updatedUsers.find((u) => u._id === postedBy._id)!;

    setAllPostedBy((prev: User[]) => [
      ...prev.map((u: User) =>
        u._id === postedBy._id ? { ...u, follower: creator.follower } : u
      ),
    ]);
  }

  async function likeHandler() {
    if (!user) {
      setShowLogin(true);
      return;
    }

    const obj = {
      userId: user._id,
      postId: videoId,
      like: isAlreadyLike ? false : true,
    };

    const updatedPost = await handleLike(obj);

    setTotalLikes(updatedPost.likes);
  }

  return (
    <div className='pb-6 mb-6 border-b border-b-gray-100 dark:border-b-darkBorder dark:text-white'>
      {showLogin && <NotLoginModal onClose={() => setShowLogin(false)} />}
      {showDeletePostModal && (
        <DeleteModal
          onClose={() => setShowDeletePostModal(false)}
          deleteHandler={deletePostHandler}
          deleting={deletingPost}
          type='Post'
          text={caption}
        />
      )}

      <header className='w-full flex items-start mb-1 xs:mb-4'>
        <div className='flex-1 flex'>
          <Link href={`/profile/${postedBy._id}`}>
            <UserProfile
              src={postedBy.image}
              className='xs:w-[52px] xs:h-[52px] mr-2 xs:mr-3'
            />
          </Link>

          <div className='flex-1'>
            <Link
              href={`/profile/${postedBy._id}`}
              className='font-bold block xs:text-lg cursor-pointer hover:text-gray-800 dark:hover:text-gray-300'
            >
              {postedBy.userName}
            </Link>
            <p className='text-gray-500 dark:text-gray-400 text-sm leading-4 xs:leading-5'>
              {generateFakeUsername(postedBy.userName)}
            </p>
            <p className='max-w-md text-gray-600 dark:text-gray-200 leading-[1.3rem] mt-1 hidden xs:block'>
              {caption}
            </p>
          </div>
        </div>

        {/* follow | unfollow */}
        <ShowFollowOrDelete
          showDeleteModal={() => setShowDeletePostModal(true)}
          isCreator={postedBy._id === user?._id}
          isAlreadyFollow={isAlreadyFollow}
          followHandler={followHandler}
          loadingFollow={loadingFollow}
          userId={postedBy._id}
        />
      </header>

      {/* caption */}
      <p className='max-w-md text-gray-600 dark:text-gray-200 leading-[1.2rem] mb-3 xs:hidden'>
        {caption}
      </p>

      {/* video */}
      <div className='flex w-full xs:ml-[60px] h-[470px] xs:h-[480px]'>
        <Link
          href={`video/${videoId}`}
          className='group relative rounded-lg h-full w-full max-w-[270px] bg-black flex items-center overflow-hidden cursor-pointer'
        >
          <video
            ref={videoRef}
            src={video.asset.url}
            loop
            muted
            className='video w-full object-cover object-center'
            id={id.toString()}
          />

          {/* action buttons */}
          <div
            id={id.toString()}
            className='action-btn-container absolute flex md:hidden group-hover:flex justify-between items-center left-0 right-0 bottom-5 xs:bottom-7 px-4 text-white'
          >
            <>
              <IoMdPause
                size={25}
                onClick={handlePlayPause}
                className='pause-btn hidden'
              />

              <IoPlay
                size={25}
                onClick={handlePlayPause}
                className='play-btn'
              />
            </>

            <>
              {isMute ? (
                <HiVolumeOff size={25} onClick={handleMute} />
              ) : (
                <HiVolumeUp size={25} onClick={handleMute} />
              )}
            </>
          </div>
        </Link>

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
            <p className='text-sm mt-1'>{totalLikes?.length || 0}</p>
          </div>

          {/* comment */}
          <div className='flex flex-col items-center'>
            <button
              onClick={() => router.push(`detail/${videoId}`)}
              className='reaction-btn'
            >
              <RiMessage2Fill size={18} />
            </button>
            <p className='text-sm mt-1'>{comments?.length || 0}</p>
          </div>

          {/* share */}
          {isTouchDevice ? (
            <button
              className='reaction-btn'
              onClick={() => nativeShareVia(caption, POST_URL)}
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
                        caption={caption}
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
      </div>
    </div>
  );
}
