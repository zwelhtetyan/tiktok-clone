import { Fragment } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { Menu, Transition } from '@headlessui/react';
import { IoIosLogOut, IoMdMoon } from 'react-icons/io';
import { MdWbSunny } from 'react-icons/md';
import themeToggler from '../utils/themeToggler';
import { FaUserCircle } from 'react-icons/fa';

import { useRouter } from 'next/router';
import useStore from '../store';

export default function User() {
  const { data: user }: any = useSession();
  const { theme, setTheme } = useStore();
  const router = useRouter();

  return (
    <Menu as='div' className='relative inline-block h-11 w-11 xs:h-12 xs:w-12'>
      <div className='flex items-center'>
        <Menu.Button className='inline-flex w-full items-center justify-center rounded-md'>
          <Image
            src={user.image}
            width={100}
            height={100}
            alt='user_img'
            priority
            className='h-full w-full rounded-full p-[4px] duration-200 hover:bg-gray-200 dark:hover:bg-darkSecondary'
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items className='absolute right-0 z-10 w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-dark dark:ring-darkSecondary'>
          <div className='px-1 py-1'>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active && 'bg-gray-200 dark:bg-darkSecondary'
                  } group flex w-full items-center justify-between rounded-md px-2 py-2 text-gray-800 dark:text-gray-200`}
                  onClick={() => router.push(`/profile/${user._id}`)}
                >
                  <p>View profile</p>
                  <FaUserCircle size={20} />
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => themeToggler(setTheme)}
                  className={`${
                    active && 'bg-gray-200 dark:bg-darkSecondary'
                  } group flex w-full items-center justify-between rounded-md px-2 py-2 text-gray-800 dark:text-gray-200`}
                >
                  <p>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</p>
                  {theme === 'dark' ? (
                    <MdWbSunny size={20} />
                  ) : (
                    <IoMdMoon size={20} />
                  )}
                </button>
              )}
            </Menu.Item>
            {/* <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active && "bg-gray-200 dark:bg-darkSecondary"
                  } text-gray-800 dark:text-gray-200 group flex justify-between w-full items-center rounded-md px-2 py-2`}
                  onClick={() => {
                    window.open(
                      "https://github.com/zwelhtetyan/tiktok-clone",
                      "_blank"
                    );
                  }}
                >
                  <p className="flex items-center">
                    Give{" "}
                    <TiStar
                      className="inline-block ml-1 text-primary"
                      size={20}
                    />
                  </p>
                  <FaGithubAlt size={20} />
                </button>
              )}
            </Menu.Item> */}
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active && 'bg-gray-200 dark:bg-darkSecondary'
                  } group flex w-full items-center justify-between rounded-md px-2 py-2 text-gray-800 dark:text-gray-200`}
                  onClick={() => signOut()}
                >
                  <p>Log out</p>
                  <IoIosLogOut size={20} />
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
