import React, { useState, useEffect } from "react";
import { Modal } from "antd";
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

export const PdfPreviewDialog: React.FC<PropInterface> = ({ title, src, open, onCancel }) => {
  // Create new plugin instance
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <>
      {open ? (
        <Modal
          title={title}
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
            textAlign: "center",
            marginBottom: 0
          }}}
          maskClosable={false}
          onCancel={() => onCancel()}
        >
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.4.456/build/pdf.worker.min.js">
            <div style={{ height: '100vh' }}>
              <Viewer 
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
