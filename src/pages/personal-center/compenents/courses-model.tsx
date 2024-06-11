import React, { useState, useEffect } from "react";
import { Image, Progress, Popconfirm, message } from "antd";
import type { PopconfirmProps } from 'antd';
import { useNavigate } from "react-router-dom";
import { CloseOutlined } from '@ant-design/icons';
import { course } from "../../../api/index";
import styles from "./courses-model.module.scss";
import mediaIcon from "../../../assets/images/commen/icon-medal.png";

interface PropInterface {
  id: number;
  title: string;
  thumb: string;
  isRequired: number;
  progress: number;
  source: string;
  needDeleteBtn: boolean;
  onCancel: () => void
}

export const CoursesModel: React.FC<PropInterface> = ({
  id,
  title,
  thumb,
  isRequired,
  progress,
  source,
  needDeleteBtn,
  onCancel
}) => {
  const navigate = useNavigate();

  const confirm: PopconfirmProps['onConfirm'] = (e) => {
    course.deleteElectiveCoursesApi(id).then((res: any)=> {
      message.success('删除成功');
      onCancel()
    })

    e?.stopPropagation()
  };
  
  const cancel: PopconfirmProps['onCancel'] = (e) => {
    e?.stopPropagation()
  };

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
        <div className={styles["info"]} style={{width: source === 'personal' ? 192 : '100%' }}>
          <div className={source === 'personal' ? styles["title"] : styles["title"] + ' ' +  styles["learning-center-title"]} title={title}>{title}</div>
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

      {
        needDeleteBtn ? 
          <Popconfirm title="删除提示" description="确定要删除这个课程吗?" onConfirm={confirm} onCancel={cancel} okText="确认" cancelText="取消" onPopupClick={(e)=> { e.stopPropagation() }} >
            <CloseOutlined className={styles['delete-btn']} style={{ position: 'absolute', top: 10, right: 10 }} onClick={(e)=> { e.stopPropagation() }} />
          </Popconfirm>
        : ''
      }
    </div>
  );
};
