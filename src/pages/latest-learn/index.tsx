import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { course } from "../../api/index";
import { Row, Col, Empty, Spin, Image, Progress } from "antd";
import mediaIcon from "../../assets/images/commen/icon-medal.png";
import { useNavigate } from "react-router-dom";

const LatestLearnPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [courses, setCourses] = useState<any>([]);

  useEffect(() => {
    getCourses();
  }, []);

  const getCourses = () => {
    setLoading(true);
    course.latestLearn().then((res: any) => {
      setCourses(res.data);
      setLoading(false);
    });
  };

  return (
    <div>
      <div className={styles["content"]}>
        <Row style={{ width: 1200 }}>
          {loading && (
            <div className="float-left d-j-flex mt-50">
              <Spin size="large" />
            </div>
          )}
          {courses.length === 0 && (
            <Col span={24}>
              <Empty description="暂无记录" />
            </Col>
          )}
        </Row>
        {courses.length > 0 &&
          courses.map((item: any) => (
            <div
              key={item.course.id}
              className={styles["item"]}
              onClick={() => {
                navigate(`/course/${item.course.id}`);
              }}
            >
              <Image
                src={item.course.thumb}
                width={120}
                height={90}
                style={{ borderRadius: 10 }}
                preview={false}
              />
              <div className={styles["item-info"]}>
                <div className={styles["top"]}>
                  {item.course.is_required === 1 && (
                    <div className={styles["type"]}>必修课</div>
                  )}
                  {item.course.is_required === 0 && (
                    <div className={styles["active-type"]}>选修课</div>
                  )}
                  <div className={styles["title"]}>{item.course.title}</div>
                </div>
                {item.record && (
                  <>
                    <div className={styles["record"]}>
                      上次学到：{item.record.finished_count}/
                      {item.record.hour_count}课时
                    </div>
                    <div className={styles["progress"]}>
                      {item.record.progress < 10000 && (
                        <Progress
                          percent={item.record.progress / 100}
                          strokeColor="#FF4D4F"
                          trailColor="#F6F6F6"
                        />
                      )}
                      {item.record.progress >= 10000 && (
                        <>
                          <Image
                            width={24}
                            height={24}
                            src={mediaIcon}
                            preview={false}
                          />
                          <span className={styles["tip"]}>
                            恭喜你学完此套课程!
                          </span>
                        </>
                      )}
                    </div>
                  </>
                )}
                {!item.record && (
                  <>
                    <div className={styles["record"]}></div>
                    <div className={styles["progress"]}>
                      <Progress
                        percent={1}
                        strokeColor="#FF4D4F"
                        trailColor="#F6F6F6"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
      </div>
      <div className={styles["extra"]}>~莫道桑榆晚，为霞尚满天~</div>
    </div>
  );
};

export default LatestLearnPage;
