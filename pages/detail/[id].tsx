import axios from 'axios';
import Head from 'next/head';
import { ROOT_URL } from '../../utils';
import { Video } from '../../types';

interface DetailProps {
  videoDetail: Video;
}

export default function Detail({ videoDetail }: DetailProps) {
  console.log(videoDetail);

  return (
    <>
      <Head>
        <title>video name | Tik Tok</title>
      </Head>
    </>
  );
}

export async function getServerSideProps({
  params: { id },
}: {
  params: { id: string };
}) {
  const res = await axios.get(`${ROOT_URL}/api/post/${id}`);

  return { props: { videoDetail: res.data } };
}
