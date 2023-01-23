import Image from 'next/image';
import { Video } from '../types';

interface Props {
  video: Video;
}

const VideoItem = ({ video: { postedBy, caption, video } }: Props) => {
  return (
    <div className='pb-6 mb-6 border-b border-b-gray-200'>
      <header className='flex items-center xs:items-start mb-2 xs:mb-4'>
        <Image
          src={postedBy.image}
          width={100}
          height={100}
          alt='profile_img'
          className='w-10 h-10 xs:w-12 xs:h-12 rounded-full mr-2 xs:mr-3'
        />
        <div>
          <h2 className='font-bold mb-1 text-lg xs:text-base'>
            {postedBy.userName}
          </h2>
          <p className='max-w-md leading-[1.3rem] hidden xs:block'>{caption}</p>
        </div>
      </header>

      <p className='max-w-md leading-[1.3rem] mb-2 xs:hidden'>{caption}</p>

      <div className='max-w-md xs:ml-[60px]'>
        <div className='rounded-md max-w-[270px] h-[calc(450px+(100vw-768px)/1152*100)] overflow-hidden'>
          <video
            src={video.asset.url}
            loop
            className='w-full h-full object-cover'
          />
        </div>
      </div>
    </div>
  );
};

export default VideoItem;
