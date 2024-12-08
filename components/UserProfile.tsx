import Image from 'next/image';

interface Props {
  src: string;
  className?: string;
}

export default function UserProfile({ src, className }: Props) {
  return (
    <>
      {src && (
        <Image
          src={src}
          width={100}
          height={100}
          alt='profile_img'
          className={`${className} h-12 w-12 cursor-pointer rounded-full p-[4px] duration-200 hover:bg-gray-200 dark:hover:bg-darkSecondary`}
        />
      )}
    </>
  );
}
