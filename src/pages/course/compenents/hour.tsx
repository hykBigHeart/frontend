import React, { useState } from "react";
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

  const getPdfUrl = () => {
    Course.pdfOnlineUrl(Number(cid), Number(id)).then(
      (res: any) => {
        setUrl(res.data.url)
        setPdfPreviewVisible(true)
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

      <PdfPreviewDialog title={title} src={url} open={pdfPreviewVisible}  onCancel={() => setPdfPreviewVisible(false)}></PdfPreviewDialog>
    </>
  );
};
