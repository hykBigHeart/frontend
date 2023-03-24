import React, { useState, useEffect } from "react";
import { Image, Progress } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./hour.module.scss";
import mediaIcon from "../../../assets/images/commen/icon-medal.png";
import { Navigate } from "react-router-dom";
import { durationFormat } from "../../../utils/index";

interface PropInterface {
  id: number;
  title: string;
  duration: number;
  record: any;
  progress: number;
}

export const HourCompenent: React.FC<PropInterface> = ({
  id,
  title,
  duration,
  record,
  progress,
}) => {
  const navigate = useNavigate();
  return (
    <div className={styles["item"]}>
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
                  navigate(`/course/play/${id}`);
                }}
              >
                开始学习
              </div>
            )}
            {progress !== 0 && (
              <>
                <div className={styles["record"]}>
                  上次学习到{durationFormat(Number(duration))}
                </div>
                <div
                  className={styles["link"]}
                  onClick={() => {
                    navigate(`/course/play/${id}`);
                  }}
                >
                  继续学习
                </div>
              </>
            )}
          </>
        )}
        {progress === 100 && <div className={styles["complete"]}>已学完</div>}
      </div>
    </div>
  );
};
