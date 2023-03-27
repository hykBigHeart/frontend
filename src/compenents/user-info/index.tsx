import React, { useState, useEffect } from "react";
import { Modal, Image, Form, message, Upload, Button } from "antd";
import styles from "./index.module.less";
import { user } from "../../api/index";
import { useDispatch } from "react-redux";
import { loginAction } from "../../store/user/loginUserSlice";
import type { UploadProps } from "antd";
import config from "../../js/config";
import { getToken } from "../../utils/index";

interface PropInterface {
  open: boolean;
  onCancel: () => void;
}

export const UserInfoModel: React.FC<PropInterface> = ({ open, onCancel }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [avatar, setAvatar] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [idCard, setIdCard] = useState<string>("");

  useEffect(() => {
    getUser();
  }, [form, open]);

  const getUser = () => {
    user.detail().then((res: any) => {
      setAvatar(res.data.user.avatar);
      setName(res.data.user.name);
      setIdCard(res.data.user.id_card);
      dispatch(loginAction(res.data));
    });
  };

  const props: UploadProps = {
    name: "file",
    multiple: false,
    method: "PUT",
    action: config.app_url + "/api/v1/user/avatar",
    headers: {
      Accept: "application/json",
      authorization: "Bearer " + getToken(),
    },
    beforeUpload: (file) => {
      const isPNG = file.type === ("image/png" || "image/jpg");
      if (!isPNG) {
        message.error(`${file.name}不是图片文件`);
      }
      return isPNG || Upload.LIST_IGNORE;
    },
    onChange(info: any) {
      const { status, response } = info.file;
      if (status === "done") {
        if (response.code === 0) {
          message.success(`${info.file.name} 上传成功`);
          getUser();
        } else {
          message.error(response.msg);
        }
      } else if (status === "error") {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  return (
    <>
      <Modal
        title="个人信息"
        centered
        forceRender
        open={open}
        width={416}
        onCancel={() => onCancel()}
        maskClosable={false}
        footer={null}
      >
        <div className="mt-24">
          <Form
            form={form}
            name="user-info"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            autoComplete="off"
          >
            <Form.Item
              label="学员头像"
              labelCol={{ style: { marginTop: 15, marginLeft: 52 } }}
            >
              <div className="d-flex">
                {avatar && (
                  <Image
                    width={60}
                    height={60}
                    style={{ borderRadius: "50%" }}
                    src={avatar}
                    preview={false}
                  />
                )}
                <div className="d-flex ml-16">
                  <Upload {...props} showUploadList={false}>
                    <Button>更换头像</Button>
                  </Upload>
                </div>
              </div>
            </Form.Item>
            <Form.Item label="学员姓名">
              <div>{name}</div>
            </Form.Item>
            <Form.Item label="身份证号" style={{ marginBottom: 16 }}>
              <div>{idCard}</div>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};
