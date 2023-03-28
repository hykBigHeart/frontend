import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./hour.module.scss";
import { durationFormat } from "../../../utils/index";
import { VideoModel } from "./video";

interface PropInterface {
  id: number;
  cid: number;
  title: string;
  duration: number;
  record: any;
  progress: number;
  totalHours: any;
  onChange: () => void;
}

export const HourCompenent: React.FC<PropInterface> = ({
  id,
  cid,
  title,
  duration,
  record,
  progress,
  totalHours,
  onChange,
}) => {
  // const navigate = useNavigate();
  const [visible, setVisible] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState(id);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [isLastpage, setIsLastpage] = useState<boolean>(false);

  useEffect(() => {
    getData();
  }, [totalHours]);

  const getData = () => {
    const index = totalHours.findIndex((i: any) => i.id === id);
    if (index === totalHours.length - 1) {
      setIsLastpage(true);
    }
  };

  const goNextVideo = () => {
    const index = totalHours.findIndex((i: any) => i.id === id);
    if (index === totalHours.length - 1) {
      setIsLastpage(true);
    } else if (index < totalHours.length - 1) {
      setCurrentId(totalHours[index + 1].id);
      setCurrentTitle(totalHours[index + 1].title);
      if (index + 1 === totalHours.length - 1) {
        setIsLastpage(true);
      }
    }
    setVisible(true);
  };

  return (
    <>
      <VideoModel
        cid={cid}
        id={currentId}
        title={currentTitle}
        open={visible}
        isLastpage={isLastpage}
        onCancel={() => {
          setVisible(false);
          onChange();
        }}
        goNextVideo={() => {
          setVisible(false);
          goNextVideo();
        }}
      ></VideoModel>
      <div
        className={styles["item"]}
        onClick={() => {
          setVisible(true);
        }}
      >
        <div className={styles["left-item"]}>
          <i className="iconfont icon-icon-video"></i>
          <div className={styles["title"]}>
            {title}({durationFormat(Number(duration))})
          </div>
        </div>
        <div className="d-flex">
          {progress >= 0 && progress < 100 && (
            <>
              {progress === 0 && <div className={styles["link"]}>开始学习</div>}
              {progress !== 0 && (
                <>
                  <div className={styles["record"]}>
                    上次学习到
                    {durationFormat(Number(record.finished_duration || 0))}
                  </div>
                  <div className={styles["link"]}>继续学习</div>
                </>
              )}
            </>
          )}
          {progress >= 100 && <div className={styles["complete"]}>已学完</div>}
        </div>
      </div>
    </>
  );
};
