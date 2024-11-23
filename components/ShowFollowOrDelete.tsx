import { AiTwotoneDelete } from 'react-icons/ai';

interface Props {
  isCreator: boolean;
  isAlreadyFollow: boolean;
  followHandler(): Promise<void>;
  loadingFollow: boolean;
  showDeleteModal(): void;
  userId?: string;
}

export default function ShowFollowOrDelete({
  isCreator,
  isAlreadyFollow,
  followHandler,
  loadingFollow,
  showDeleteModal,
}: Props) {
  return (
    <>
      {isCreator ? (
        <div
          onClick={showDeleteModal}
          className='reaction-btn cursor-pointer text-red-600 dark:text-red-600'
        >
          <AiTwotoneDelete size={20} />
        </div>
      ) : isAlreadyFollow ? (
        <button
          onClick={followHandler}
          disabled={loadingFollow}
          className='btn-secondary rounded px-2 text-sm font-semibold'
        >
          Following
        </button>
      ) : (
        <button
          disabled={loadingFollow}
          onClick={followHandler}
          className='rounded border border-primary px-2 py-[3px] text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white'
        >
          Follow
        </button>
      )}
    </>
  );
}
