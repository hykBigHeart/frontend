import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { course } from "../../api/index";
import { Row, Col, Empty, Spin, Image } from "antd";

const LatestLearnPage = () => {
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
        <Row style={{ width: 1200, margin: "0 auto", paddingTop: 50 }}>
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
      </div>
      <div className={styles["extra"]}>~莫道桑榆晚，为霞尚满天~</div>
    </div>
  );
};

export default LatestLearnPage;
