import React, { useState } from "react";
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
  onChange: () => void;
}

export const HourCompenent: React.FC<PropInterface> = ({
  id,
  cid,
  title,
  duration,
  record,
  progress,
  onChange,
}) => {
  // const navigate = useNavigate();
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <div className={styles["item"]}>
      <VideoModel
        cid={cid}
        id={id}
        title={title}
        open={visible}
        onCancel={() => {
          setVisible(false);
          onChange();
        }}
      ></VideoModel>
      <div className={styles["left-item"]}>
        <i className="iconfont icon-icon-video"></i>
        <div className={styles["title"]}>
          {title}({durationFormat(Number(duration))})
        </div>
      </div>
      <div className="d-flex">
        {progress >= 0 && progress < 100 && (
          <>
            {progress === 0 && (
              <div
                className={styles["link"]}
                onClick={() => {
                  setVisible(true);
                }}
              >
                开始学习
              </div>
            )}
            {progress !== 0 && (
              <>
                <div className={styles["record"]}>
                  上次学习到
                  {durationFormat(Number(record.finished_duration || 0))}
                </div>
                <div
                  className={styles["link"]}
                  onClick={() => {
                    setVisible(true);
                  }}
                >
                  继续学习
                </div>
              </>
            )}
          </>
        )}
        {progress >= 100 && (
          <div
            className={styles["complete"]}
            onClick={() => {
              setVisible(true);
            }}
          >
            已学完
          </div>
        )}
      </div>
    </div>
  );
};
