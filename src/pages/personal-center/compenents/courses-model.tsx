import React, { useState, useEffect } from "react";
import { Image, Progress } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./courses-model.module.scss";
import mediaIcon from "../../../assets/images/commen/icon-medal.png";

interface PropInterface {
  id: number;
  title: string;
  thumb: string;
  isRequired: number;
  progress: number;
  source: string
}

export const CoursesModel: React.FC<PropInterface> = ({
  id,
  title,
  thumb,
  isRequired,
  progress,
  source
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={styles["item"]}
      style={{height: source === 'personal' ? 186 : 240, padding: source === 'personal' ? 24 : 0}}
      onClick={() => {
        navigate(`/course/${id}/${source}`);
      }}
    >
      <div className={styles["top-content"]} style={{display: source === 'personal' ? 'flex' : 'block'}}>
        <Image
          loading="lazy"
          width={source === 'personal' ? 120 : '100%'}
          height={source === 'personal' ? 90 : 190}
          style={{ borderRadius: source === 'personal' ? 10 : '10px 10px 0 0' }}
          src={thumb}
          preview={false}
        />
        <div className={styles["info"]}>
          <div className={source === 'personal' ? styles["title"] : styles["title"] + ' ' +  styles["learning-center-title"]}>{title}</div>
          {source === 'personal' && isRequired === 1 && <div className={styles["type"]}>必修课</div>}
          {source === 'personal' && isRequired === 0 && (
            <div className={styles["active-type"]}>选修课</div>
          )}
        </div>
      </div>
      {source === 'personal' && (
        <div className={styles["status-content"]}>
          {progress == 0 && (
            <>
              <Progress
                style={{ width: 270 }}
                percent={0}
                strokeColor="#2B74EA"
                trailColor="#F6F6F6"
                showInfo={false}
              />
              <span>未学习</span>
            </>
          )}
          {progress > 0 && progress < 100 && (
            <Progress
              percent={progress}
              strokeColor="#2B74EA"
              trailColor="#F6F6F6"
            />
          )}
          {progress >= 100 && (
            <div className={styles["success"]}>
              <Image
                loading="lazy"
                width={24}
                height={24}
                src={mediaIcon}
                preview={false}
              />
              <span className="ml-8">恭喜你学完此课程!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
