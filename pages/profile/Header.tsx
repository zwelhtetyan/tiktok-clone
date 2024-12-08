import Image from 'next/image';
import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { generateFakeUsername } from '../../utils/generateFakeUsername';
import { IoIosCopy } from 'react-icons/io';
import { User, Video } from '../../types';
import { useSession } from 'next-auth/react';
import useFollow from '../../hooks/useFollow';
import useCopy from '../../hooks/useCopy';
import { ROOT_URL } from '../../utils';
import axios from 'axios';
import EditBioModal from '../../components/modal/EditBioModal';
import NotLoginModal from '../../components/modal/NotLoginModal';
import millify from 'millify';

interface Props {
  user: User;
  userCreatedPosts: Video[];
  setUser: Dispatch<SetStateAction<User>>;
  bioRef: RefObject<HTMLTextAreaElement>;
}

function Status({ count, name }: { count: number; name: string }) {
  return (
    <p>
      <span className='mr-1 text-base font-bold text-black dark:text-white'>
        {millify(count)}
      </span>
      {name}
    </p>
  );
}

export default function Header({
  user,
  userCreatedPosts,
  setUser,
  bioRef,
}: Props) {
  const [showEditBioModal, setShowEditBioModal] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [savingBio, setSavingBio] = useState(false);

  const { data: currentUser }: any = useSession();
  const { isCopied, copyToClipboard } = useCopy();
  const { loading: loadingFollow, handleFollow } = useFollow();

  const totalLikes = userCreatedPosts?.reduce(
    (like: number, item: Video) => like + (item.likes?.length || 0),
    0,
  );

  const following = user?.following?.length;
  const followers = user?.follower?.length;

  const profileURL = `${ROOT_URL}/profile/${user?._id}`;

  const isAlreadyFollow = user?.follower?.some(
    (u) => u._ref === currentUser?._id,
  );

  async function followHandler() {
    if (!currentUser) {
      setShowLogin(true);
      return;
    }

    const obj = {
      userId: currentUser?._id,
      creatorId: user?._id,
      follow: isAlreadyFollow ? false : true,
    };

    const updatedUsers = await handleFollow(obj);

    const creator = updatedUsers.find((u) => u._id === user?._id)!;

    setUser((prev) => ({ ...prev, follower: creator.follower }));
  }

  async function handleSaveBio() {
    const bio = bioRef.current?.value!;

    const obj = { userId: user?._id, bio };

    setSavingBio(true);
    const { data: updatedUser } = await axios.put(
      `${ROOT_URL}/api/user/bio`,
      obj,
    );

    setSavingBio(false);
    setUser(updatedUser);
    setShowEditBioModal(false);
  }

  useEffect(() => {
    if (showEditBioModal) {
      const bioLength = user?.bio?.length || null;
      bioRef.current?.setSelectionRange(bioLength, bioLength);
    }
  }, [bioRef, showEditBioModal, user?.bio?.length]);

  return (
    <header className='w-full max-w-2xl'>
      {showLogin && <NotLoginModal onClose={() => setShowLogin(false)} />}
      {showEditBioModal && (
        <EditBioModal
          bioRef={bioRef}
          onClose={() => setShowEditBioModal(false)}
          handleSaveBio={handleSaveBio}
          savingBio={savingBio}
          bio={user?.bio || ''}
        />
      )}

      <div className='flex w-full items-start justify-between'>
        <div className='flex flex-1 items-center'>
          <Image
            src={user?.image}
            alt='user_profile'
            width={200}
            height={200}
            priority
            className='h-16 w-16 rounded-full xs:h-20 xs:w-20 sm:h-28 sm:w-28'
          />

          <div className='ml-2 xs:ml-4'>
            <h2 className='text-base font-extrabold leading-4 xs:text-xl xs:leading-5 sm:text-2xl sm:leading-6'>
              {user?.userName}
            </h2>

            <p className='text-sm text-gray-600 dark:text-gray-200 xs:text-base sm:text-lg'>
              @{generateFakeUsername(user?.userName)}
            </p>

            {user?._id === currentUser?._id ? (
              <button
                onClick={() => setShowEditBioModal(true)}
                className='btn-secondary mt-1 w-28 text-sm font-semibold xs:mt-2 xs:w-40 xs:text-base sm:mt-3'
              >
                Edit bio
              </button>
            ) : isAlreadyFollow ? (
              <button
                onClick={followHandler}
                disabled={loadingFollow}
                className='btn-secondary mt-1 w-28 text-sm font-semibold xs:mt-2 xs:w-40 xs:text-base sm:mt-3'
              >
                Following
              </button>
            ) : (
              <button
                onClick={followHandler}
                disabled={loadingFollow}
                className='btn-primary mt-1 w-28 text-sm font-semibold xs:mt-2 xs:w-40 xs:text-base sm:mt-3'
              >
                Follow
              </button>
            )}
          </div>
        </div>

        <button
          onClick={() => copyToClipboard(profileURL)}
          title='Copy profile'
          className='reaction-btn h-10 w-10'
        >
          {isCopied ? <p className='text-xl'>🥳</p> : <IoIosCopy size={20} />}
        </button>
      </div>

      {/* showcase */}
      <div className='mt-5 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300 xs:gap-x-6'>
        <Status count={following || 0} name='Following' />
        <Status
          count={followers || 0}
          name={followers! > 1 ? 'Followers' : 'Follower'}
        />
        <Status
          count={totalLikes || 0}
          name={totalLikes > 1 ? 'Likes' : 'Like'}
        />
      </div>

      {/* bio */}
      <p className='mt-3 border-l-[3px] border-l-gray-200 p-2 text-sm text-gray-700 dark:border-l-darkBorder dark:text-gray-300'>
        {user?.bio ? user?.bio : 'No bio yet.'}
      </p>
    </header>
  );
}
