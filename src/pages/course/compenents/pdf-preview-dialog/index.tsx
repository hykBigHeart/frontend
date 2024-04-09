import React, { useState, useEffect } from "react";
import { Divider, Modal, Statistic } from "antd";
import type { CountdownProps } from 'antd';
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
  open: boolean;
  onCancel: () => void;
}

const { Countdown } = Statistic;

export const PdfPreviewDialog: React.FC<PropInterface> = ({ title, src, open, onCancel }) => {
  // Create new plugin instance
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [finished, setFinished] = useState(false);
  
  const customHeader = ()=> (
    <>
      <div className="custom-title">{title}</div>
      { !finished ?
        <div className="count-down-box">
          您还需学习&emsp;
          <Countdown value={Date.now() + 1000 *10} format="m 分 s 秒" valueStyle={{color: 'red'}} onFinish={onFinish} />
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
          onCancel={() => onCancel()}
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
