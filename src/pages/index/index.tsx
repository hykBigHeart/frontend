import { useEffect, useState } from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { user } from "../../api/index";
import styles from "./index.module.scss";
import { AnyIfEmpty, useSelector } from "react-redux";
import { CoursesModel } from "./compenents/courses-model";
import myLesoon from "../../assets/images/commen/icon-mylesoon.png";
import studyTime from "../../assets/images/commen/icon-studytime.png";

const IndexPage = () => {
  const [tabKey, setTabKey] = useState(0);
  const [coursesList, setCoursesList] = useState<any>([]);

  const departments = useSelector(
    (state: any) => state.loginUser.value.departments
  );

  useEffect(() => {
    getData();
  }, [departments]);

  const getData = () => {
    user.courses(departments[0].id).then((res: any) => {
      setCoursesList(res.data.courses);
      console.log(res.data.courses);
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
              必修课：已完成 <strong>3 </strong>/ 10
            </div>
            <div className={styles["info-item"]}>
              选修课：已完成 <strong>3 </strong>/ 10
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
              今日：<strong>1</strong> 小时 <strong>23</strong> 分钟
            </div>
            <div className={styles["info-item"]}>
              累计：<strong>24</strong> 小时 <strong>33</strong> 分钟
            </div>
          </div>
        </div>
      </div>
      <div className={styles["tabs"]}>
        <Tabs defaultActiveKey="0" items={items} onChange={onChange} />
      </div>
      {coursesList.length === 0 && <span>暂无数据</span>}
      {coursesList.length > 0 && (
        <div className={styles["courses-list"]}>
          {coursesList.map((item: any) => (
            <div key={item.id}>
              <CoursesModel
                title={item.title}
                thumb={item.thumb}
                isRequired={item.isRequired}
                progress={30}
              ></CoursesModel>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default IndexPage;
