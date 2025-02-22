import { Video } from '../../types';
import { IoMdHeart, IoMdPause } from 'react-icons/io';
import { IoPlay } from 'react-icons/io5';
import { HiVolumeOff, HiVolumeUp } from 'react-icons/hi';
import { MouseEvent, ReactNode, useCallback, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import useDeletePost from '../../hooks/useDeletePost';
import NotLoginModal from '../modal/NotLoginModal';
import DeleteModal from '../modal/DeleteModal';
import { useRouter } from 'next/router';
import Reaction from './Reaction';
import useStore from '../../store';
import { InView } from 'react-intersection-observer';
import { TIntersectingVideo } from '../../pages';
import useLike from '../../hooks/useLike';
import { videoClicker } from '../../utils/videoClick';
import { motion } from 'framer-motion';
import { handleClickPosition } from '../../utils/handleClickPosition';
import { VideoFooter } from './footer';

interface Props {
  post: Video;
  isMute: boolean;
  handleMute(e: MouseEvent): void;
  handleIntersectingChange: (video: TIntersectingVideo) => void;
}

export default function VideoItem({
  post,
  isMute,
  handleMute,
  handleIntersectingChange,
}: Props) {
  const {
    _id: videoId,
    caption,
    video,
    isLiked: isLikedByCurrentUser,
    totalLikes: currentTotalLike,
    postedBy,
    _createdAt: videoCreatedAt,
  } = post;

  const [showLogin, setShowLogin] = useState(false);
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const [totalLikes, setTotalLikes] = useState(currentTotalLike);
  const [alreadyLiked, setAlreadyLiked] = useState(!!isLikedByCurrentUser);
  const [showPlayBtn, setShowPlayBtn] = useState(false);
  const [showPauseBtn, setShowPauseBtn] = useState(false);

  // heart animation
  const [showHeart, setShowHeart] = useState(false);
  const [heartPosition, setHeartPosition] = useState({ x: 0, y: 0 });

  const videoRef = useRef<HTMLVideoElement>(null);

  //hooks
  const router = useRouter();
  const { data: user }: any = useSession();
  const { deletingPost, handleDeletePost } = useDeletePost();
  const { loading: liking, handleLike, handleUnlike } = useLike();
  const { currentVideo, setCurrentVideo } = useStore();

  const onIntersectingChange = (inView: boolean) => {
    handleIntersectingChange({ id: videoId, inView, videoRef });
  };

  async function deletePostHandler() {
    await handleDeletePost(videoId);

    setShowDeletePostModal(false);

    router.push('/');
  }

  const likeUnlikeHandler = useCallback(async () => {
    if (!user) return setShowLogin(true);

    const obj = { userId: user._id, postId: post._id };

    if (alreadyLiked) {
      try {
        setAlreadyLiked(false);
        setTotalLikes((prev) => prev - 1);
        await handleUnlike(obj);
      } catch (error) {
        setAlreadyLiked(true);
        setTotalLikes((prev) => prev + 1);
      }
    } else {
      try {
        setAlreadyLiked(true);
        setTotalLikes((prev) => prev + 1);
        await handleLike(obj);
      } catch (error) {
        setAlreadyLiked(false);
        setTotalLikes((prev) => prev - 1);
      }
    }
  }, [user, post._id, alreadyLiked, handleUnlike, handleLike]);

  const handlePlayPause = useCallback(() => {
    const video = currentVideo.videoRef?.current;
    if (!video) return;

    if (currentVideo.isPlaying) {
      video.pause();
      setCurrentVideo(videoRef, false);
      setShowPlayBtn(false);
      setShowPauseBtn(true);
    } else {
      video.play();
      setCurrentVideo(videoRef, true);
      setShowPauseBtn(false);
      setShowPlayBtn(true);
    }
  }, [currentVideo.isPlaying, currentVideo.videoRef, setCurrentVideo]);

  const handleVideoSingleClick = useCallback(() => {
    handlePlayPause();
  }, [handlePlayPause]);

  const handleVideoDoubleClick = useCallback(
    async (e: MouseEvent) => {
      if (!user) return setShowLogin(true);

      setHeartPosition(handleClickPosition(e));
      setShowHeart(true);

      if (!alreadyLiked) {
        setAlreadyLiked(true);
        setTotalLikes((prev) => prev + 1);

        try {
          await handleLike({ userId: user._id, postId: post._id });
        } catch (error) {
          setAlreadyLiked(false);
          setTotalLikes((prev) => prev - 1);
        }
      }
    },
    [alreadyLiked, handleLike, post._id, user],
  );

  const handleVideoClick = videoClicker(
    handleVideoSingleClick,
    handleVideoDoubleClick,
  );

  return (
    <>
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

      <InView
        as='article'
        threshold={0.5}
        onChange={onIntersectingChange}
        style={{
          height:
            'calc(100vh - 97px - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
          scrollSnapStop: 'always',
          scrollSnapAlign: 'start center',
        }}
        className='relative flex w-full flex-col items-center justify-center pb-[90px] sm:flex-row sm:pb-0'
      >
        <div
          aria-label='video'
          onClick={handleVideoClick}
          className='group relative flex max-h-[calc(100vh-97px)] cursor-pointer items-center overflow-hidden rounded-2xl sm:h-full'
        >
          {showHeart && (
            <motion.div
              className='pointer-events-none absolute text-5xl text-primary'
              style={{ left: heartPosition.x, top: heartPosition.y }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                opacity: [0.7, 1, 0],
                scale: [1, 1.5, 1],
                rotate: [0, -20, 20, 0],
              }}
              transition={{ duration: 0.7 }}
              onAnimationComplete={() => setShowHeart(false)}
            >
              <IoMdHeart />
            </motion.div>
          )}

          <video
            ref={videoRef}
            src={video.asset.url}
            loop
            muted
            playsInline
            className='video h-full w-full cursor-pointer object-cover object-center'
          />

          {showPlayBtn && (
            <PlayPauseAniWrapper onComplete={() => setShowPlayBtn(false)}>
              <IoPlay className='h-full w-full' />
            </PlayPauseAniWrapper>
          )}

          {showPauseBtn && (
            <PlayPauseAniWrapper onComplete={() => setShowPauseBtn(false)}>
              <IoMdPause className='h-full w-full' />
            </PlayPauseAniWrapper>
          )}

          <div className='action-btn-container absolute right-0 top-0 flex items-center justify-between p-4 text-white group-hover:flex'>
            <>
              {isMute ? (
                <HiVolumeOff size={27} onClick={handleMute} />
              ) : (
                <HiVolumeUp size={27} onClick={handleMute} />
              )}
            </>
          </div>

          <VideoFooter
            creator={postedBy}
            caption={caption}
            createdAt={videoCreatedAt!}
          />
        </div>

        <Reaction
          totalLikes={totalLikes}
          likeUnlikeHandler={likeUnlikeHandler}
          isAlreadyLike={alreadyLiked}
          video={post}
          liking={liking}
          setShowLoginModal={setShowLogin}
          setShowDeleteModal={setShowDeletePostModal}
        />
      </InView>
    </>
  );
}

type PlayPauseAniWrapperProps = {
  children: ReactNode;
  onComplete?: VoidFunction;
};
function PlayPauseAniWrapper({
  onComplete,
  children,
}: PlayPauseAniWrapperProps) {
  return (
    <motion.div
      className='absolute left-1/2 top-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-[#00000045] p-1 text-white'
      initial={{
        scale: 0,
        opacity: 0,
        transform: 'translate(-50%, -50%)',
      }}
      animate={{
        opacity: [0, 1, 0],
        scale: [1, 1.7, 0],
      }}
      onAnimationComplete={onComplete}
    >
      {children}
    </motion.div>
  );
}
