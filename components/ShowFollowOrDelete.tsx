import { AiTwotoneDelete } from 'react-icons/ai';

interface Props {
  isCreator: boolean;
  isAlreadyFollow: boolean;
  followHandler(): Promise<void>;
  loadingFollow: boolean;
  showDeleteModal(): void;
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
          className='reaction-btn text-red-600 cursor-pointer'
        >
          <AiTwotoneDelete size={20} />
        </div>
      ) : isAlreadyFollow ? (
        <button
          onClick={followHandler}
          disabled={loadingFollow}
          className='btn-secondary text-sm px-2 rounded font-semibold'
        >
          Following
        </button>
      ) : (
        <button
          disabled={loadingFollow}
          onClick={followHandler}
          className='py-[3px] px-2 rounded font-semibold text-sm text-primary border border-primary hover:bg-gray-200 dark:hover:bg-darkBtn'
        >
          Follow
        </button>
      )}
    </>
  );
}
