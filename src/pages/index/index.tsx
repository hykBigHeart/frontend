import styles from "./index.module.scss";
import myLesoon from "../../assets/images/commen/icon-mylesoon.png";
import studyTime from "../../assets/images/commen/icon-studytime.png";

const IndexPage = () => {
  return (
    <>
      <div className={styles["top-cont"]}>
        <div className={styles["top-item"]}>
          <div className={styles["title"]}>
            <img className={styles["icon"]} src={myLesoon} />
            <span>我的课程</span>
          </div>
          <div className={styles["info"]}></div>
        </div>
        <div className={styles["top-item"]}>
          <div className={styles["title"]}>
            <img className={styles["icon"]} src={studyTime} />
            <span>学习时长</span>
          </div>
          <div className={styles["info"]}></div>
        </div>
      </div>
      我是首页
    </>
  );
};

export default IndexPage;
