import Image from 'next/image';
import { Video } from '../types';
import { IoMdPause } from 'react-icons/io';
import { IoPlay } from 'react-icons/io5';
import { HiVolumeOff, HiVolumeUp } from 'react-icons/hi';
import { MouseEvent, useRef, useState } from 'react';
import { pauseAllVideo } from '../utils/pauseAllVideo';
import { updateActionBtn } from '../utils/updateActionBtn';

interface Props {
  video: Video;
  isMute: boolean;
  id: number;
  handleMute(e: MouseEvent): void;
}

export default function VideoItem({
  video: { postedBy, caption, video },
  isMute,
  id,
  handleMute,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePause = (e: MouseEvent) => {
    e.stopPropagation();
    const videoElem = videoRef.current!;

    if (!videoElem.paused) {
      videoElem.pause();
      updateActionBtn(id.toString(), true);
    } else {
      const videoElems = document.querySelectorAll('.video');
      pauseAllVideo(videoElems, false);
      videoElem.play();
      updateActionBtn(id.toString());
    }
  };

  return (
    <div className='pb-6 mb-6 border-b border-b-gray-100 dark:border-b-darkBorder dark:text-white'>
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

      <div className='group relative rounded-lg xs:ml-[60px] h-[470px] xs:h-[480px] bg-black max-w-[270px] flex items-center overflow-hidden cursor-pointer'>
        <video
          ref={videoRef}
          src={video.asset.url}
          loop
          muted
          className='video w-full object-cover object-center'
          id={id.toString()}
        />

        {/* action buttons */}
        <div
          id={id.toString()}
          className='action-btn-container absolute flex md:hidden group-hover:flex justify-between items-center left-0 right-0 bottom-5 xs:bottom-7 px-4 text-white'
        >
          <>
            <IoMdPause
              size={25}
              onClick={handlePause}
              className='pause-btn hidden'
            />

            <IoPlay size={25} onClick={handlePause} className='play-btn' />
          </>

          <>
            {isMute ? (
              <HiVolumeOff size={25} onClick={handleMute} />
            ) : (
              <HiVolumeUp size={25} onClick={handleMute} />
            )}
          </>
        </div>
      </div>
    </div>
  );
}
