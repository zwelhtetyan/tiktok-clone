import axios from 'axios';
import { useState } from 'react';
import { ROOT_URL } from '../utils';

export default function useDeletePost() {
  const [deletingPost, setDeletingPost] = useState(false);

  async function handleDeletePost(postId: string) {
    setDeletingPost(true);

    await axios.delete(`${ROOT_URL}/api/post/${postId}`);

    setDeletingPost(false);
  }

  return { deletingPost, handleDeletePost };
}
