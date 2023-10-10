import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import VideoPlayer from "./VideoPlayer";
import Sidebar from "./Sidebar";

function App() {
  const [selectedVideo, setSelectedVideo] = useState<string>("");
  const videoSources: string[] = [
    "https://s.bepro11.com/videos-eu/7a449dcafd/2020-10-22T06:26:42_8c3e076c65db258d/playlist.m3u8",
    "https://s.bepro11.com/videos-eu/7a449dcafd/2020-10-22T06:26:42_8c3e076c65db258d/1520p.m3u8",
    "https://cdn.bepro11.com/videos/highlight/91687cd2afca7d4c21e6b55438e0f7031603347461073.mp4",
  ];
  return (
    <>
      <div className="videoContainer">
        <Sidebar
          setSelectedVideo={setSelectedVideo}
          videoSources={videoSources}
        />
        <VideoPlayer
          videoSources={videoSources}
          selectedVideo={selectedVideo}
        />
      </div>
    </>
  );
}

export default App;
