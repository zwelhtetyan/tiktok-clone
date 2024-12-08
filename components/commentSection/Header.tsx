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
  const { loading: liking, handleLike } = useLike();
  const { loading: loadingFollow, handleFollow } = useFollow();
  const { deletingPost, handleDeletePost } = useDeletePost();
  const { isCopied, copyToClipboard } = useCopy();
  const { isTouchDevice } = useCheckTouchDevice();

  const isAlreadyLike = post.likes?.find((u) => u._ref === user?._id);
  const isAlreadyFollow = post.postedBy.follower?.some(
    (u) => u._ref === user?._id,
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
    <header className='border-b p-4 dark:border-b-darkBorder lg:p-6'>
      {showDeletePostModal && (
        <DeleteModal
          onClose={() => setShowDeletePostModal(false)}
          deleteHandler={deletePostHandler}
          deleting={deletingPost}
          type='Post'
          text={post.caption}
        />
      )}

      <div className='mb-2 flex w-full items-start justify-between'>
        <div className='flex items-start'>
          <Link href={`/profile/${post.postedBy._id}`}>
            <UserProfile
              src={post.postedBy.image}
              className='mr-2 xs:mr-3 xs:h-14 xs:w-14'
            />
          </Link>

          <div>
            <Link
              href={`/profile/${post.postedBy._id}`}
              className='cursor-pointer text-lg font-bold leading-6 hover:text-gray-800 dark:hover:text-gray-300'
            >
              {post.postedBy.userName}
            </Link>

            <p className='text-sm text-gray-500 dark:text-gray-400'>
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

      <div className='mt-6 flex flex-wrap items-center justify-between'>
        <div className='flex items-center'>
          {/* like */}
          <div className='mr-4 flex items-center text-sm md:mr-6'>
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
                  className='h-7 w-7 cursor-pointer'
                />
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className='mt-6 flex h-9 w-full items-center'>
        <div className='flex h-full flex-1 items-center overflow-hidden rounded-l-md bg-gray-100 pl-2 pr-1 text-sm dark:bg-darkSecondary'>
          <p className='truncate'>{POST_URL}</p>
        </div>

        <button
          onClick={() => copyToClipboard(POST_URL)}
          className='h-full w-20 rounded-r-md bg-gray-200 text-sm hover:bg-gray-300 dark:bg-darkBtn dark:hover:bg-darkBtnHover'
        >
          {isCopied ? 'Copied!' : 'Copy link'}
        </button>
      </div>
    </header>
  );
});
