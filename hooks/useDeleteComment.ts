import axios from 'axios';
import { useState } from 'react';
import { ROOT_URL } from '../utils';

export default function useDeleteComment() {
  const [deletingComment, setDeletingComment] = useState(false);

  async function handleDeleteComment(postId: string, commentKey: string) {
    setDeletingComment(true);

    await axios.delete(`${ROOT_URL}/api/post/comment/${[postId, commentKey]}`);

    setDeletingComment(false);
  }

  return { deletingComment, handleDeleteComment };
}
