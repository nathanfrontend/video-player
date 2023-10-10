import React, { useRef, useEffect, useState } from "react";
import Hls from "hls.js";
//prop types
type videoProp = {
  videoSources: string[];
  selectedVideo: string;
};

const VideoPlayer = ({ videoSources, selectedVideo }: videoProp) => {
  // refs and states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<string>("0.5");
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const video = videoRef.current;
    const hls = new Hls();

    // Function to load video by URL
    const loadVideo = (url: string) => {
      if (Hls.isSupported() && video) {
        hls.loadSource(selectedVideo === "" ? url : selectedVideo);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          video.play();
          setIsPlaying(true);
        });
      } else if (video?.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
        video?.addEventListener("canplay", () => video.play());
      }
    };

    // Function to handle video end and switch to next source
    const handleVideoEnd = () => {
      const nextIndex = currentIndex + 1;
      if (nextIndex < videoSources.length) {
        setCurrentIndex(nextIndex);
        loadVideo(videoSources[nextIndex]);
      }
    };

    // Initial video load
    loadVideo(videoSources[currentIndex]);

    // Event listeners for video end and time updates/seeking
    video?.addEventListener("ended", handleVideoEnd);
    video?.addEventListener("timeupdate", updateProgress);
    return () => {
      // Cleanup event listeners and HLS instance
      video?.removeEventListener("ended", handleVideoEnd);
      video?.removeEventListener("timeupdate", updateProgress);
      hls.destroy();
    };
  }, [currentIndex, selectedVideo]);
  // handling volume changes
  const handleVolume = (volume: any) => {
    setVolume(volume);
    if (videoRef.current) {
      const video = videoRef.current;
      video.volume = volume;
    } else console.log("error, no volume");
  };

  // Listen for the canplaythrough event, then hide the loader
  const handleCanPlayThrough = () => {
    setLoading(false);
  };

  // Attach event listener to video element to listen for 'canplaythrough' event
  useEffect(() => {
    const video = videoRef.current;
    video?.addEventListener("canplaythrough", handleCanPlayThrough);

    // Cleanup listener on component unmount
    return () => {
      video?.removeEventListener("canplaythrough", handleCanPlayThrough);
    };
  }, []); // Empty dependency array means this useEffect runs once on mount

  // play/pause function
  const togglePlayPause = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video?.pause();
    } else {
      video?.play();
    }
    setIsPlaying(!isPlaying);
  };
  //fullscreen
  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!document.fullscreenElement) {
      video?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
  //updating progress of video
  const updateProgress = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      setProgress((video.currentTime / video.duration) * 100);
    } else console.log("error, no progress bar");
  };

  const onSeek = (e: { target: { value: string } }) => {
    if (videoRef.current) {
      const video = videoRef.current;
      video.currentTime = (parseInt(e.target.value) * video.duration) / 100;
    } else console.log("error, no video duration");
  };
  return (
    <div className="container">
      <div>
        {loading && <div className="loader">Loading...</div>}

        <video ref={videoRef} autoPlay={true} style={{ width: "800px" }} />
      </div>
      <div className="controls">
        <button onClick={togglePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button onClick={toggleFullscreen}>Fullscreen</button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => handleVolume(e.target.value)}
        />
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={(e) => onSeek(e)}
        style={{ width: "800px" }}
      />
    </div>
  );
};

export default VideoPlayer;
