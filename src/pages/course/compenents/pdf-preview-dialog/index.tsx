import React, { useState, useEffect, useRef, RefObject } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Divider, Modal, Statistic } from "antd";
import type { CountdownProps } from 'antd';
import { course as Course } from "../../../../api/index";
import "./pdf-preview-dialog.scss"

// Core viewer
import { Viewer, Worker} from '@react-pdf-viewer/core';
// Plugins
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// Import the localization file
import zh_CN from '@react-pdf-viewer/locales/lib/zh_CN.json';


interface PropInterface {
  title: string;
  src: string;
  courseId: number;
  itemId: number;
  period: number;
  finishedDuration: number;
  minimumLearningTime: RefObject<number>;
  progress: number;
  open: boolean;
  onCancel: () => void;
}

const { Countdown } = Statistic;

export const PdfPreviewDialog: React.FC<PropInterface> = ({ title, src, courseId, itemId, period, finishedDuration, minimumLearningTime, progress, open, onCancel }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Create new plugin instance
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [finished, setFinished] = useState(false);
  const intervalId = useRef<number>();
  const [playDuration, setPlayDuration] = useState(0);
  const myRef = useRef(0);

  useEffect(() => {
    myRef.current = playDuration
  }, [playDuration])

  // 从学习pdf页返回路由的话会触发，清除定时器操作
  useEffect(()=> {
    return () => {
      // console.log('pdf组件销毁需清除定时器');
      window.clearInterval(intervalId.current);
      Course.removePdfRecordLearning(courseId)
    }
  }, [location.pathname])

  useEffect(() => {
    if (period) {
      let s = 0
      intervalId.current = setInterval(() => {
        s++
        playTimeUpdate(s, false);
        if (finishedDuration + s >= period * 60) {
          console.log('学完了');
          playTimeUpdate(s, true);
          window.clearInterval(intervalId.current);
        }
      }, 1000);
    }
  }, [period]);

  const playTimeUpdate = (duration: number, isEnd: boolean) => {
    if (duration - myRef.current >= 10 || isEnd === true) {
      setPlayDuration(duration);
      Course.pdfRecord(
        Number(courseId),
        Number(itemId),
        finishedDuration + duration
      ).then((res: any) => {});
      Course.pdfPlayPing(Number(courseId), Number(itemId)).then(
        (res: any) => {}
      );
    }
  };
  
  const customHeader = ()=> (
    <>
      <div className="custom-title">{title}</div>
      { !finished && progress < 100 ?
        <div className="count-down-box">
          您还需学习&emsp;
          <Countdown value={minimumLearningTime.current as number} format="m 分 s 秒" valueStyle={{color: 'red'}} onFinish={onFinish} />
        </div>
        :
        <div style={{display: 'flex', alignItems: 'center', height: 37.7}}>您已完成学时</div>
      }
    </>
  )

  const onFinish: CountdownProps['onFinish'] = () => {
    console.log('finished!');
    setFinished(true)
  };

  return (
    <>
      {open ? (
        <Modal
          title={customHeader()}
          centered
          forceRender
          open={true}
          footer={null}
          width='100vw'
          className="pdf-dialog"
          style={{
            maxWidth: "100vw",
          }}
          styles={{header: {
            textAlign: "left",
            marginBottom: 0,
            padding: 10,
            backgroundColor: "rgb(41, 41, 41)",
            borderRadius: 0
          }}}
          maskClosable={false}
          onCancel={() => {onCancel(); window.clearInterval(intervalId.current); navigate(`/course/${courseId}/${'personal'}`, {replace: true}); Course.removePdfRecordLearning(courseId) }}
        >
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.4.456/build/pdf.worker.min.js">
            <div style={{ height: '100vh' }}>
              <Viewer 
              theme="dark"
              defaultScale={1}
              localization={zh_CN}
              plugins={[defaultLayoutPluginInstance]}
              fileUrl={src} 
              />
            </div>
          </Worker>
        </Modal>
        // ctrl + 滚轮可以实现放大，但是缩小的话会有问题
      ) : null}
    </>
  );
};
