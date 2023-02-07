import { useState } from 'react';
import { Video } from '../types';
import axios from 'axios';
import { ROOT_URL } from '../utils';

interface ObjProps {
  userId: string;
  postId: string;
  like: boolean;
}

export default function useLike() {
  const [liking, setLiking] = useState(false);

  async function handleLike(obj: ObjProps) {
    setLiking(true);

    const { data: updatedPost }: { data: Video } = await axios.put(
      `${ROOT_URL}/api/post/like`,
      obj
    );

    setLiking(false);

    return updatedPost;
  }

  return { liking, handleLike };
}
