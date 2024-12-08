import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Video } from '../../types';
import { useRouter } from 'next/router';
import { ROOT_URL } from '../../utils';
import { useSession } from 'next-auth/react';
import CommentItem from '../CommentItem';
import Header from './Header';
import useAddComment from '../../hooks/useAddComment';
import NotLoginModal from '../modal/NotLoginModal';
import DeleteModal from '../modal/DeleteModal';
import useDeleteComment from '../../hooks/useDeleteComment';

interface DetailProps {
  videoDetail: Video;
}

export default function CommentSection({ videoDetail }: DetailProps) {
  const [post, setPost] = useState(videoDetail);
  const [commentVal, setCommentVal] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [scrollDown, setScrollDown] = useState(false);
  const [showDeleteCmtModal, setShowDeleteCmtModal] = useState({
    show: false,
    commentText: '',
    commentKey: '',
  });

  const showNewCmt = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

  // hooks
  const router = useRouter();
  const { data: user }: any = useSession();
  const { isCommenting, handleAddComment } = useAddComment();
  const { deletingComment, handleDeleteComment } = useDeleteComment();

  const POST_URL = ROOT_URL + router.asPath;

  function isCreator(userId: string) {
    return post.postedBy._id === userId;
  }

  async function addCommentHandler(e: FormEvent) {
    e.preventDefault();

    const obj = {
      userId: user._id,
      postId: post._id,
      comment: commentVal.trim(),
    };

    setCommentVal('');

    const updatedPost = await handleAddComment(obj);

    setPost((post) => ({
      ...post,
      comments: post.comments
        ? [
            ...post.comments,
            updatedPost.comments[updatedPost.comments.length - 1],
          ]
        : [updatedPost.comments[updatedPost.comments.length - 1]],
    }));

    setScrollDown(true);
  }

  async function deleteCommentHandler(commentKey: string) {
    await handleDeleteComment(post._id, commentKey);

    setPost((post) => ({
      ...post,
      comments: post.comments.filter((cmt) => cmt._key !== commentKey),
    }));

    handleCloseDeleteCmtModal();
  }

  function handleShowDeleteCmtModal(commentText: string, commentKey: string) {
    setShowDeleteCmtModal({ show: true, commentText, commentKey });
  }

  function handleCloseDeleteCmtModal() {
    setShowDeleteCmtModal({ show: false, commentText: '', commentKey: '' });
  }

  function handleClickCommentBox() {
    if (!user) {
      setShowLogin(true);
      commentInputRef.current?.blur();
    }
  }

  // scroll bottom to show last comment
  useEffect(() => {
    if (scrollDown) {
      showNewCmt.current?.scrollIntoView();
      setScrollDown(false);
    }
  }, [scrollDown]);

  return (
    <div className='mx-auto flex h-auto w-full max-w-3xl flex-col border-t pt-2 dark:border-t-darkBorder lg:h-screen lg:w-[500px] lg:border-l lg:pt-0 lg:dark:border-l-darkBorder'>
      {showLogin && <NotLoginModal onClose={() => setShowLogin(false)} />}
      {showDeleteCmtModal.show && (
        <DeleteModal
          onClose={handleCloseDeleteCmtModal}
          deleteHandler={() =>
            deleteCommentHandler(showDeleteCmtModal.commentKey)
          }
          deleting={deletingComment}
          type='Comment'
          text={showDeleteCmtModal.commentText}
        />
      )}

      <Header
        post={post}
        setShowLogin={setShowLogin}
        setPost={setPost}
        POST_URL={POST_URL}
      />

      {/* comments */}
      <div className='max-h-[400px] flex-1 overflow-hidden overflow-y-auto p-4 lg:max-h-[unset] lg:p-6'>
        {post.comments?.length > 0 ? (
          post.comments?.map((cmt) => (
            <CommentItem
              key={cmt._key}
              userId={cmt.postedBy._id || user?._id}
              src={cmt.postedBy?.image || user?.image}
              userName={cmt.postedBy?.userName || user?.userName}
              commentText={cmt.comment}
              isCreator={isCreator(cmt.postedBy._id || user?._id)}
              showDeleteModal={() =>
                handleShowDeleteCmtModal(cmt.comment, cmt._key)
              }
              deletingComment={
                deletingComment && cmt._key === showDeleteCmtModal.commentKey
              }
              isCommentCreator={(cmt.postedBy._id || user?._id) === user?._id}
            />
          ))
        ) : (
          <div className='flex h-full min-h-[200px] items-center justify-center tracking-wide text-gray-500 dark:text-gray-400 lg:min-h-0'>
            Be the first to comment!
          </div>
        )}

        <div ref={showNewCmt} className='apple h-0 w-0 opacity-0' />
      </div>

      {/* add comment */}
      <div className='w-full border-t p-4 py-4 dark:border-t-darkBorder lg:px-6'>
        <form onSubmit={addCommentHandler} className='flex w-full items-center'>
          <input
            ref={commentInputRef}
            onClick={handleClickCommentBox}
            onChange={({ target }) => setCommentVal(target.value)}
            value={commentVal}
            placeholder='Add comment...'
            disabled={isCommenting}
            type='text'
            className='min-w-0 flex-1 rounded-lg border-none bg-gray-200 p-2 pl-4 caret-primary outline-none dark:bg-darkSecondary'
          />

          <button
            className='py-2 pl-3 font-semibold text-primary disabled:cursor-not-allowed disabled:text-gray-400 dark:disabled:text-gray-600'
            disabled={!commentVal.trim()}
          >
            {isCommenting ? <div className='spinner' /> : 'Post'}
          </button>
        </form>
      </div>
    </div>
  );
}
