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
    <div className='group flex items-start mb-4'>
      <Link href={`/profile/${userId}`}>
        <UserProfile src={src} className='mr-2 xs:mr-3 xs:w-12 xs:h-12' />
      </Link>

      <div className='flex-1 flex items-start justify-between'>
        <div className='flex-1'>
          <Link
            href={`/profile/${userId}`}
            className='font-semibold leading-6 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300'
          >
            {userName}
            {isCreator && (
              <span className='font-bold text-sm text-primary cursor-default'>
                <span className='ml-[4px] text-gray-800 dark:text-gray-200 text-sm'>
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
            <div className='w-9 h-9 rounded-full flex items-center justify-center'>
              <div className='spinner' />
            </div>
          ) : isCommentCreator ? (
            <div
              onClick={showDeleteModal}
              className={`${
                isTouchDevice ? 'flex' : 'hidden'
              } reaction-btn text-red-600 dark:text-red-600 cursor-pointer group-hover:flex`}
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
