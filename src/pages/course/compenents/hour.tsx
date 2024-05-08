import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./hour.module.scss";
import { course as Course } from "../../../api/index";
import { durationFormat } from "../../../utils/index";
import { PdfPreviewDialog } from "./pdf-preview-dialog";

interface PropInterface {
  id: number;
  cid: number;
  title: string;
  duration: number;
  record: any;
  progress: number;
  source: string;
  period: number
}

export const HourCompenent: React.FC<PropInterface> = ({
  id,
  cid,
  title,
  duration,
  record,
  progress,
  source,
  period
}) => {
  const navigate = useNavigate();
  const [pdfPreviewVisible, setPdfPreviewVisible] = useState(false);
  const [url, setUrl] = useState("");
  const [finishedDuration, setFinishedDuration] = useState(0);
  const minimumLearningTime = useRef(0)

  const getPdfUrl = () => {
    Course.pdfOnlineUrl(Number(cid), Number(id)).then(
      (res: any) => {
        setUrl(res.data.url)        
        minimumLearningTime.current = Date.now() + period * 60 * 1000 - res.data.finished_duration * 1000
        setFinishedDuration(res.data.finished_duration)
        setPdfPreviewVisible(true)
        document.title = title
      }
    );
  };

  return (
    <>
      <div
        className={styles["item"]}
        style={{cursor: source === "personal" ? 'pointer' : 'auto', pointerEvents: source === "personal" ? 'unset' : 'none'}}
        onClick={() => {
          if (source === 'personal') {
            if (!duration) getPdfUrl()
            else navigate(`/course/${cid}/hour/${id}`);
          }
        }}
      >
        <div className={styles["left-item"]}>
          <i className={duration ? "iconfont icon-icon-video" : 'iconfont icon-icon-file'}></i>
          <div className={styles["title"]}>
            {title}{duration ? `(${durationFormat(Number(duration))})` : ''}
          </div>
        </div>
        <div className="d-flex">
          {source === "personal" && progress >= 0 && progress < 100 && (
            <>
              {progress === 0 && <div className={styles["link"]}>开始学习</div>}
              {progress !== 0 && (
                <>
                  <div className={styles["record"]}>
                    上次学习到
                    {durationFormat(Number(record.finished_duration || 0))}
                  </div>
                  <div className={styles["link"]}>继续学习</div>
                </>
              )}
            </>
          )}
          {source === "personal" && progress >= 100 && <div className={styles["complete"]}>已学完</div>}

          { source === "learning" && <div className={styles["link"]} style={{cursor: 'auto'}}>{ period + '分钟' }</div> }
        </div>
      </div>

      {
        pdfPreviewVisible  &&
        (<PdfPreviewDialog title={title} src={url} courseId={cid} itemId={id} period={period} finishedDuration={finishedDuration} minimumLearningTime={minimumLearningTime} progress={progress} open={pdfPreviewVisible}  onCancel={() => {  setPdfPreviewVisible(false) }}></PdfPreviewDialog>)
      }
    </>
  );
};
