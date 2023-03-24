import { useEffect, useState } from "react";
import { Image, Progress } from "antd";
import styles from "./index.module.scss";
import { useParams } from "react-router-dom";
import { course as Course } from "../../api/index";
import mediaIcon from "../../assets/images/commen/icon-medal.png";
import { HourCompenent } from "./compenents/hour";

const CoursePage = () => {
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [course, setCourse] = useState<any>({});
  const [chapters, setChapters] = useState<any>([]);
  const [hours, setHours] = useState<any>({});
  const [learnRecord, setLearnRecord] = useState<any>({});
  const [learnHourRecord, setLearnHourRecord] = useState<any>({});
  const [progress, setprogresP] = useState(20);

  useEffect(() => {
    getDetail();
  }, [params.courseId]);

  const getDetail = () => {
    setLoading(true);
    Course.detail(Number(params.courseId)).then((res: any) => {
      setCourse(res.data.course);
      setChapters(res.data.chapters);
      setHours(res.data.hours);
      if (res.data.learn_record) {
        setLearnRecord(res.data.learn_record);
      }
      if (res.data.learn_hour_records) {
        setLearnHourRecord(res.data.learn_hour_records);
      }
      setLoading(false);
    });
  };

  return (
    <div className="container">
      <div className={styles["top-cont"]}>
        <div className="j-b-flex">
          <div className="d-flex">
            <Image
              width={120}
              height={90}
              style={{ borderRadius: 10 }}
              preview={false}
              src={course.thumb}
            />
            <div className={styles["info"]}>
              <div className={styles["title"]}>{course.title}</div>
              <div className={styles["status"]}>
                {course.is_required === 1 && (
                  <div className={styles["type"]}>必修课</div>
                )}
                {course.is_required === 0 && (
                  <div className={styles["active-type"]}>选修课</div>
                )}
                {progress === 100 && (
                  <div className={styles["success"]}>
                    <Image
                      width={24}
                      height={24}
                      src={mediaIcon}
                      preview={false}
                    />
                    <span className="ml-8">恭喜你学完此套课程!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Progress
            type="circle"
            strokeColor="#FF4D4F"
            trailColor="#F6F6F6"
            size={90}
            strokeWidth={8}
            percent={progress}
            format={(percent) => `${percent}%`}
          />
        </div>
        {course.short_desc && (
          <div className={styles["desc"]}>{course.short_desc}</div>
        )}
      </div>
      <div className={styles["chapters-hours-cont"]}>
        {chapters.length === 0 && JSON.stringify(hours) !== "{}" && (
          <div className={styles["hours-list-box"]}>
            {hours[0].map((item: any) => (
              <div key={item.id} className={styles["hours-it"]}>
                <HourCompenent
                  id={item.id}
                  title={item.title}
                  record={item.rid}
                  duration={item.duration}
                  progress={progress}
                ></HourCompenent>
              </div>
            ))}
          </div>
        )}
        {chapters.length > 0 && JSON.stringify(hours) !== "{}" && (
          <div className={styles["hours-list-box"]}>
            {chapters.map((item: any) => (
              <div key={item.id} className={styles["chapter-it"]}>
                <div className={styles["chapter-name"]}>{item.name}</div>
                {hours[item.id].map((it: any) => (
                  <div key={it.id} className={styles["hours-it"]}>
                    <HourCompenent
                      id={it.id}
                      title={it.title}
                      record={it.rid}
                      duration={it.duration}
                      progress={0}
                    ></HourCompenent>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePage;
