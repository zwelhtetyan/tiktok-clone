import Link from 'next/link';
import useCheckTouchDevice from '../hooks/useCheckTouchDevice';
import UserProfile from './UserProfile';
import { AiTwotoneDelete } from 'react-icons/ai';

interface Props {
  src: string;
  userName: string;
  userId: string;
  commentText: string;
  isCreator: boolean;
  showDeleteModal(): void;
  deletingComment: boolean;
  isCommentCreator: boolean;
}

export default function CommentItem({
  src,
  userName,
  userId,
  commentText,
  isCreator,
  showDeleteModal,
  deletingComment,
  isCommentCreator,
}: Props) {
  const { isTouchDevice } = useCheckTouchDevice();

  return (
    <div className='group mb-4 flex items-start'>
      <Link href={`/profile/${userId}`}>
        <UserProfile src={src} className='mr-2 xs:mr-3 xs:h-12 xs:w-12' />
      </Link>

      <div className='flex flex-1 items-start justify-between'>
        <div className='flex-1'>
          <Link
            href={`/profile/${userId}`}
            className='cursor-pointer font-semibold leading-6 hover:text-gray-700 dark:hover:text-gray-300'
          >
            {userName}
            {isCreator && (
              <span className='cursor-default text-sm font-bold text-primary'>
                <span className='ml-[4px] text-sm text-gray-800 dark:text-gray-200'>
                  •
                </span>{' '}
                Creator
              </span>
            )}
          </Link>

          <p className='text-sm leading-5 text-gray-700 dark:text-gray-200'>
            {commentText}
          </p>
        </div>

        <div className='w-9'>
          {deletingComment ? (
            <div className='flex h-9 w-9 items-center justify-center rounded-full'>
              <div className='spinner' />
            </div>
          ) : isCommentCreator ? (
            <div
              onClick={showDeleteModal}
              className={`${
                isTouchDevice ? 'flex' : 'hidden'
              } reaction-btn cursor-pointer text-red-600 group-hover:flex dark:text-red-600`}
            >
              <AiTwotoneDelete size={20} />
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
}
