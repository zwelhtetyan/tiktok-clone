import useCheckTouchDevice from '../hooks/useCheckTouchDevice';
import UserProfile from './UserProfile';
import { AiTwotoneDelete } from 'react-icons/ai';

interface Props {
  _key: string;
  src: string;
  userName: string;
  commentText: string;
  isCreator: boolean;
  showDeleteModal(): void;
  deletingComment: boolean;
  deletingCmtKey: string;
  isCommentCreator: boolean;
}

export default function CommentItem({
  _key,
  src,
  userName,
  commentText,
  isCreator,
  showDeleteModal,
  deletingComment,
  deletingCmtKey,
  isCommentCreator,
}: Props) {
  const { isTouchDevice } = useCheckTouchDevice();

  return (
    <div className='group flex items-start mb-4'>
      <UserProfile src={src} className='mr-2 xs:mr-3 xs:w-12 xs:h-12' />
      <div className='flex-1 flex items-start justify-between'>
        <div className='flex-1'>
          <h2 className='font-semibold leading-6'>
            {userName}
            {isCreator && (
              <span className='font-bold text-sm text-primary'>
                <span className='ml-[4px] text-gray-800 dark:text-gray-200 text-sm'>
                  •
                </span>{' '}
                Creator
              </span>
            )}
          </h2>
          <p className='text-sm leading-5 text-gray-600 dark:text-gray-200'>
            {commentText}
          </p>
        </div>

        <div className='w-9'>
          {deletingComment && _key === deletingCmtKey ? (
            <div className='w-9 h-9 rounded-full flex items-center justify-center'>
              <div className='spinner' />
            </div>
          ) : isCommentCreator ? (
            <div
              onClick={showDeleteModal}
              className={`${
                isTouchDevice ? 'flex' : 'hidden'
              } reaction-btn text-red-600 cursor-pointer group-hover:flex`}
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
