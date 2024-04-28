import React from "react";
import { Layout } from "antd";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  return (
    <Layout.Footer
      style={{
        // width: "100%",
        backgroundColor: "#333333",
        height: 20,
        textAlign: "center",
        marginTop: 80,
      }}
    >
      {/* <Link to="https://playedu.xyz/" target="_blank"> */}
        <i
          style={{ fontSize: 14, color: "#cccccc" }}
          // className="iconfont icon-waterprint"
        >
          Copyright © {new Date().getFullYear()} 北京海金格医药科技股份有限公司 All Rights Reserved
        </i>
      {/* </Link> */}
    </Layout.Footer>
  );
};
