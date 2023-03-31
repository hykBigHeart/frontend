import React, { useState, useRef, useEffect } from "react";
import styles from "./video.module.scss";
import { course } from "../../../api/index";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

declare const window: any;

interface PropInterface {
  id: number;
  cid: number;
  title: string;
  open: boolean;
  isLastpage: boolean;
  lastSeeDuration: number;
  progress: number;
  onCancel: () => void;
  goNextVideo: () => void;
}

export const VideoModel: React.FC<PropInterface> = ({
  id,
  cid,
  title,
  open,
  isLastpage,
  lastSeeDuration,
  progress,
  onCancel,
  goNextVideo,
}) => {
  const systemConfig = useSelector((state: any) => state.systemConfig.value);
  const user = useSelector((state: any) => state.loginUser.value.user);
  const [playUrl, setPlayUrl] = useState<string>("");
  const [playDuration, setPlayDuration] = useState(0);
  const [playendedStatus, setPlayendedStatus] = useState<Boolean>(false);
  const [lastSeeValue, setLastSeeValue] = useState({});
  const [loading, setLoading] = useState<Boolean>(false);
  const myRef = useRef(0);

  useEffect(() => {
    let params = null;
    if (open) {
      if (lastSeeDuration > 0 && progress < 100) {
        params = {
          time: 5,
          pos: lastSeeDuration,
        };
        setLastSeeValue(params);
      }
      setPlayendedStatus(false);
      getVideoUrl(params);
    }
  }, [open, id, cid, lastSeeDuration]);

  useEffect(() => {
    myRef.current = playDuration;
  }, [playDuration]);

  const getVideoUrl = (params: any) => {
    course.playUrl(cid, id).then((res: any) => {
      setPlayUrl(res.data.url);
      initDPlayer(res.data.url, 0, params);
    });
  };

  const initDPlayer = (playUrl: string, isTrySee: number, params: any) => {
    window.player = new window.DPlayer({
      container: document.getElementById("meedu-player-container"),
      autoplay: false,
      video: {
        url: playUrl,
        pic: systemConfig.playerPoster,
      },
      try: isTrySee === 1,
      bulletSecret: {
        enabled: systemConfig.playerIsEnabledBulletSecret,
        text: systemConfig.playerBulletSecretText
          .replace("{name}", user.name)
          .replace("{email}", user.email)
          .replace("{idCard}", user.id_card),
        size: "14px",
        color: systemConfig.playerBulletSecretColor || "red",
        opacity: Number(systemConfig.playerBulletSecretOpacity),
      },
      ban_drag: false,
      last_see_pos: params,
    });
    // 监听播放进度更新evt
    window.player.on("timeupdate", () => {
      playTimeUpdate(parseInt(window.player.video.currentTime), false);
    });
    window.player.on("ended", () => {
      setPlayendedStatus(true);
      playTimeUpdate(parseInt(window.player.video.currentTime), true);
      window.player && window.player.destroy();
    });
    setLoading(false);
  };

  const playTimeUpdate = (duration: number, isEnd: boolean) => {
    if (duration - myRef.current >= 10 || isEnd === true) {
      setPlayDuration(duration);
      course.record(cid, id, duration).then((res: any) => {});
      course.playPing(cid, id).then((res: any) => {});
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
                <ArrowLeftOutlined />
                <span className="ml-14">返回</span>
              </div>
            </div>
          </div>
          <div className={styles["video-body"]}>
            <div className={styles["video-title"]}>{title}</div>
            <div className={styles["video-box"]}>
              <div className="play-box" id="meedu-player-container"></div>
              {playendedStatus && (
                <div className={styles["alert-message"]}>
                  {isLastpage && (
                    <div
                      className={styles["alert-button"]}
                      onClick={() => {
                        window.player && window.player.destroy();
                        onCancel();
                      }}
                    >
                      恭喜你学完最后一节
                    </div>
                  )}
                  {!isLastpage && (
                    <div
                      className={styles["alert-button"]}
                      onClick={() => {
                        if (loading) {
                          return;
                        }
                        setLoading(true);
                        setLastSeeValue({});
                        setPlayendedStatus(false);
                        goNextVideo();
                      }}
                    >
                      播放下一节
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
