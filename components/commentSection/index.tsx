import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Video } from '../../types';
import { useRouter } from 'next/router';
import { ROOT_URL } from '../../utils';
import NotLogin from '../NotLogin';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import CommentItem from '../CommentItem';
import Header from './Header';

interface DetailProps {
  videoDetail: Video;
}

export default function CommentSection({ videoDetail }: DetailProps) {
  const [post, setPost] = useState(videoDetail);
  const [commentVal, setCommentVal] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [isDeletingCmt, setIsDeletingCmt] = useState(false);
  const [deletingCmtKey, setDeletingCmtKey] = useState('');

  const showNewCmt = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { data: user }: any = useSession();
  const POST_URL = ROOT_URL + router.asPath;

  function isCreator(userId: string) {
    return post.postedBy._id === userId;
  }

  async function handleAddComment(e: FormEvent) {
    e.preventDefault();
    setIsCommenting(true);

    const obj = {
      userId: user._id,
      postId: post._id,
      comment: commentVal.trim(),
    };

    setCommentVal('');

    const { data: updatedPost }: { data: Video } = await axios.put(
      `${ROOT_URL}/api/post/comment`,
      obj
    );

    setIsCommenting(false);

    setPost((post) => ({
      ...post,
      comments: post.comments
        ? [
            ...post.comments,
            updatedPost.comments[updatedPost.comments.length - 1],
          ]
        : [updatedPost.comments[updatedPost.comments.length - 1]],
    }));
  }

  async function handleDeleteComment(commentKey: string) {
    setIsDeletingCmt(true);
    setDeletingCmtKey(commentKey);

    await axios.delete(
      `${ROOT_URL}/api/post/comment/${[post._id, commentKey]}`
    );

    setIsDeletingCmt(false);
    setPost((post) => ({
      ...post,
      comments: post.comments.filter((cmt) => cmt._key !== commentKey),
    }));
  }

  function handleClickCommentBox() {
    if (!user) {
      setShowLogin(true);
      commentInputRef.current?.blur();
    }
  }

  // scroll bottom to show last comment
  useEffect(() => {
    showNewCmt.current?.scrollIntoView();
  }, [post]);

  return (
    <div className='flex flex-col w-full max-w-3xl mx-auto lg:w-[500px] h-auto lg:h-screen border-t lg:border-l dark:border-t-darkBorder lg:dark:border-l-darkBorder'>
      {showLogin && <NotLogin bool setShowLogin={setShowLogin} />}

      <Header
        post={post}
        setShowLogin={setShowLogin}
        setPost={setPost}
        POST_URL={POST_URL}
      />

      {/* comments */}
      <div className='flex-1 max-h-[400px] lg:max-h-[unset] p-4 lg:p-6 overflow-hidden overflow-y-auto'>
        {post.comments?.length > 0 ? (
          post.comments?.map((cmt) => (
            <CommentItem
              key={cmt._key}
              _key={cmt._key}
              deletingCmtKey={deletingCmtKey}
              src={cmt.postedBy?.image || user?.image}
              userName={cmt.postedBy?.userName || user?.userName}
              commentText={cmt.comment}
              isCreator={isCreator(cmt.postedBy._id || user?._id)}
              handleDeleteComment={() => handleDeleteComment(cmt._key)}
              isDeletingCmt={isDeletingCmt}
              isCommentCreator={(cmt.postedBy._id || user?._id) === user?._id}
            />
          ))
        ) : (
          <div className='min-h-[200px] lg:min-h-0 h-full flex items-center tracking-wide justify-center text-gray-400 dark:text-gray-500'>
            Be the first to comment!
          </div>
        )}

        <div ref={showNewCmt} className='w-0 h-0 opacity-0 apple' />
      </div>

      {/* add comment */}
      <div className='w-full p-4 lg:px-6 py-4 border-t dark:border-t-darkBorder'>
        <form onSubmit={handleAddComment} className='w-full flex items-center'>
          <input
            ref={commentInputRef}
            onClick={handleClickCommentBox}
            onChange={({ target }) => setCommentVal(target.value)}
            value={commentVal}
            placeholder='Add comment...'
            disabled={isCommenting}
            type='text'
            className='flex-1 min-w-0 bg-gray-200 dark:bg-darkSecondary border-none outline-none p-2 pl-4 rounded-lg caret-primary'
          />

          <button
            className='py-2 pl-3 disabled:text-gray-400 dark:disabled:text-gray-600 text-primary font-semibold disabled:cursor-not-allowed'
            disabled={!commentVal.trim()}
          >
            {isCommenting ? <div className='spinner' /> : 'Post'}
          </button>
        </form>
      </div>
    </div>
  );
}
