import React from 'react';
import UserProfile from '../../components/UserProfile';
import { generateFakeUsername } from '../../utils/generateFakeUsername';

interface Prop {
  src: string;
  userName: string;
  follower: number;
  bio: string;
}

export default function UserAccount({ src, userName, follower, bio }: Prop) {
  return (
    <div className='mb-4 flex'>
      <UserProfile src={src} className='w-16 h-16' />

      <div className='flex-1 ml-3 mt-[2px]'>
        <h2 className='font-bold'>{userName}</h2>
        <p className='text-[15px] text-gray-500 dark:text-gray-400'>
          <span>{generateFakeUsername(userName)}</span> <span>•</span>{' '}
          <span className='text-dark dark:text-white'>{follower}</span>{' '}
          {follower > 1 ? 'Followers' : 'Follower'}
        </p>
        <p className='text-[15px] text-gray-700 dark:text-gray-300'>{bio}</p>
      </div>
    </div>
  );
}
