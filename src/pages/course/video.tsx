import { useEffect, useRef, useState } from "react";
import styles from "./video.module.scss";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { course as Course } from "../../api/index";
import { ArrowLeftOutlined, CloseOutlined } from "@ant-design/icons";
import { message, Statistic } from "antd";
import type { CountdownProps } from 'antd';
import { getPlayId, savePlayId } from "../../utils";

declare const window: any;
var timer: any = null;
const { Countdown } = Statistic;

const CoursePalyPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const systemConfig = useSelector((state: any) => state.systemConfig.value);
  const user = useSelector((state: any) => state.loginUser.value.user);
  const [playUrl, setPlayUrl] = useState("");
  const [period, setPeriod] = useState(0);
  const [mustLearningS, setMustLearningS] = useState(0);
  const [finishedDuration, setFinishedDuration] = useState(0);
  const [playDuration, setPlayDuration] = useState(0);
  const [playendedStatus, setPlayendedStatus] = useState(false);
  const [lastSeeValue, setLastSeeValue] = useState({});
  const [course, setCourse] = useState<CourseModel | null>(null);
  const [hour, setHour] = useState<HourModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLastpage, setIsLastpage] = useState(false);
  const [totalHours, setTotalHours] = useState<HourModel[]>([]);
  const [playingTime, setPlayingTime] = useState(0);
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const myRef = useRef(0);
  const playRef = useRef(0);
  const watchRef = useRef(0);
  const totalRef = useRef(0);
  const [checkPlayerStatus, setCheckPlayerStatus] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalId = useRef<number>();

  useEffect(() => {
    timer && clearInterval(timer);
    getCourse();
    getDetail();
    document.oncontextmenu = function (e) {
      /*屏蔽浏览器默认右键事件*/
      e = e || window.event;
      return false;
    };

    return () => {
      timer && clearInterval(timer);
      document.oncontextmenu = function (e) {
        /*恢复浏览器默认右键事件*/
        e = e || window.event;
        return true;
      };
    };
  }, [params.courseId, params.hourId]);

  useEffect(() => {
    myRef.current = playDuration;
  }, [playDuration]);

  useEffect(() => {
    playRef.current = playingTime;
  }, [playingTime]);

  useEffect(() => {
    watchRef.current = watchedSeconds;
  }, [watchedSeconds]);

  useEffect(() => {
    totalRef.current = hour?.duration || 0;
  }, [hour]);

  useEffect(() => {
    if (period) {
      let s = 0
      intervalId.current = setInterval(() => {
        s++
        setPlayingTime(s)
        playTimeUpdate(s, false);
        if (finishedDuration + s >= mustLearningS) {
          console.log('学完了');
          playTimeUpdate(s, true);
          window.clearInterval(intervalId.current);
        }
      }, 1000);
    }
  }, [period]);

  const getCourse = () => {
    Course.detail(Number(params.courseId)).then((res: any) => {
      let totalHours: HourModel[] = [];
      if (res.data.chapters.length === 0) {
        setTotalHours(res.data.hours[0]);
        totalHours = res.data.hours[0];
      } else if (res.data.chapters.length > 0) {
        const arr: HourModel[] = [];
        for (let key in res.data.hours) {
          res.data.hours[key].map((item: any) => {
            arr.push(item);
          });
        }
        setTotalHours(arr);
        totalHours = arr;
      }
      const index = totalHours.findIndex(
        (i: any) => i.id === Number(params.hourId)
      );
      if (index === totalHours.length - 1) {
        setIsLastpage(true);
      }
    });
  };

  const getDetail = () => {
    if (loading) {
      return true;
    }
    setLoading(true);
    Course.play(Number(params.courseId), Number(params.hourId))
      .then((res: any) => {
        setCourse(res.data.course);
        setHour(res.data.hour);
        document.title = res.data.hour.title;
        let record: HourRecordModel = res.data.user_hour_record;
        let params = null;
        if (record && record.finished_duration && record.is_finished === 0) {
          params = {
            time: 5,
            pos: record.finished_duration,
          };
          setLastSeeValue(params);
          setLastSeeValue(params);
          setWatchedSeconds(record.finished_duration);
        } else if (record && record.is_finished === 1) {
          setFinished(true)
          setWatchedSeconds(res.data.hour.duration);
        }
        getVideoUrl(params);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const getVideoUrl = (data: any) => {
    Course.playUrl(Number(params.courseId), Number(params.hourId)).then(
      (res: any) => {
        setPlayUrl(res.data.url);
        let convertMS = Date.now() + res.data.period * 60 * 1000 - res.data.finished_duration * 1000
        setPeriod(convertMS)
        setMustLearningS(res.data.period * 60)
        setFinishedDuration(res.data.finished_duration)
        initDPlayer(res.data.url, 0, data);
        savePlayId(String(params.courseId) + "-" + String(params.hourId));
      }
    );
  };

  const initDPlayer = (playUrl: string, isTrySee: number, params: any) => {
    let banDrag =
      systemConfig.playerIsDisabledDrag &&
      watchRef.current < totalRef.current &&
      watchRef.current === 0;
    window.player = new window.DPlayer({
      container: document.getElementById("meedu-player-container"),
      autoplay: true,
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
      ban_drag: banDrag,
      last_see_pos: params,
    });
    // 监听播放进度更新evt
    window.player.on("timeupdate", () => {
      let currentTime = parseInt(window.player.video.currentTime);
      if (
        systemConfig.playerIsDisabledDrag &&
        watchRef.current < totalRef.current &&
        currentTime - playRef.current >= 2 &&
        currentTime > watchRef.current
      ) {
        message.warning("首次学习禁止快进");
        window.player.seek(watchRef.current);
      } else {
        // setPlayingTime(currentTime);
        // playTimeUpdate(parseInt(window.player.video.currentTime), false);
      }
    });
    window.player.on("ended", () => {
      if (
        systemConfig.playerIsDisabledDrag &&
        watchRef.current < totalRef.current &&
        window.player.video.duration - playRef.current >= 2
      ) {
        window.player.seek(playRef.current);
        return;
      }
      setPlayingTime(0);
      setPlayendedStatus(true);
      playTimeUpdate(parseInt(window.player.video.currentTime), true);
      exitFullscreen();
      window.player && window.player.destroy();
    });
    setLoading(false);
    checkPlayer();
  };

  const playTimeUpdate = (duration: number, isEnd: boolean) => {
    if (duration - myRef.current >= 10 || isEnd === true) {
      setPlayDuration(duration);
      Course.record(
        Number(params.courseId),
        Number(params.hourId),
        finishedDuration + duration
      ).then((res: any) => {});
      Course.playPing(Number(params.courseId), Number(params.hourId)).then(
        (res: any) => {}
      );
    }
  };

  const checkPlayer = () => {
    timer = setInterval(() => {
      let playId = getPlayId();
      if (
        playId &&
        playId !== String(params.courseId) + "-" + String(params.hourId)
      ) {
        timer && clearInterval(timer);
        window.player && window.player.destroy();
        setCheckPlayerStatus(true);
      } else {
        setCheckPlayerStatus(false);
      }
    }, 5000);
  };

  const goNextVideo = () => {
    const index = totalHours.findIndex(
      (i: any) => i.id === Number(params.hourId)
    );
    if (index === totalHours.length - 1) {
      setIsLastpage(true);
      message.error("已经是最后一节了！");
    } else if (index < totalHours.length - 1) {
      navigate(`/course/${params.courseId}/hour/${totalHours[index + 1].id}`, {
        replace: true,
      });
    }
  };

  const exitFullscreen = () => {
    let de: any;
    de = document;
    if (de.fullscreenElement !== null) {
      de.exitFullscreen();
    } else if (de.mozCancelFullScreen) {
      de.mozCancelFullScreen();
    } else if (de.webkitCancelFullScreen) {
      de.webkitCancelFullScreen();
    }
  };
  
  const onFinish: CountdownProps['onFinish'] = () => {
    console.log('finished!');
    setFinished(true)
  };

  return (
    <div className={styles["video-mask"]}>
      <div className={styles["top-cont"]}>
        <div className={styles["box"]}>
          <div
            className={styles["close-btn"]}
            // onClick={() => {
            //   window.clearInterval(intervalId.current);
            //   timer && clearInterval(timer);
            //   window.player && window.player.destroy();
            //   document.oncontextmenu = function (e) {
            //     /*恢复浏览器默认右键事件*/
            //     e = e || window.event;
            //     return true;
            //   };
            //   navigate(-1);
            // }}
          >
            {/* <ArrowLeftOutlined />
            <span className="ml-14">返回</span> */}
            {hour?.title}
          </div>
          <div style={{color: 'white', marginLeft: '50%', fontWeight: 600}}>
            {!finished ? 
              <div className={styles["count-down-box"]}>
                您还需学习&emsp;
                <Countdown value={period} format="m 分 s 秒" valueStyle={{color: 'red'}} onFinish={onFinish} />
              </div>
              : 
              <div>您已完成学时</div>
            }
          </div>
          <CloseOutlined style={{color: 'white', cursor: 'pointer'}}
            onClick={() => {
              window.clearInterval(intervalId.current);
              timer && clearInterval(timer);
              window.player && window.player.destroy();
              document.oncontextmenu = function (e) {
                /*恢复浏览器默认右键事件*/
                e = e || window.event;
                return true;
              };
              navigate(-1);
            }}
          />
        </div>
      </div>
      <div className={styles["video-body"]}>
        <div className={styles["video-title"]}>{hour?.title}</div>
        <div className={styles["video-box"]}>
          <div
            className="play-box"
            id="meedu-player-container"
            style={{ borderRadius: 8 }}
          ></div>
          {checkPlayerStatus && (
            <div className={styles["alert-message"]}>
              <div className={styles["des-video"]}>
                您已打开新视频，暂停本视频播放
              </div>
            </div>
          )}
          {playendedStatus && (
            <div className={styles["alert-message"]}>
              {isLastpage && (
                <div
                  className={styles["alert-button"]}
                  onClick={() => navigate(`/course/${params.courseId}`)}
                >
                  恭喜你学完最后一节
                </div>
              )}
              {!isLastpage && (
                <div
                  className={styles["alert-button"]}
                  onClick={() => {
                    window.player && window.player.destroy();
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
  );
};

export default CoursePalyPage;
