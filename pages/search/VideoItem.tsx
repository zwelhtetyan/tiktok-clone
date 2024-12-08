import Link from 'next/link';
import UserProfile from '../../components/UserProfile';
import { generateFakeUsername } from '../../utils/generateFakeUsername';
import millify from 'millify';

interface VideoItemProps {
  src: string;
  videoId: string;
  caption: string;
  creatorImg: string;
  creatorName: string;
  creatorId: string;
  follower: number;
}

export default function VideoItem({
  src,
  videoId,
  caption,
  creatorImg,
  creatorName,
  creatorId,
  follower,
}: VideoItemProps) {
  return (
    <div className='w-full max-w-[230px] overflow-hidden sm:max-w-none'>
      <Link
        href={`/video/${videoId}`}
        className='flex h-72 w-full items-center justify-center overflow-hidden rounded-md bg-black'
      >
        <video src={src} className='w-full object-cover' />
      </Link>

      <p className='mt-1 line-clamp-1'>{caption}</p>

      <div className='mt-1 flex items-center justify-between'>
        <div className='flex items-center'>
          <Link href={`/profile/${creatorId}`}>
            <UserProfile src={creatorImg} className='h-7 w-7 !p-0' />
          </Link>

          <Link href={`/profile/${creatorId}`}>
            <p className='ml-1 line-clamp-1 cursor-pointer font-bold'>
              {generateFakeUsername(creatorName)}
            </p>
          </Link>
        </div>
        <p className='ml-2'>{millify(follower)}</p>
      </div>
    </div>
  );
}
