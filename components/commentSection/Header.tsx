import { RiMessage2Fill } from 'react-icons/ri';
import UserProfile from '../UserProfile';
import { BsHeartFill } from 'react-icons/bs';
import { Video } from '../../types';
import { formatDate } from '../../utils/formatDate';
import { nativeShareVia, shareVia } from '../../utils/shareVia';
import { IoMdShareAlt } from 'react-icons/io';
import { socialIcons } from '../../utils/constants';
import Link from 'next/link';
import Image from 'next/image';
import { memo, useState } from 'react';
import { useSession } from 'next-auth/react';
import useCheckTouchDevice from '../../hooks/useCheckTouchDevice';
import { useRouter } from 'next/router';
import useLike from '../../hooks/useLike';
import useFollow from '../../hooks/useFollow';
import ShowFollowOrDelete from '../ShowFollowOrDelete';
import useDeletePost from '../../hooks/useDeletePost';
import DeleteModal from '../modal/DeleteModal';
import useCopy from '../../hooks/useCopy';
import millify from 'millify';

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
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);

  //hooks
  const { data: user }: any = useSession();
  const router = useRouter();
  const { liking, handleLike } = useLike();
  const { loadingFollow, handleFollow } = useFollow();
  const { deletingPost, handleDeletePost } = useDeletePost();
  const { isCopied, copyToClipboard } = useCopy();
  const { isTouchDevice } = useCheckTouchDevice();

  const isAlreadyLike = post.likes?.find((u) => u._ref === user?._id);
  const isAlreadyFollow = post.postedBy.follower?.some(
    (u) => u._ref === user?._id
  );

  async function likeHandler() {
    if (!user) {
      setShowLogin(true);
      return;
    }

    const obj = {
      userId: user._id,
      postId: post._id,
      like: isAlreadyLike ? false : true,
    };

    const updatedPost = await handleLike(obj);

    setPost((post) => ({ ...post, likes: updatedPost.likes }));
  }

  async function deletePostHandler() {
    await handleDeletePost(post._id);

    router.push('/');
  }

  async function followHandler() {
    if (!user) {
      setShowLogin(true);
      return;
    }

    const obj = {
      userId: user._id,
      creatorId: post.postedBy._id,
      follow: isAlreadyFollow ? false : true,
    };

    const updatedUsers = await handleFollow(obj);

    const creator = updatedUsers.find((u) => u._id === post.postedBy._id)!;

    setPost((post) => ({
      ...post,
      postedBy: { ...post.postedBy, follower: creator.follower! },
    }));
  }

  return (
    <header className='p-4 lg:p-6 border-b dark:border-b-darkBorder'>
      {showDeletePostModal && (
        <DeleteModal
          onClose={() => setShowDeletePostModal(false)}
          deleteHandler={deletePostHandler}
          deleting={deletingPost}
          type='Post'
          text={post.caption}
        />
      )}

      <div className='w-full flex items-start justify-between mb-2'>
        <div className='flex items-start'>
          <Link href={`/profile/${post.postedBy._id}`}>
            <UserProfile
              src={post.postedBy.image}
              className='mr-2 xs:mr-3 xs:w-14 xs:h-14'
            />
          </Link>

          <div>
            <Link
              href={`/profile/${post.postedBy._id}`}
              className='text-lg font-bold leading-6 cursor-pointer hover:text-gray-800 dark:hover:text-gray-300'
            >
              {post.postedBy.userName}
            </Link>

            <p className='text-gray-500 dark:text-gray-400 text-sm'>
              {formatDate(post._createdAt!)}
            </p>
          </div>
        </div>

        {/* follow | unfollow */}
        <ShowFollowOrDelete
          followHandler={followHandler}
          showDeleteModal={() => setShowDeletePostModal(true)}
          isCreator={post.postedBy._id === user?._id}
          isAlreadyFollow={isAlreadyFollow}
          loadingFollow={loadingFollow}
        />
      </div>

      <p>{post.caption}</p>

      <div className='mt-6 flex items-center justify-between flex-wrap'>
        <div className='flex items-center'>
          {/* like */}
          <div className='flex items-center mr-4 md:mr-6 text-sm'>
            <button
              onClick={likeHandler}
              disabled={liking}
              className={`reaction-btn mr-1 md:mr-2 ${
                isAlreadyLike ? 'text-primary dark:text-primary' : ''
              }`}
            >
              <BsHeartFill size={18} />
            </button>

            {millify(post.likes?.length || 0)}
          </div>

          {/* comment */}
          <div className='flex items-center text-sm'>
            <button className='reaction-btn mr-1 md:mr-2'>
              <RiMessage2Fill size={18} />
            </button>
            {millify(post.comments?.length || 0)}
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
          onClick={() => copyToClipboard(POST_URL)}
          className='h-full w-20 text-sm rounded-r-md bg-gray-200 dark:bg-darkBtn hover:bg-gray-300 dark:hover:bg-darkBtnHover'
        >
          {isCopied ? 'Copied!' : 'Copy link'}
        </button>
      </div>
    </header>
  );
});
