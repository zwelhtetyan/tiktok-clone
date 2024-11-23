import React from 'react';
import UserProfile from '../../components/UserProfile';
import { generateFakeUsername } from '../../utils/generateFakeUsername';
import Link from 'next/link';
import millify from 'millify';

interface Prop {
  src: string;
  userName: string;
  userId: string;
  follower: number;
  bio: string;
}

export default function UserAccount({
  src,
  userName,
  userId,
  follower,
  bio,
}: Prop) {
  return (
    <Link
      href={`/profile/${userId}`}
      className='mb-4 flex cursor-pointer rounded-md hover:bg-gray-100 dark:hover:bg-darkBtnHover'
    >
      <UserProfile src={src} className='h-16 w-16' />

      <div className='ml-3 mt-[2px] flex-1'>
        <h2 className='font-bold'>{userName}</h2>
        <p className='text-[15px] text-gray-500 dark:text-gray-400'>
          <span>{generateFakeUsername(userName)}</span> <span>•</span>{' '}
          <span className='text-dark dark:text-white'>{millify(follower)}</span>{' '}
          {follower > 1 ? 'Followers' : 'Follower'}
        </p>
        <p className='line-clamp-2 text-[15px] text-gray-800 dark:text-gray-300'>
          {bio}
        </p>
      </div>
    </Link>
  );
}
