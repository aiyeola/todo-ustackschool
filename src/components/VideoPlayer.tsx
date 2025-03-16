/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use client';

import { useEffect, useRef } from 'react';
import { Card } from './ui/card';

interface VideoPlayerProps {
  url: string;
}

export default function VideoPlayer({ url }: VideoPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadYouTubeIframeAPI = () => {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    };

    if (!window.YT) {
      loadYouTubeIframeAPI();
    }

    const videoId = extractVideoId(url);
    if (!videoId) return;

    const initPlayer = () => {
      new window.YT.Player(playerRef.current!, {
        videoId,
        height: '315',
        width: '100%',
        playerVars: {
          autoplay: 0,
          modestbranding: 1,
          rel: 0,
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }
  }, [url]);

  const extractVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <Card className="w-full overflow-hidden">
      <div ref={playerRef} />
    </Card>
  );
}
