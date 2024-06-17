import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Pagination, Spin, Empty, Tag } from 'antd';
import type { PaginationProps } from 'antd';
import { user, course } from "../../api/index";
import styles from "./index.module.scss";
import { CoursesModel } from "../personal-center/compenents/courses-model";

type LearnCourseRecordsModel = {
  [key: number]: CourseRecordModel;
};

const LearningCenter = () => {
  document.title = "学习中心";
  const userInfo = useSelector((state: any) => state.loginUser.value);

  const [loading, setLoading] = useState<boolean>(false);
  useState<LearnCourseRecordsModel>({});
  const [coursesList, setCoursesList] = useState<CourseModel[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(9)
  const [total, setTotal] = useState(0)

  // Label related
  const [isWhole, setIsWhole] = useState(true);
  const [isRecently, setIsRecently] = useState(false);
  // const tagsData = ['Movies', 'Books', 'Music', 'Sports', 'Movies1', 'Books1', 'Music1', 'Sports1','Movies2', 'Books2', 'Music2', 'Sports2','Movies3', 'Books3', 'Music3', 'Sports3','Movies4',];
  const [tagsData, setTagsData] = useState([])
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const tagsContainerRef = useRef<HTMLDivElement>(null);
  const [showToggle, setShowToggle] = useState(false);

  useEffect(() => {
    if (userInfo.searchValue) setPage(1)
    getData();
  }, [userInfo.searchValue, page, size, selectedTags]);

  const getData = () => {
    setLoading(true);
    user.AllCourses(userInfo.user.id, userInfo.searchValue, page, size, selectedTags.join(), isRecently).then((res: any) => {
      setCoursesList(res.data.data);
      setTotal(res.data.total)
      setLoading(false);

      //  超出两行 显示“展开、收起”按钮
      const container = tagsContainerRef.current;
      if (container) {
        const tagHeight = container.firstElementChild?.clientHeight || 0;
        const containerHeight = container.scrollHeight;
        const lines = Math.floor(containerHeight / tagHeight);
        setShowToggle(lines > 2)
      }
    });

    course.getAllLabels().then((res: any)=> {
      setTagsData(res.data.labels[0])
    })
  };

  const onChange: PaginationProps['onChange'] = (page, size) => {
    setPage(page)
    setSize(size)
  };

  const handleChange = (tag: any, checked: boolean) => {
    setIsWhole(false)
    setIsRecently(false)
    setPage(1)
    //  多选标签
    // const nextSelectedTags = checked
    //   ? [...selectedTags, tag]
    //   : selectedTags.filter((t) => t !== tag);

    // 单选标签
    const nextSelectedTags = checked ? [tag.id] : [tag.id]
    setSelectedTags(nextSelectedTags);
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {loading && (
        <div style={{position: 'absolute', top: '50%', left: 0, right: 0}}>
          <Spin size="large" />
        </div>
      )}

      <div className={styles["label-list"]}>
        <div className={styles["left"]}>
          {/* <Tag.CheckableTag key={'全部'} checked={isWhole} onChange={(checked: any) => { setIsWhole(true); setSelectedTags([]); setIsRecently(false) }} ><span className={styles["label-text"]}>全部</span></Tag.CheckableTag>
          <Tag.CheckableTag key={'最近课程'} checked={isRecently} onChange={(checked: any) => { setIsRecently(true); setSelectedTags([]); setIsWhole(false) }} ><span className={styles["label-text"]}>最新课程</span></Tag.CheckableTag> */}
        </div>
        <div ref={tagsContainerRef} className={ styles["right"] + ' ' + (isExpanded ? styles["expanded"] : '' )}>    
          <Tag.CheckableTag key={'全部'} checked={isWhole} onChange={(checked: any) => { setIsWhole(true); setSelectedTags([]); setIsRecently(false); setPage(1) }} ><span className={styles["label-text"]}>全部</span></Tag.CheckableTag>
          <Tag.CheckableTag key={'最近课程'} checked={isRecently} onChange={(checked: any) => { setIsRecently(true); setSelectedTags([]); setIsWhole(false); setPage(1) }} ><span className={styles["label-text"]}>最新课程</span></Tag.CheckableTag>
          {tagsData.map<React.ReactNode>((tag: any) => (
            <Tag.CheckableTag
              key={tag.id}
              checked={selectedTags.includes(tag.id)}
              onChange={(checked: any) => handleChange(tag, checked)}
            >
              <span className={styles["label-text"]}>{tag.name}</span>
            </Tag.CheckableTag>
          ))}

          { showToggle && ( <div className={styles.showMore} onClick={handleToggle}>{isExpanded ? '收起∧' : '展开∨'}</div> ) }
        </div>
      </div>

      <div className={styles["courses-list"]}>
        {coursesList.map((item: any) => (
          <div key={item.id}>
            <CoursesModel
              id={item.id}
              title={item.title}
              thumb={item.thumb}
              isRequired={item.is_required}
              progress={0}
              source={"learning"}
              needDeleteBtn={false}
              onCancel={()=> {}}
            ></CoursesModel>
          </div>
        ))}
      </div>
      {!coursesList.length && !loading && (
        <div style={{height:`calc(100vh - 100%)`, display: 'flex', justifyContent: 'center', boxSizing: 'border-box', paddingTop: 180}} >
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
        </div>
      ) }
      
      {coursesList.length ? 
        <Pagination current={page} pageSize={size} pageSizeOptions={[9, 18, 45, 90]} onChange={onChange} showSizeChanger={true} total={total} style={{marginTop: 10}} />
        : 
        ''
      }
    </>
  );
};

export default LearningCenter;
