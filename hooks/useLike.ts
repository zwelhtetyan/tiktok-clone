import { useState } from 'react';
import { Video } from '../types';
import axios from 'axios';
import { ROOT_URL } from '../utils';

interface ObjProps {
  userId: string;
  postId: string;
}

export default function useLike() {
  const [loading, setLoading] = useState(false);

  async function handleLike(obj: ObjProps) {
    setLoading(true);

    const { data: updatedPost }: { data: Video } = await axios.put(
      `${ROOT_URL}/api/post/like`,
      { ...obj },
    );

    setLoading(false);

    return updatedPost;
  }

  async function handleUnlike(obj: ObjProps) {
    setLoading(true);

    const { data: updatedPost }: { data: Video } = await axios.put(
      `${ROOT_URL}/api/post/unlike`,
      obj,
    );

    setLoading(false);

    return updatedPost;
  }

  return { loading, handleLike, handleUnlike };
}
