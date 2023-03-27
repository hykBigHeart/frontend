import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { Modal, Button, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  logoutAction,
  saveCurrentDepId,
} from "../../store/user/loginUserSlice";
import { ChangePasswordModel } from "../change-password";
import { UserInfoModel } from "../user-info";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;

export const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.loginUser.value.user);
  const departments = useSelector(
    (state: any) => state.loginUser.value.departments
  );
  const config = useSelector((state: any) => state.systemConfig.value);
  const [changePasswordVisiale, setChangePasswordVisiale] =
    useState<boolean>(false);
  const [userInfoVisiale, setUserInfoVisiale] = useState<boolean>(false);
  const [departmentsMenu, setDepartmentsMenu] = useState<any>([]);
  const [currentDepartment, setCurrentDepartment] = useState<string>("");

  useEffect(() => {
    setCurrentDepartment(departments[0].name);
    const arr: any = [
      {
        key: "1",
        type: "group",
        label: "部门",
        children: [],
      },
    ];
    departments.map((item: any) => {
      arr[0].children.push({
        key: item.id,
        label: item.name,
      });
    });
    setDepartmentsMenu(arr);
  }, [departments]);

  const onClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "login_out") {
      confirm({
        title: "操作确认",
        icon: <ExclamationCircleFilled />,
        content: "确认退出登录？",
        centered: true,
        okText: "确认",
        cancelText: "取消",
        onOk() {
          dispatch(logoutAction());
          navigate("/login");
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    } else if (key === "change_password") {
      setChangePasswordVisiale(true);
    } else if (key === "user_info") {
      setUserInfoVisiale(true);
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "个人信息",
      key: "user_info",
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

  const depItems: MenuProps["items"] = departmentsMenu;

  const onDepClick: MenuProps["onClick"] = ({ key }) => {
    let name: string = "";
    departments.map((item: any) => {
      if (Number(key) === item.id) {
        name = item.name;
      }
    });
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认切换部门？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        setCurrentDepartment(name);
        dispatch(saveCurrentDepId(Number(key)));
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return (
    <div className={styles["app-header"]}>
      <div className={styles["main-header"]}>
        <div className="d-flex">
          <Link to="/" className={styles["App-logo"]}>
            <img src={config.systemLogo} />
          </Link>
        </div>
        <div className="d-flex">
          {departments.length === 1 && (
            <div className={styles["department-name"]}>{currentDepartment}</div>
          )}
          {departments.length > 1 && (
            <Dropdown menu={{ items: depItems, onClick: onDepClick }}>
              <div className={styles["department-name"]}>
                {currentDepartment}
              </div>
            </Dropdown>
          )}
          <Button.Group className={styles["button-group"]}>
            <Dropdown menu={{ items, onClick }} placement="bottomRight">
              <div className="d-flex">
                {user && user.name && (
                  <>
                    <img
                      style={{ width: 36, height: 36, borderRadius: "50%" }}
                      src={user.avatar}
                    />
                    <span className="ml-8 c-admin">{user.name}</span>
                  </>
                )}
              </div>
            </Dropdown>
          </Button.Group>
          <ChangePasswordModel
            open={changePasswordVisiale}
            onCancel={() => {
              setChangePasswordVisiale(false);
            }}
          ></ChangePasswordModel>
          <UserInfoModel
            open={userInfoVisiale}
            onCancel={() => {
              setUserInfoVisiale(false);
            }}
          ></UserInfoModel>
        </div>
      </div>
    </div>
  );
};
