import axios from 'axios';
import useSWR from 'swr';
import { ROOT_URL } from '../utils';
import { User } from '../types';
import UserProfile from './UserProfile';
import { generateFakeUsername } from '../utils/generateFakeUsername';
import Link from 'next/link';
import { useEffect } from 'react';
import useStore from '../store';

interface DataProps {
  data: User[];
  isLoading: boolean;
  error: any;
}

async function getAllUsers() {
  const { data: allUsers } = await axios.get(`${ROOT_URL}/api/user`);
  return allUsers;
}

function UserAccount({
  src,
  userName,
  userId,
}: {
  src: string;
  userName: string;
  userId: string;
}) {
  return (
    <Link
      href={`/profile/${userId}`}
      className='flex cursor-pointer items-center rounded p-[2px] hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-darkBtnHover'
    >
      <UserProfile src={src} className='mr-2' />

      <div>
        <h2 className='font-semibold leading-5'>{userName}</h2>
        <p className='text-sm text-gray-500'>
          {generateFakeUsername(userName)}
        </p>
      </div>
    </Link>
  );
}

function UserSkeleton() {
  return (
    <div className='mb-1 w-full rounded-md p-[2px] shadow'>
      <div className='flex animate-pulse items-center space-x-2'>
        <div className='h-10 w-10 rounded-full bg-gray-300 dark:bg-darkBtn' />

        <div className='flex-1 space-y-2 py-1'>
          <div className='h-2 w-2/3 rounded bg-gray-300 dark:bg-darkBtn'></div>
          <div className='h-2 w-36 rounded bg-gray-300 dark:bg-darkBtn'></div>
        </div>
      </div>
    </div>
  );
}

let initialRender = true;

export default function SuggestedAccounts() {
  const { suggestedUsers, setSuggestedUsers } = useStore();

  const { data: allUsers, isLoading }: DataProps = useSWR(
    'getAllUsers',
    getAllUsers,
  );

  // randomly sort users
  useEffect(() => {
    if (initialRender && allUsers?.length) {
      const sortedUsers = allUsers?.sort(() => Math.random() - 0.5);
      setSuggestedUsers(sortedUsers);

      initialRender = false;
    }
  }, [allUsers, setSuggestedUsers]);

  return (
    <div className='h-full overflow-y-auto'>
      {isLoading &&
        Array.from({ length: 30 }, (_, idx) => <UserSkeleton key={idx} />)}

      {suggestedUsers?.map((user) => (
        <UserAccount
          key={user._id}
          src={user.image}
          userName={user.userName}
          userId={user._id}
        />
      ))}
    </div>
  );
}
