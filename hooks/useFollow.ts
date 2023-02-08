import { useState } from 'react';
import { User } from '../types';
import { ROOT_URL } from '../utils';
import axios from 'axios';

export interface ObjProps {
  userId: string;
  creatorId: string;
  follow: boolean;
}

export default function useFollow() {
  const [loadingFollow, setLoadingFollow] = useState(false);

  async function handleFollow(obj: ObjProps) {
    setLoadingFollow(true);

    const { data: updatedUsers }: { data: User[] } = await axios.put(
      `${ROOT_URL}/api/user`,
      obj
    );

    setLoadingFollow(false);

    return updatedUsers;
  }

  return { loadingFollow, handleFollow };
}
