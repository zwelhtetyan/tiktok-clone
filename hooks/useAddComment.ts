import { useState } from 'react';
import { Video } from '../types';
import axios from 'axios';
import { ROOT_URL } from '../utils';

interface ObjProps {
  userId: string;
  postId: string;
  comment: string;
}

export default function useAddComment() {
  const [isCommenting, setIsCommenting] = useState(false);

  async function handleAddComment(obj: ObjProps) {
    setIsCommenting(true);

    const { data: updatedPost }: { data: Video } = await axios.put(
      `${ROOT_URL}/api/post/comment`,
      obj,
    );

    setIsCommenting(false);

    return updatedPost;
  }

  return { isCommenting, handleAddComment };
}
