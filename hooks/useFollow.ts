import { useState } from 'react';
import { User } from '../types';
import { ROOT_URL } from '../utils';
import axios from 'axios';

export interface ObjProps {
  userId: string;
  creatorId: string;
}

export default function useFollow() {
  const [loading, setLoading] = useState(false);

  async function handleFollow(obj: ObjProps) {
    setLoading(true);

    const { data: updatedUsers }: { data: User[] } = await axios.put(
      `${ROOT_URL}/api/user/follow`,
      obj,
    );

    setLoading(false);

    return updatedUsers;
  }

  async function handleUnFollow(obj: ObjProps) {
    setLoading(true);

    const { data: updatedUsers }: { data: User[] } = await axios.put(
      `${ROOT_URL}/api/user/unFollow`,
      obj,
    );

    setLoading(false);

    return updatedUsers;
  }

  return { loading, handleFollow, handleUnFollow };
}
