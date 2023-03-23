import React from "react";
import styles from "./index.module.scss";
import { Button, Dropdown, MenuProps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutAction } from "../../store/user/loginUserSlice";

export const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.loginUser.value.user);
  const config = useSelector((state: any) => state.systemConfig.value);

  const onClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "login_out") {
      dispatch(logoutAction());
      navigate("/login");
    } else if (key === "change_password") {
      navigate("/change-password");
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "个人中心",
      key: "user_center",
      icon: (
        <i className="iconfont icon-icon-12 c-red" style={{ fontSize: 16 }} />
      ),
    },
    {
      label: "修改密码",
      key: "change_password",
      icon: (
        <i
          className="iconfont icon-icon-password c-red"
          style={{ fontSize: 16 }}
        />
      ),
    },
    {
      label: "退出登录",
      key: "login_out",
      icon: (
        <i
          className="iconfont icon-a-icon-logout c-red"
          style={{ fontSize: 16 }}
        />
      ),
    },
  ];

  return (
    <div className={styles["app-header"]}>
      <div className={styles["main-header"]}>
        <div className="d-flex">
          <Link to="/" className={styles["App-logo"]}>
            <img src={config.systemLogo} />
          </Link>
        </div>
        <div className="d-flex">
          <Button.Group className={styles["button-group"]}>
            <Dropdown menu={{ items, onClick }} placement="bottomRight">
              <div className="d-flex">
                {user.name && (
                  <img
                    style={{ width: 36, height: 36, borderRadius: "50%" }}
                    src={user.avatar}
                  />
                )}
                <span className="ml-8 c-admin">{user.name}</span>
              </div>
            </Dropdown>
          </Button.Group>
        </div>
      </div>
    </div>
  );
};
