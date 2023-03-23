import React from "react";
import { Layout } from "antd";

export const Footer: React.FC = () => {
  return (
    <Layout.Footer
      style={{
        width: "100%",
        backgroundColor: "#ffffff",
        height: 130,
        textAlign: "center",
        paddingBottom: 100,
      }}
    >
      <i
        style={{ fontSize: 30, color: "#cccccc" }}
        className="iconfont icon-waterprint"
      ></i>
    </Layout.Footer>
  );
};
