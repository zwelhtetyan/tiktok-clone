import UserProfile from './UserProfile';
import { AiTwotoneDelete } from 'react-icons/ai';

interface Props {
  _key: string;
  src: string;
  userName: string;
  commentText: string;
  isCreator: boolean;
  handleDeleteComment(): void;
  isDeletingCmt: boolean;
  deletingCmtKey: string;
}

export default function CommentItem({
  _key,
  src,
  userName,
  commentText,
  isCreator,
  handleDeleteComment,
  isDeletingCmt,
  deletingCmtKey,
}: Props) {
  return (
    <div className='flex items-start mb-4'>
      <UserProfile src={src} className='mr-2 xs:mr-3 xs:w-[52px] xs:h-[52px]' />
      <div className='flex-1 flex items-start justify-between'>
        <div>
          <h2 className='font-semibold leading-6'>
            {userName}
            {isCreator && (
              <span className='font-bold text-primary'>
                <span className='ml-[4px] text-white text-sm'>•</span> Creator
              </span>
            )}
          </h2>
          <p className='text-sm leading-5'>{commentText}</p>
        </div>

        {isDeletingCmt && _key === deletingCmtKey ? (
          <div className='w-9 h-9 rounded-full flex items-center justify-center'>
            <div className='animate-spin h-6 w-6 rounded-full border-2 border-gray-500 border-l-primary border-b-primary' />
          </div>
        ) : (
          <div
            onClick={handleDeleteComment}
            className='reaction-btn text-red-600 cursor-pointer'
          >
            <AiTwotoneDelete size={20} />
          </div>
        )}
      </div>
    </div>
  );
}
