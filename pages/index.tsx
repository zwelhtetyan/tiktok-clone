import axios from "axios";
import Head from "next/head";
import { Video } from "../types";
import VideoItem from "../components/videoItem";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { pauseAllVideo } from "../utils/pauseAllVideo";
import { updateActionBtn } from "../utils/updateActionBtn";
import { ROOT_URL } from "../utils";
import Layout from "../components/Layout";
import useFollow from "../hooks/useFollow";
import { GetServerSidePropsContext } from "next";
import NoResult from "../components/NoResult";
import { useRouter } from "next/router";
import useStore from "../store";

interface Props {
  videos: Video[];
}

let initialRender = true;

export default function Home({ videos }: Props) {
  const { viewedVideoDetail, setViewedVideoDetail } = useStore();

  //states
  const [isMute, setIsMute] = useState(
    viewedVideoDetail.prevScroll ? false : true
  );
  const [allPostedBy, setAllPostedBy] = useState(
    videos.map((video) => video.postedBy)
  );
  const [currentUserId, setCurrentUserId] = useState("");

  //ref
  const innerContainer = useRef<HTMLDivElement>(null);

  //hooks
  const router = useRouter();
  const { loadingFollow, handleFollow } = useFollow();

  const handleMute = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsMute((prev) => !prev);
  };

  useEffect(() => {
    setAllPostedBy(videos.map((video) => video.postedBy));
  }, [videos]);

  // mute | unmute
  useEffect(() => {
    const videoElems = document.querySelectorAll(".video");

    videoElems.forEach((elem) => {
      const video = elem as HTMLVideoElement;

      isMute ? (video.muted = true) : (video.muted = false);
    });
  }, [isMute]);

  useEffect(() => {
    const videoElems = document.querySelectorAll(".video");
    const elem = document.querySelector(".video-container")!;

    // pause all the video first;
    pauseAllVideo(videoElems);

    let CURRENT_ID = 1;
    let isScrollDown = true;
    let current = 0;
    let prevScroll = viewedVideoDetail.prevScroll;

    if (prevScroll) {
      elem.scrollTop = prevScroll;
    } else {
      innerContainer.current?.scrollIntoView();
      window.scrollTo(0, 0);
    }

    //check direction
    function checkDirection() {
      const scrollH = elem.scrollTop;

      if (scrollH > current) {
        isScrollDown = true;
      } else {
        isScrollDown = false;
      }

      current = scrollH;
    }

    elem.addEventListener("scroll", checkDirection);

    //observer
    const observer = new IntersectionObserver(
      (entries) => {
        // console.log({ entry: entries[0], CURRENT_ID });

        let selectedEntry = entries[0];

        //check previous scroll
        if (prevScroll) {
          selectedEntry = entries.find(
            (entry) => entry.target.id === viewedVideoDetail.videoRef!.id
          )!;

          CURRENT_ID = +viewedVideoDetail.videoRef!.id;
          setViewedVideoDetail(0, null);
          prevScroll = 0;
        }

        const selectedVideo = selectedEntry?.target as HTMLVideoElement;

        if (!isScrollDown) {
          if (+selectedVideo.id < CURRENT_ID && selectedEntry.isIntersecting) {
            CURRENT_ID = +selectedVideo.id;

            pauseAllVideo(videoElems);
            selectedVideo.play();
            updateActionBtn(selectedVideo.id);
          }
        } else {
          if (+selectedVideo.id === CURRENT_ID) {
            if (selectedEntry.isIntersecting) {
              selectedVideo.play();
              updateActionBtn(selectedVideo.id);
            } else {
              CURRENT_ID++;
              const id = CURRENT_ID.toString();
              const videoToPlay = document.getElementById(
                id
              ) as HTMLVideoElement;

              pauseAllVideo(videoElems);
              videoToPlay?.play();
              updateActionBtn(id);
            }
          }
        }
      },
      { threshold: 0.5 }
    );

    videoElems.forEach((video) => {
      if (!initialRender) {
        (video as HTMLVideoElement).muted = false;
        setIsMute(false);
      }

      observer.observe(video);
    });

    return () => {
      videoElems.forEach((video) => observer.unobserve(video));
      elem.removeEventListener("scroll", checkDirection);
    };
  }, [videos]);

  // set initial render if query.topic change -> to unmute all the video and autoPlay on;
  useEffect(() => {
    if (router.query.topic) {
      initialRender = false;
    }
  }, [router.query.topic]);

  const metadata = {
    description:
      "TikTok, also known in China as Douyin, is a short-form video hosting service owned by the Chinese company ByteDance. It hosts user-submitted videos, which can range in duration from 3 seconds to 10 minutes.",
    title: "TikTok - Make Your Day",
  };

  return (
    <Layout>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta
          property="og:url"
          content="https://tiktok-clone-zhy.vercel.app/"
        ></meta>
        <meta
          property="og:image"
          content="https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kdb7qa7aav7vww7ayiki.png"
        />
      </Head>

      <div className="video-container h-[calc(100vh-97px)] overflow-hidden overflow-y-auto">
        <div className="pt-2 pl-2 sm:pl-4 lg:pl-10 max-w-2xl">
          <div ref={innerContainer}>
            {videos?.length > 0 ? (
              videos.map((video, idx) => (
                <VideoItem
                  key={video._id}
                  id={idx + 1}
                  post={video}
                  postedBy={allPostedBy[idx]}
                  setAllPostedBy={setAllPostedBy}
                  isMute={isMute}
                  handleMute={handleMute}
                  handleFollow={handleFollow}
                  setCurrentUserId={setCurrentUserId}
                  loadingFollow={
                    loadingFollow && allPostedBy[idx]._id === currentUserId
                  }
                />
              ))
            ) : (
              <NoResult title="No video found!" />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const topic = context.query.topic;
  let videos;

  if (topic) {
    const { data } = await axios.get(`${ROOT_URL}/api/post/discover/${topic}`);
    videos = data;
  } else {
    const { data } = await axios.get(`${ROOT_URL}/api/post`);
    videos = data;
  }

  return { props: { videos } };
}
