import { useEffect, useState } from "react";
import { Row, Spin, Image, Progress, Button } from "antd";
import { useSelector } from "react-redux";
import styles from "./index.module.scss";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { course as Course } from "../../api/index";
import mediaIcon from "../../assets/images/commen/icon-medal.png";
import { HourCompenent } from "./compenents/hour";
import { Empty } from "../../compenents";
import iconRoute from "../../assets/images/commen/icon-route1.png";
import { PdfPreviewDialog } from "./compenents/pdf-preview-dialog";

type TabModel = {
  key: number;
  label: string;
};

type AttachModel = {
  id: number;
  course_id: number;
  rid: number;
  sort: number;
  title: string;
  type: string;
  url?: string;
};

type HoursModel = {
  [key: number]: HourModel[];
};

type ChapterModel = {
  course_id: number;
  created_at: string;
  id: number;
  name: string;
  sort: number;
  updated_at: string;
};

type LearnHourRecordsModel = {
  [key: number]: HourRecordModel;
};

const CoursePage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const result = new URLSearchParams(useLocation().search);
  const userInfo = useSelector((state: any) => state.loginUser.value);
  const [loading, setLoading] = useState<boolean>(true);
  const [course, setCourse] = useState<CourseModel | null>(null);
  const [chapters, setChapters] = useState<ChapterModel[]>([]);
  const [hours, setHours] = useState<HoursModel>({});
  const [learnRecord, setLearnRecord] = useState<CourseRecordModel | null>(
    null
  );
  const [learnHourRecord, setLearnHourRecord] = useState<LearnHourRecordsModel>(
    {}
  );
  const [tabKey, setTabKey] = useState(Number(result.get("tab") || 1));
  const [attachments, setAttachments] = useState<AttachModel[]>([]);
  const [items, setItems] = useState<TabModel[]>([]);

  const [pdfPreviewTitle, setPdfPreviewTitle] = useState('');
  const [pdfOrplaySrc, setpdfOrplaySrc] = useState('');
  const [pdfPreviewVisible, setPdfPreviewVisible] = useState(false);

  useEffect(() => {
    getDetail();
  }, [params]);

  const getDetail = () => {
    setLoading(true);
    Course.detail(Number(params.courseId))
      .then((res: any) => {
        document.title = res.data.course.title;
        setCourse(res.data.course);
        setChapters(res.data.chapters);
        if (res.data.chapters.length) {
          // 课时、附件需要一块展示
          for (let i in res.data.chapters) {
            for (let e = 0; e < res.data.attachments.length; e++) {
              if (res.data.attachments[e].chapter_id == res.data.chapters[i].id) {
                if (!res.data.hours[res.data.chapters[i].id]) {
                  res.data.hours[res.data.chapters[i].id] = []
                  res.data.hours[res.data.chapters[i].id].push(res.data.attachments[e])
                } else res.data.hours[res.data.chapters[i].id].push(res.data.attachments[e])
              }
            }
          }
        } else res.data.hours[0] = res.data.hours[0] === undefined ? (res.data.hours[0] = [], res.data.hours[0].concat(res.data.attachments)) : res.data.hours[0].concat(res.data.attachments)
        setHours(res.data.hours);
        if (res.data.learn_record) {
          setLearnRecord(res.data.learn_record);
        }
        if (res.data.learn_hour_records) {
          setLearnHourRecord(res.data.learn_hour_records);
        }
        let arr: AttachModel[] = res.data.attachments;
        let tabs: TabModel[] = [
          {
            key: 1,
            label: `课程目录`,
          },
        ];
        if (arr.length > 0 && false) {
          tabs.push({
            key: 2,
            label: `课程附件`,
          });
          setAttachments(arr);
        }
        setItems(tabs);

        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const onChange = (key: number) => {
    setTabKey(key);
    navigate("/course/" + params.courseId + "?tab=" + key);
  };

  const previewPdf = (row: any) => {
    console.log('row', row);
    setPdfPreviewVisible(true)
    setPdfPreviewTitle(row.title)
    setpdfOrplaySrc("http://1.119.195.93:39000/playedu/pdf/wrxjgC1ocPcUW4BH4ecW5QO8bfb99Py4.pdf")
  };

  const downLoadFile = (cid: number, id: number) => {
    Course.downloadAttachment(cid, id).then((res: any) => {
      window.open(res.data.download_url);
    });
  };

  return (
    <div className="container">
      {loading && (
        <Row
          style={{
            width: 1200,
            margin: "0 auto",
            paddingTop: 14,
            minHeight: 301,
          }}
        >
          <div className="float-left d-j-flex mt-50">
            <Spin size="large" />
          </div>
        </Row>
      )}
      {!loading && (
        <>
          <div className={styles["top-cont"]}>
            <div className="j-b-flex">
              <div className="d-flex">
                <Image
                  width={120}
                  height={90}
                  style={{ borderRadius: 10 }}
                  preview={false}
                  src={course?.thumb}
                />
                <div className={styles["info"]}>
                  <div className={styles["title"]}>{course?.title}</div>
                  <div style={{display: params.source === 'personal' ? 'flex' : 'none'}} className={styles["status"]}>
                    {course?.is_required === 1 && (
                      <div className={styles["type"]}>必修课</div>
                    )}
                    {course?.is_required === 0 && (
                      <div className={styles["active-type"]}>选修课</div>
                    )}
                    {learnRecord && learnRecord.progress / 100 >= 100 && (
                      <div className={styles["success"]}>
                        <Image
                          width={24}
                          height={24}
                          src={mediaIcon}
                          preview={false}
                        />
                        <span className="ml-8">恭喜你学完此课程!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {(!learnRecord ||
                (learnRecord && JSON.stringify(learnRecord) === "{}")) &&
                JSON.stringify(learnHourRecord) === "{}" && (
                  <>
                    {params.source === 'personal' ? 
                      <Progress
                        type="circle"
                        strokeColor="#2B74EA"
                        trailColor="#F6F6F6"
                        size={90}
                        strokeWidth={8}
                        percent={0}
                        format={(percent) => `${percent}%`}
                      />
                      :
                      <Button type="primary" size="large" onClick={()=> {
                        Course.recordLearning(Number(params.courseId), userInfo.user.id)
                        navigate(`/course/${params.courseId}/${'personal'}`)
                      } }>学习课程</Button>
                    }
                  </>
                )}
              {(!learnRecord ||
                (learnRecord && JSON.stringify(learnRecord) === "{}")) &&
                JSON.stringify(learnHourRecord) !== "{}" && (
                  <>
                    {params.source === 'personal' ? 
                      <Progress
                        type="circle"
                        strokeColor="#2B74EA"
                        trailColor="#F6F6F6"
                        size={90}
                        strokeWidth={8}
                        percent={1}
                        format={(percent) => `${percent}%`}
                      />
                      :
                      <Button type="primary" size="large" onClick={()=> {
                        Course.recordLearning(Number(params.courseId), userInfo.user.id)
                        navigate(`/course/${params.courseId}/${'personal'}`)
                      } }>学习课程</Button>
                    }
                  </>
                )}
              {learnRecord &&
                JSON.stringify(learnRecord) !== "{}" &&
                JSON.stringify(learnHourRecord) !== "{}" && (
                  <>
                    {params.source === 'personal' ? 
                      <Progress
                        type="circle"
                        strokeColor="#2B74EA"
                        trailColor="#F6F6F6"
                        size={90}
                        strokeWidth={8}
                        percent={Math.floor(learnRecord.progress / 100)}
                        format={(percent) => `${percent}%`}
                      />
                      :
                      <Button type="primary" size="large" onClick={()=> {
                        Course.recordLearning(Number(params.courseId), userInfo.user.id)
                        navigate(`/course/${params.courseId}/${'personal'}`)
                      } }>学习课程</Button>
                    }
                  </>
                )}
            </div>
            {course?.short_desc && (
              <div className={styles["desc"]}>{course.short_desc}</div>
            )}
          </div>
          <div className={styles["tabs"]}>
            {items.map((item: any) => (
              <div
                key={item.key}
                className={
                  item.key === tabKey
                    ? styles["tab-active-item"]
                    : styles["tab-item"]
                }
                onClick={() => {
                  onChange(item.key);
                }}
              >
                <div className={styles["tit"]}>{item.label}</div>
                {item.key === tabKey && (
                  <Image
                    className={styles["banner"]}
                    width={40}
                    height={8}
                    preview={false}
                    src={iconRoute}
                    style={{ marginTop: -16 }}
                  />
                )}
              </div>
            ))}
          </div>
          {tabKey === 1 && (
            <div className={styles["chapters-hours-cont"]}>
              {chapters.length === 0 && JSON.stringify(hours) === "{}" && (
                <Empty />
              )}
              {chapters.length === 0 && JSON.stringify(hours) !== "{}" && (
                <div className={styles["hours-list-box"]}>
                  {hours[0].map((item: any, index: number) => (
                    <div key={item.id} className={styles["hours-it"]}>
                      {learnHourRecord[item.id] && (
                        <HourCompenent
                          id={item.id}
                          cid={item.course_id}
                          title={item.title}
                          record={learnHourRecord[item.id]}
                          duration={item.duration}
                          progress={
                            (learnHourRecord[item.id].finished_duration * 100) /
                            learnHourRecord[item.id].total_duration
                          }
                          source={params.source as string}
                          period={item.period}
                        ></HourCompenent>
                      )}
                      {!learnHourRecord[item.id] && (
                        <HourCompenent
                          id={item.id}
                          cid={item.course_id}
                          title={item.title}
                          record={null}
                          duration={item.duration}
                          progress={0}
                          source={params.source as string}
                          period={item.period}
                        ></HourCompenent>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {chapters.length > 0 && JSON.stringify(hours) !== "{}" && (
                <div className={styles["hours-list-box"]}>
                  {chapters.map((item: any, index: number) => (
                    <div key={item.id} className={styles["chapter-it"]}>
                      <div className={styles["chapter-name"]}>{item.name}</div>
                      {hours[item.id] &&
                        hours[item.id].map((it: any, int: number) => (
                          <div key={it.id} className={styles["hours-it"]}>
                            {learnHourRecord[it.id] && (
                              <HourCompenent
                                id={it.id}
                                cid={item.course_id}
                                title={it.title}
                                record={learnHourRecord[it.id]}
                                duration={it.duration}
                                progress={
                                  (learnHourRecord[it.id].finished_duration *
                                    100) /
                                  learnHourRecord[it.id].total_duration
                                }
                                source={params.source as string}
                                period={it.period}
                              ></HourCompenent>
                            )}
                            {!learnHourRecord[it.id] && (
                              <HourCompenent
                                id={it.id}
                                cid={item.course_id}
                                title={it.title}
                                record={null}
                                duration={it.duration}
                                progress={0}
                                source={params.source as string}
                                period={it.period}
                              ></HourCompenent>
                            )}
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {tabKey === 2 && (
            <>
            <div className={styles["attachments-cont"]}>
              {attachments.map((item: any, index: number) => (
                <div key={index} className={styles["attachments-item"]}>
                  <div className={styles["left-cont"]}>
                    {/* icon-icon-file */}
                    {/* <i
                      className="iconfont icon-file-pdf"
                      style={{
                        fontSize: 16,
                        color: "rgba(0,0,0,0.3)",
                        marginRight: 10,
                      }}
                    /> */}
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref="#icon-wenjianleixing-biaozhuntu-PDFwendang"></use>
                    </svg>
                    <span className={styles["title"]}>
                      {item.title}.{item.ext}
                    </span>
                  </div>
                  <div className={styles["download"]} onClick={() => previewPdf(item)}>预览</div>
                  <div className="form-column"></div>
                  <div
                    className={styles["download"]}
                    onClick={() => downLoadFile(item.course_id, item.id)}
                  >
                    下载
                  </div>
                </div>
              ))}
            </div>

            <PdfPreviewDialog title={pdfPreviewTitle} period={0} src={pdfOrplaySrc} open={pdfPreviewVisible}  onCancel={() => setPdfPreviewVisible(false)}></PdfPreviewDialog>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CoursePage;
