import UserProfile from './UserProfile';

interface Props {
  src: string;
  userName: string;
  commentText: string;
  isCreator: boolean;
}

export default function CommentItem({
  src,
  userName,
  commentText,
  isCreator,
}: Props) {
  return (
    <div className='flex items-start mb-4'>
      <UserProfile src={src} className='mr-2 xs:mr-3 xs:w-[52px] xs:h-[52px]' />
      <div className='flex-1'>
        <h2 className='font-semibold leading-7'>
          {userName}
          {isCreator && (
            <span className='font-bold text-primary'>
              <span className='ml-[4px] text-white text-sm'>•</span> Creator
            </span>
          )}
        </h2>
        <p className='text-sm leading-5'>{commentText}</p>
      </div>
    </div>
  );
}
