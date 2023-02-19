import { User, Video } from '../../types';
import { IoMdPause } from 'react-icons/io';
import { IoPlay } from 'react-icons/io5';
import { HiVolumeOff, HiVolumeUp } from 'react-icons/hi';
import { Dispatch, MouseEvent, SetStateAction, useRef, useState } from 'react';
import { pauseAllVideo } from '../../utils/pauseAllVideo';
import { updateActionBtn } from '../../utils/updateActionBtn';
import Link from 'next/link';
import UserProfile from '../UserProfile';
import { generateFakeUsername } from '../../utils/generateFakeUsername';
import { useSession } from 'next-auth/react';
import ShowFollowOrDelete from '../ShowFollowOrDelete';
import { ObjProps } from '../../hooks/useFollow';
import useDeletePost from '../../hooks/useDeletePost';
import NotLoginModal from '../modal/NotLoginModal';
import DeleteModal from '../modal/DeleteModal';
import { useRouter } from 'next/router';
import Reaction from './Reaction';
import useStore from '../../store';

interface Props {
  post: Video;
  isMute: boolean;
  id: number;
  handleMute(e: MouseEvent): void;
  postedBy: User;
  setAllPostedBy: Dispatch<SetStateAction<any>>;
  loadingFollow: boolean;
  handleFollow: (obj: ObjProps) => Promise<User[]>;
  setCurrentUserId: Dispatch<SetStateAction<string>>;
}

export default function VideoItem({
  post,
  postedBy,
  setAllPostedBy,
  isMute,
  id,
  handleMute,
  loadingFollow,
  handleFollow,
  setCurrentUserId,
}: Props) {
  // destructure
  const { _id: videoId, caption, video, likes } = post;

  //states
  const [showLogin, setShowLogin] = useState(false);
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);

  // refs
  const videoRef = useRef<HTMLVideoElement>(null);

  //hooks
  const router = useRouter();
  const { data: user }: any = useSession();
  const { deletingPost, handleDeletePost } = useDeletePost();
  const { setViewedVideoDetail } = useStore();

  const isAlreadyFollow = postedBy?.follower?.some(
    (u) => u._ref === user?._id
  )!;

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

    setCurrentUserId(postedBy?._id);

    const obj = {
      userId: user._id,
      creatorId: postedBy?._id,
      follow: isAlreadyFollow ? false : true,
    };

    const updatedUsers = await handleFollow(obj);

    const creator = updatedUsers.find((u) => u._id === postedBy?._id)!;

    setAllPostedBy((prev: User[]) => [
      ...prev.map((u: User) =>
        u._id === postedBy?._id ? { ...u, follower: creator.follower } : u
      ),
    ]);
  }

  function handleViewVideoDetail() {
    const elem = document.querySelector('.video-container')!;
    setViewedVideoDetail(elem.scrollTop, videoRef.current!);
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
          <Link href={`/profile/${postedBy?._id}`}>
            <UserProfile
              src={postedBy?.image}
              className='xs:w-[52px] xs:h-[52px] mr-2 xs:mr-3'
            />
          </Link>

          <div className='flex-1'>
            <Link
              href={`/profile/${postedBy?._id}`}
              className='font-bold inline-block xs:text-lg cursor-pointer hover:text-gray-700 dark:hover:text-gray-300'
            >
              {postedBy?.userName}
            </Link>
            <p className='text-gray-500 dark:text-gray-400 text-sm leading-4'>
              {generateFakeUsername(postedBy?.userName)}
            </p>
            <p className='max-w-md text-gray-700 dark:text-gray-200 leading-[1.3rem] mt-1 hidden xs:block xs:line-clamp-2'>
              {caption}
            </p>
          </div>
        </div>

        {/* follow | unfollow */}
        <ShowFollowOrDelete
          showDeleteModal={() => setShowDeletePostModal(true)}
          isCreator={postedBy?._id === user?._id}
          isAlreadyFollow={isAlreadyFollow}
          followHandler={followHandler}
          loadingFollow={loadingFollow}
          userId={postedBy?._id}
        />
      </header>

      {/* caption */}
      <p className='max-w-md line-clamp-2 text-gray-700 dark:text-gray-200 leading-[1.2rem] mb-3 xs:hidden'>
        {caption}
      </p>

      {/* video */}
      <div className='flex w-full xs:ml-[60px] h-[470px] xs:h-[480px]'>
        <Link
          onClick={handleViewVideoDetail}
          href={`/video/${videoId}`}
          aria-label='video'
          className='group relative rounded-lg h-full w-full max-w-[270px] bg-black flex items-center overflow-hidden cursor-pointer'
        >
          <video
            ref={videoRef}
            src={video.asset.url}
            loop
            muted
            playsInline
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

        {/* like | share | comment */}
        <Reaction likes={likes} setShowLogin={setShowLogin} video={post} />
      </div>
    </div>
  );
}
