import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import React, { useState } from 'react';
import { ROOT_URL } from '../../utils';
import { User, Video } from '../../types';
import Layout from '../../components/Layout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { TabItem } from '../../components/TabItem';
import UserAccount from './UserAccount';

interface Props {
  data: {
    searchedPosts: Video[];
    searchedUsers: User[];
  };
}

export default function Search({
  data: { searchedUsers, searchedPosts },
}: Props) {
  const [tab, setTab] = useState(0);

  const router = useRouter();
  const searchQuery = router.query.q;

  console.log(searchedUsers, searchedPosts);

  const TITLE = `Find '${searchQuery}' on TikTok | TikTok Search`;

  return (
    <Layout>
      <Head>
        <title>{TITLE}</title>
      </Head>

      <div className='pl-2 sm:pl-4 lg:pl-10 h-[calc(100vh-97px)] overflow-y-auto'>
        <div className='flex items-center'>
          <TabItem name='Top' tabIdx={0} tab={tab} setTab={setTab} />
          <TabItem name='Account' tabIdx={1} tab={tab} setTab={setTab} />
          <TabItem name='Video' tabIdx={2} tab={tab} setTab={setTab} />
        </div>

        {/* Accounts */}
        <div className='mt-4'>
          <div className='flex justify-between mb-2'>
            <h4 className='font-bold'>Accounts</h4>
            <button className='btn-secondary text-sm px-2 text-gray-700 dark:text-gray-300'>
              See more
            </button>
          </div>

          {searchedUsers.map((user) => (
            <UserAccount
              key={user._id}
              userName={user.userName}
              src={user.image}
              follower={user.follower?.length || 0}
              bio={user.bio || ''}
            />
          ))}
        </div>

        {/* Videos */}
        <div className='mt-10'>
          <div className='flex justify-between mb-2'>
            <h4 className='font-bold'>Videos</h4>
            <button className='btn-secondary text-sm px-2 text-gray-700 dark:text-gray-300'>
              See more
            </button>
          </div>
          Show Videos
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const searchQuery = context.query.q;

  const { data } = await axios.get(`${ROOT_URL}/api/search/${searchQuery}`);

  return { props: { data } };
}
