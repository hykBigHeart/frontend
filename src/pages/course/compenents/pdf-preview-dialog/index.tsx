import React, { useState, useEffect, useRef, RefObject } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Divider, Modal, Statistic } from "antd";
import type { CountdownProps } from 'antd';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import Draggable from 'react-draggable';
import { FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";
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

  // 拖动弹窗需要的变量
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const draggleRef = useRef<HTMLDivElement>(null);
  const [modalWidth, setModalWidth] = useState("1200px");
  // 为了触发渲染机制
  const [key, setKey] = useState(0);

  // resize后弹窗的实际“用户”可见尺寸
  const realWidth = useRef(0);
  const realHeight = useRef(0);

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

  // 使用 useEffect 监控 key 的变化，并在重新渲染后设置高度
  useEffect(() => {
    if (draggleRef.current) {
      const modalElement = draggleRef.current.children[0] as HTMLElement;
      if (modalElement) {
        modalElement.style.height = modalWidth === '1200px' ? '90vh' : '100vh';
      }
    }

    // 从这里开始都是监听resize的事件和处理方法
    const handleResize = (entries: ResizeObserverEntry[]) => {
      // 在这里处理大小变化后的逻辑
      for (let entry of entries) {
        // 拿到实际可视元素数据
        // console.log('entry', entry);
        const targetMargins = entry.target.getBoundingClientRect()
        // console.log('targetMargins', targetMargins);
        realWidth.current = targetMargins.width
        realHeight.current = targetMargins.height
        
        // Ensure the modal is fully visible
        if (targetMargins.top <= 0) {
          setModalPosition((prevPosition) => {
            // console.log('prevPosition', prevPosition);
            const newPosition = {
              x: prevPosition.x,
              y: -(window.innerHeight - realHeight.current) / 2,
            };
            return newPosition;
          });
        }  
        
        // 当元素大小占满可视区域了（全屏展示）
        if (targetMargins.width >= window.innerWidth && targetMargins.height >= window.innerHeight) {
          setModalWidth('100vw')
          setModalPosition({ x: 0, y: 0 });
        } else {
          setModalWidth('1200px') 
        }
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    
    if (draggleRef.current) {
      let realityElement = draggleRef.current.children[0] as HTMLElement
      resizeObserver.observe(realityElement);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [key]);

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
      <div className="custom-title" style={{cursor: 'move'}} onMouseOver={() => { if (disabled) setDisabled(false); }} onMouseOut={() => { setDisabled(true); }} >{title}</div>
      { !finished && progress < 100 ?
        <div className="count-down-box">
          您还需学习&emsp;
          <Countdown value={minimumLearningTime.current as number} format="m 分 s 秒" valueStyle={{color: 'red'}} onFinish={onFinish} />
        </div>
        :
        <div style={{display: 'flex', alignItems: 'center', height: 37.7}}>您已完成学时</div>
      }
      {
        modalWidth === '1200px' ?
        <FullscreenOutlined style={{cursor: 'pointer', position: 'absolute', right: 60}} onClick={()=> {
          // 更新 key 属性以触发重新渲染
          setKey((prevKey) => prevKey + 1);
          setModalWidth('100vw')
          setModalPosition({ x: 0, y: 0 });
        }} />
        :
        <FullscreenExitOutlined style={{cursor: 'pointer', position: 'absolute', right: 60}} onClick={()=> {
          // 更新 key 属性以触发重新渲染
          setKey((prevKey) => prevKey + 1);
          setModalWidth('1200px')
        }} />
      }

    </>
  )

  const onFinish: CountdownProps['onFinish'] = () => {
    console.log('finished!');
    setFinished(true)
  };

  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    
    if (!targetRect) {
      return;
    }

    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x) + (targetRect.width - realWidth.current),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
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
          width={modalWidth}
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
          
          // 弹窗拖动
          modalRender={(modal) => (
            <Draggable
              key={key}
              disabled={disabled}
              bounds={bounds}
              nodeRef={draggleRef}
              onStart={(event, uiData) => onStart(event, uiData)}
              position={modalPosition}
              onStop={(e, data) => {
                setModalPosition({ x: data.x, y: data.y });
              }}
            >
              <div ref={draggleRef}>{modal}</div>
            </Draggable>
          )}

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
