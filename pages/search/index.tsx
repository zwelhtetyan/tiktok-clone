import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import React, { useEffect, useState } from 'react';
import { ROOT_URL } from '../../utils';
import { User, Video } from '../../types';
import Layout from '../../components/Layout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import TabItem from '../../components/TabItem';
import UserAccount from './UserAccount';
import VideoItem from './VideoItem';
import NoResult from '../../components/NoResult';

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

  const hasSearchedUsers = searchedUsers?.length > 0;
  const hasSearchedPosts = searchedPosts?.length > 0;

  const TITLE = `Find '${searchQuery}' on TikTok | TikTok Search`;

  useEffect(() => {
    setTab(0);
  }, [router.query.q]);

  return (
    <Layout>
      <Head>
        <title>{TITLE}</title>
        <meta
          property='og:url'
          content={`https://tiktok-clone-zhy.vercel.app/search?q=${router.query.q}`}
        ></meta>
      </Head>

      <div
        style={{
          height:
            'calc(100vh - 97px - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
        }}
        className='overflow-y-auto pl-2 sm:pl-4 lg:pl-10'
      >
        {/* no videos */}
        {!hasSearchedPosts && !hasSearchedUsers && (
          <NoResult desc={`Couldn't find any matches for "${searchQuery}"`} />
        )}

        {/* tabmenu */}
        <div className='flex items-center'>
          {(hasSearchedUsers || hasSearchedPosts) && (
            <TabItem name='Top' tabIdx={0} tab={tab} setTab={setTab} />
          )}
          {hasSearchedUsers && (
            <TabItem name='Account' tabIdx={1} tab={tab} setTab={setTab} />
          )}
          {hasSearchedPosts && (
            <TabItem name='Video' tabIdx={2} tab={tab} setTab={setTab} />
          )}
        </div>

        {/* Accounts */}
        {hasSearchedUsers && tab !== 2 && (
          <div className='mt-5'>
            {tab !== 1 && (
              <div className='mb-3 flex justify-between'>
                <h4 className='font-bold'>Accounts</h4>
                <button
                  onClick={() => setTab(1)}
                  className='btn-secondary px-2 text-sm text-gray-700 dark:text-gray-300'
                >
                  See more
                </button>
              </div>
            )}

            {searchedUsers.slice(0, 3).map((user) => (
              <UserAccount
                key={user._id}
                userName={user.userName}
                userId={user._id}
                src={user.image}
                follower={user.follower?.length || 0}
                bio={user.bio || ''}
              />
            ))}
          </div>
        )}

        {/* Videos */}
        {hasSearchedPosts && tab !== 1 && (
          <div
            className={`${tab !== 2 && hasSearchedUsers ? 'mt-10' : 'mt-5'}`}
          >
            {tab !== 2 && (
              <div className='mb-3 flex justify-between'>
                <h4 className='font-bold'>Videos</h4>
                <button
                  onClick={() => setTab(2)}
                  className='btn-secondary px-2 text-sm text-gray-700 dark:text-gray-300'
                >
                  See more
                </button>
              </div>
            )}

            <div className='grid grid-cols-auto-fill-200 place-items-center gap-x-3 gap-y-5 text-gray-700 dark:text-gray-300 sm:place-items-stretch'>
              {searchedPosts.slice(0, 9).map((post) => (
                <VideoItem
                  key={post._id}
                  videoId={post._id}
                  caption={post.caption}
                  creatorImg={post.postedBy.image}
                  creatorName={post.postedBy.userName}
                  creatorId={post.postedBy._id}
                  follower={post.postedBy.follower?.length || 0}
                  src={post.video.asset.url}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const searchQuery = context.query.q;

  const { data } = await axios.get(`${ROOT_URL}/api/search/${searchQuery}`);

  return { props: { data } };
}
