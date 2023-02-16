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
    <div className='w-full max-w-[230px] sm:max-w-none overflow-hidden'>
      <Link
        href={`/video/${videoId}`}
        className='bg-black overflow-hidden flex items-center w-full justify-center h-72 rounded-md'
      >
        <video src={src} className='w-full object-cover' />
      </Link>

      <p className='line-clamp-1 mt-1'>{caption}</p>

      <div className='flex justify-between items-center mt-1'>
        <div className='flex items-center'>
          <Link href={`/profile/${creatorId}`}>
            <UserProfile src={creatorImg} className='w-7 h-7 !p-0' />
          </Link>

          <Link href={`/profile/${creatorId}`}>
            <p className='font-bold ml-1 line-clamp-1 cursor-pointer'>
              {generateFakeUsername(creatorName)}
            </p>
          </Link>
        </div>
        <p className='ml-2'>{millify(follower)}</p>
      </div>
    </div>
  );
}
