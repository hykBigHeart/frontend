import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Pagination, Spin } from 'antd';
import type { PaginationProps } from 'antd';
import { user } from "../../api/index";
import styles from "./index.module.scss";
import { CoursesModel } from "../personal-center/compenents/courses-model";

type LearnCourseRecordsModel = {
  [key: number]: CourseRecordModel;
};

const LearningCenter = () => {
  const userInfo = useSelector((state: any) => state.loginUser.value);

  const [loading, setLoading] = useState<boolean>(false);
  useState<LearnCourseRecordsModel>({});
  const [coursesList, setCoursesList] = useState<CourseModel[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(9)

  useEffect(() => {
    getData();
  }, [userInfo.searchValue, page, size]);

  const getData = () => {
    setLoading(true);
    user.AllCourses(userInfo.user.id, userInfo.searchValue, page, size).then((res: any) => {
      setCoursesList(res.data.data);
      setLoading(false);
    });
  };

  const onChange: PaginationProps['onChange'] = (page, size) => {
    setPage(page)
    setSize(size)
  };


  return (
    <>
      {loading && (
        <div style={{position: 'absolute', top: '50%', left: 0, right: 0}}>
          <Spin size="large" />
        </div>
      )}
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
            ></CoursesModel>
          </div>
        ))}
      </div>

      <Pagination current={page} pageSize={size} pageSizeOptions={[9, 18, 45, 90]} onChange={onChange} showSizeChanger={true} total={7} style={{marginTop: 10}} />
    </>
  );
};

export default LearningCenter;
