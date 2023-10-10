import React from "react";
import "./App.css";
type videoProp = {
  videoSources: string[];
  setSelectedVideo: React.Dispatch<React.SetStateAction<string>>;
};
const Sidebar = ({ videoSources, setSelectedVideo }: videoProp) => {
  function getLastSegment(inputString: string) {
    const segments = inputString.split("/");
    return segments[segments.length - 1];
  }
  const handleChange = (video: string) => {
    setSelectedVideo(video);
  };
  return (
    <div className="sidebar open">
      <ul>
        {videoSources.map((video) => {
          return (
            <li onClick={() => handleChange(video)}>{getLastSegment(video)}</li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
