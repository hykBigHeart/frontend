import { useEffect, useState } from "react";
import { Row, Col, Empty, Spin, Tabs } from "antd";
import type { TabsProps } from "antd";
import { user } from "../../api/index";
import styles from "./index.module.scss";
import { useSelector } from "react-redux";
import { CoursesModel } from "./compenents/courses-model";
import myLesoon from "../../assets/images/commen/icon-mylesoon.png";
import studyTime from "../../assets/images/commen/icon-studytime.png";
import { studyTimeFormat } from "../../utils/index";

const IndexPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [tabKey, setTabKey] = useState(0);
  const [coursesList, setCoursesList] = useState<any>([]);
  const [learnCourseRecords, setLearnCourseRecords] = useState<any>({});
  const [stats, setStats] = useState<any>({});

  const departments = useSelector(
    (state: any) => state.loginUser.value.departments
  );
  const currentDepId = useSelector(
    (state: any) => state.loginUser.value.currentDepId
  );

  useEffect(() => {
    getData();
  }, [tabKey, currentDepId]);

  const getData = () => {
    setLoading(true);
    user.courses(currentDepId).then((res: any) => {
      const records = res.data.learn_course_records;
      setStats(res.data.stats);
      setLearnCourseRecords(records);
      if (tabKey === 0) {
        setCoursesList(res.data.courses);
      } else if (tabKey === 1) {
        const arr: any = [];
        res.data.courses.map((item: any) => {
          if (item.is_required === 1) {
            arr.push(item);
          }
        });
        setCoursesList(arr);
      } else if (tabKey === 2) {
        const arr: any = [];
        res.data.courses.map((item: any) => {
          if (item.is_required === 0) {
            arr.push(item);
          }
        });
        setCoursesList(arr);
      } else if (tabKey === 3) {
        const arr: any = [];
        res.data.courses.map((item: any) => {
          if (records[item.id] && records[item.id].progress === 100) {
            arr.push(item);
          }
        });
        setCoursesList(arr);
      } else if (tabKey === 4) {
        const arr: any = [];
        res.data.courses.map((item: any) => {
          if (
            !records[item.id] ||
            (records[item.id] && records[item.id].progress !== 100)
          ) {
            arr.push(item);
          }
        });
        setCoursesList(arr);
      }
      setLoading(false);
    });
  };

  const items: TabsProps["items"] = [
    {
      key: "0",
      label: `全部`,
    },
    {
      key: "1",
      label: `必修课`,
    },
    {
      key: "2",
      label: `选修课`,
    },
    {
      key: "3",
      label: `已学完`,
    },
    {
      key: "4",
      label: `未学完`,
    },
  ];

  const onChange = (key: string) => {
    setTabKey(Number(key));
  };

  return (
    <>
      <div className={styles["top-cont"]}>
        <div className={styles["top-item"]}>
          <div className={styles["title"]}>
            <img className={styles["icon"]} src={myLesoon} />
            <span>我的课程</span>
          </div>
          <div className={styles["info"]}>
            <div className={styles["info-item"]}>
              <span>必修课：已完成</span>
              <strong> {stats.required_finished_hour_count} </strong>
              <span>/ {stats.required_hour_count}</span>
            </div>
            <div className={styles["info-item"]}>
              <span>选修课：已完成</span>
              <strong> {stats.nun_required_finished_hour_count} </strong>
              <span>/ {stats.nun_required_hour_count}</span>
            </div>
          </div>
        </div>
        <div className={styles["top-item"]}>
          <div className={styles["title"]}>
            <img className={styles["icon"]} src={studyTime} />
            <span>学习时长</span>
          </div>
          <div className={styles["info"]}>
            <div className={styles["info-item"]}>
              今日：
              {studyTimeFormat(stats.today_learn_duration)[0] !== 0 && (
                <>
                  <strong>
                    {" "}
                    {studyTimeFormat(stats.today_learn_duration)[0]}{" "}
                  </strong>
                  天
                </>
              )}
              <strong>
                {" "}
                {studyTimeFormat(stats.today_learn_duration)[1]}{" "}
              </strong>
              小时
              <strong>
                {" "}
                {studyTimeFormat(stats.today_learn_duration)[2]}{" "}
              </strong>
              分钟
            </div>
            <div className={styles["info-item"]}>
              累计：
              {studyTimeFormat(stats.learn_duration)[0] !== 0 && (
                <>
                  <strong>
                    {" "}
                    {studyTimeFormat(stats.learn_duration || 0)[0]}{" "}
                  </strong>
                  天
                </>
              )}
              <strong> {studyTimeFormat(stats.learn_duration || 0)[1]} </strong>
              小时
              <strong> {studyTimeFormat(stats.learn_duration || 0)[2]} </strong>
              分钟
            </div>
          </div>
        </div>
      </div>
      <div className={styles["tabs"]}>
        <Tabs defaultActiveKey="0" items={items} onChange={onChange} />
      </div>
      <Row style={{ width: 1200, margin: "0 auto", paddingTop: 14 }}>
        {loading && (
          <div className="float-left d-j-flex mt-50">
            <Spin size="large" />
          </div>
        )}
        {coursesList.length === 0 && (
          <Col span={24}>
            <Empty description="暂无课程" />
          </Col>
        )}
      </Row>
      {coursesList.length > 0 && (
        <div className={styles["courses-list"]}>
          {coursesList.map((item: any) => (
            <div key={item.id}>
              {learnCourseRecords[item.id] && (
                <CoursesModel
                  id={item.id}
                  title={item.title}
                  thumb={item.thumb}
                  isRequired={item.is_required}
                  progress={learnCourseRecords[item.id].progress}
                ></CoursesModel>
              )}
              {!learnCourseRecords[item.id] && (
                <CoursesModel
                  id={item.id}
                  title={item.title}
                  thumb={item.thumb}
                  isRequired={item.is_required}
                  progress={0}
                ></CoursesModel>
              )}
            </div>
          ))}
        </div>
      )}
      <div className={styles["extra"]}>~莫道桑榆晚，为霞尚满天~</div>
    </>
  );
};

export default IndexPage;
