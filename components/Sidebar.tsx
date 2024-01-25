import PopularTopics from "./PopularTopics";
import { RiGithubFill, RiHomeSmileFill } from "react-icons/ri";
import SuggestedAccounts from "./SuggestedAccounts";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoSearchOutline } from "react-icons/io5";
import { useState } from "react";
import MobileSearchBarModal from "./modal/MobileSearchBarModal";

export default function Sidebar() {
  const [showMobileSearchBar, setShowMobileSearchBar] = useState(false);

  const router = useRouter();

  return (
    <aside className="side-bar lg:flex lg:flex-col min-w-[3.5rem] w-14 lg:w-full lg:max-w-[21rem] border-r lg:border-none border-r-gray-100 dark:border-r-darkBorder lg:pr-4 h-[calc(100vh-97px)] overflow-hidden overflow-y-auto">
      {showMobileSearchBar && (
        <MobileSearchBarModal onClose={() => setShowMobileSearchBar(false)} />
      )}

      <Link
        href="https://github.com/zwelhtetyan/tiktok-clone"
        target="_blank"
        aria-label="Home"
        className={`mb-2 lg:bg-primary max-w-[150px] lg:text-white text-sm rounded-full lg:rounded-md flex items-center justify-center lg:p-1 dark:border-darkSecondary
        bg-gray-100 w-12 h-12 lg:w-auto lg:h-auto dark:bg-darkBtn dark:lg:bg-primary
        `}
      >
        <RiGithubFill size={22} />
        <p className="lg:ml-2 hidden lg:block">Stars on Github</p>
      </Link>

      <Link
        href="/"
        aria-label="Home"
        className={`${
          router.asPath === "/"
            ? "lg:border-primary text-primary bg-gray-200 dark:bg-black"
            : "border-gray-200 dark:text-white bg-gray-100 dark:bg-darkBtn hover:bg-gray-200 dark:hover:bg-darkBtnHover hover:border-gray-300 lg:bg-transparent dark:lg:bg-transparent"
        } font-bold text-lg lg:border-none rounded-full lg:rounded-sm flex items-center justify-center lg:justify-start w-12 h-12 lg:w-auto lg:p-2 border dark:border-darkSecondary
        `}
      >
        <RiHomeSmileFill size={22} />
        <p className="lg:ml-2 hidden lg:block">For You</p>
      </Link>

      <button
        aria-label="search"
        onClick={() => setShowMobileSearchBar(true)}
        className={`${
          false
            ? "active-topic"
            : "border-gray-200 dark:text-white bg-gray-100 dark:bg-darkBtn hover:bg-gray-200 dark:hover:bg-darkBtnHover hover:border-gray-300"
        } mt-2 rounded-full flex md:hidden items-center justify-center w-12 h-12 lg:w-auto lg:h-auto lg:px-3 lg:py-2 border dark:border-darkSecondary focus-visible:outline-none
        `}
      >
        <IoSearchOutline size={23} />
      </button>

      <div className="h-[1px] bg-gray-200 dark:bg-darkBorder my-3" />

      <PopularTopics />

      <SuggestedAccounts />
    </aside>
  );
}
