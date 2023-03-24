import React, { useState, useEffect } from "react";
import styles from "./video.module.scss";
import { course } from "../../../api/index";

declare const window: any;

interface PropInterface {
  id: number;
  cid: number;
  title: string;
  open: boolean;
  onCancel: () => void;
}

export const VideoModel: React.FC<PropInterface> = ({
  id,
  cid,
  title,
  open,
  onCancel,
}) => {
  const [playUrl, setPlayUrl] = useState<string>("");
  const [playDuration, setPlayDuration] = useState(0);

  useEffect(() => {
    if (open) {
      getVideoUrl();
    }
  }, [open, id, cid]);

  const getVideoUrl = () => {
    course.playUrl(cid, id).then((res: any) => {
      setPlayUrl(res.data.url);
      initDPlayer(res.data.url, 0);
    });
  };

  const initDPlayer = (playUrl: string, isTrySee: number) => {
    window.player = new window.DPlayer({
      container: document.getElementById("meedu-player-container"),
      autoplay: false,
      video: {
        quality: playUrl,
        defaultQuality: 0,
      },
      try: isTrySee === 1,
      bulletSecret: {
        enabled: true,
        text: "18119604035",
        size: "15px",
        color: "red",
        opacity: 0.8,
      },
      ban_drag: false,
      last_see_pos: 0,
    });

    // 监听播放进度更新evt
    window.player.on("timeupdate", () => {
      playTimeUpdate(parseInt(window.player.video.currentTime), false);
    });
    window.player.on("ended", () => {
      playTimeUpdate(parseInt(window.player.video.currentTime), true);
      window.player.destroy();
    });
  };

  const playTimeUpdate = (duration: number, isEnd: boolean) => {
    if (duration >= 10 || isEnd === true) {
      setPlayDuration(duration);
      course.record(cid, id, duration).then((res: any) => {});
    }
  };

  return (
    <>
      {open && (
        <div className={styles["video-mask"]}>
          <div className={styles["top-cont"]}>
            <div className={styles["box"]}>
              <div
                className={styles["close-btn"]}
                onClick={() => {
                  window.player && window.player.destroy();
                  onCancel();
                }}
              >
                返回
              </div>
            </div>
          </div>
          <div className={styles["video-body"]}>
            <div className={styles["video-title"]}>{title}</div>
            <div className={styles["video-box"]}>
              <div className="play-box" id="meedu-player-container"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
