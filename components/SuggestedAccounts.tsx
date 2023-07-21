import axios from "axios";
import useSWR from "swr";
import { ROOT_URL } from "../utils";
import { User } from "../types";
import UserProfile from "./UserProfile";
import { generateFakeUsername } from "../utils/generateFakeUsername";
import Link from "next/link";
import { useEffect } from "react";
import useStore from "../store";

interface DataProps {
  data: User[];
  isLoading: boolean;
  error: any;
}

async function getAllUsers() {
  const { data: allUsers } = await axios.get(`${ROOT_URL}/api/user`);
  return allUsers;
}

function UserAccount({
  src,
  userName,
  userId,
}: {
  src: string;
  userName: string;
  userId: string;
}) {
  return (
    <Link
      href={`/profile/${userId}`}
      className="flex items-center dark:text-gray-200 rounded p-[2px] hover:bg-gray-100 dark:hover:bg-darkBtnHover cursor-pointer"
    >
      <UserProfile src={src} className=" mr-2" />

      <div>
        <h2 className="font-semibold leading-5">{userName}</h2>
        <p className="text-gray-500 text-sm">
          {generateFakeUsername(userName)}
        </p>
      </div>
    </Link>
  );
}

function UserSkeleton() {
  return (
    <div className="shadow rounded-md p-[2px] w-full mb-1">
      <div className="animate-pulse flex items-center space-x-2">
        <div className="rounded-full bg-gray-300 dark:bg-darkBtn h-10 w-10" />

        <div className="flex-1 space-y-2 py-1">
          <div className="h-2 bg-gray-300 dark:bg-darkBtn rounded w-2/3"></div>
          <div className="h-2 bg-gray-300 dark:bg-darkBtn rounded w-36"></div>
        </div>
      </div>
    </div>
  );
}

let initialRender = true;

export default function SuggestedAccounts() {
  const { suggestedUsers, setSuggestedUsers } = useStore();

  const { data: allUsers, isLoading }: DataProps = useSWR(
    "getAllUsers",
    getAllUsers
  );

  // randomly sort users
  useEffect(() => {
    if (initialRender && allUsers?.length) {
      const sortedUsers = allUsers?.sort(() => Math.random() - 0.5);
      setSuggestedUsers(sortedUsers);

      initialRender = false;
    }
  }, [allUsers, setSuggestedUsers]);

  return (
    <div className="pt-4 mt-4 hidden lg:block border-t border-t-gray-200 dark:border-t-darkBorder">
      <h2 className="font-semibold text-gray-500">Suggested accounts</h2>

      <div className="flex-1 max-h-[300px] mt-3 overflow-y-auto">
        {isLoading &&
          [1, 2, 3, 4, 5].map((_, idx) => <UserSkeleton key={idx} />)}

        {suggestedUsers?.map((user) => (
          <UserAccount
            key={user._id}
            src={user.image}
            userName={user.userName}
            userId={user._id}
          />
        ))}
      </div>
    </div>
  );
}
