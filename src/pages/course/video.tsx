import { useEffect, useRef, useState } from "react";
import styles from "./video.module.scss";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { course as Course } from "../../api/index";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { message } from "antd";

declare const window: any;

const CoursePalyPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const systemConfig = useSelector((state: any) => state.systemConfig.value);
  const user = useSelector((state: any) => state.loginUser.value.user);
  const [playUrl, setPlayUrl] = useState<string>("");
  const [playDuration, setPlayDuration] = useState(0);
  const [playendedStatus, setPlayendedStatus] = useState<Boolean>(false);
  const [lastSeeValue, setLastSeeValue] = useState({});
  const [course, setCourse] = useState<any>({});
  const [hour, setHour] = useState<any>({});
  const [loading, setLoading] = useState<Boolean>(false);
  const [isLastpage, setIsLastpage] = useState<Boolean>(false);
  const [totalHours, setTotalHours] = useState<any>([]);
  const myRef = useRef(0);

  useEffect(() => {
    getCourse();
    getDetail();
  }, [params.courseId, params.hourId]);

  useEffect(() => {
    myRef.current = playDuration;
  }, [playDuration]);

  const getCourse = () => {
    Course.detail(Number(params.courseId)).then((res: any) => {
      let totalHours: any = [];
      if (res.data.chapters.length === 0) {
        setTotalHours(res.data.hours[0]);
        totalHours = res.data.hours[0];
      } else if (res.data.chapters.length > 0) {
        const arr: any = [];
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
        let record = res.data.user_hour_record;
        let params = null;
        if (record && record.finished_duration && record.is_finished === 0) {
          params = {
            time: 5,
            pos: record.finished_duration,
          };
          setLastSeeValue(params);
          setLastSeeValue(params);
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
        initDPlayer(res.data.url, 0, data);
      }
    );
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
      Course.record(
        Number(params.courseId),
        Number(params.hourId),
        duration
      ).then((res: any) => {});
      Course.playPing(Number(params.courseId), Number(params.hourId)).then(
        (res: any) => {}
      );
    }
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

  return (
    <div className={styles["video-mask"]}>
      <div className={styles["top-cont"]}>
        <div className={styles["box"]}>
          <div
            className={styles["close-btn"]}
            onClick={() => {
              window.player && window.player.destroy();
              navigate(-1);
            }}
          >
            <ArrowLeftOutlined />
            <span className="ml-14">返回</span>
          </div>
        </div>
      </div>
      <div className={styles["video-body"]}>
        <div className={styles["video-title"]}>{hour.title}</div>
        <div className={styles["video-box"]}>
          <div className="play-box" id="meedu-player-container"></div>
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
