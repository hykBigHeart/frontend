import React, { useState, useEffect } from "react";
import { Modal, Image, Form, Input, message } from "antd";
import styles from "./index.module.less";
import { user } from "../../api/index";

interface PropInterface {
  open: boolean;
  onCancel: () => void;
}

export const UserInfoModel: React.FC<PropInterface> = ({ open, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(true);
  const [avatar, setAvatar] = useState<string>("");

  useEffect(() => {
    getUser();
  }, [form, open]);

  const getUser = () => {
    user.detail().then((res: any) => {
      setAvatar(res.data.user.avatar);
      form.setFieldsValue({
        name: res.data.user.name,
      });
    });
  };

  const onFinish = (values: any) => {
    user.password(avatar, values.name).then((res: any) => {
      message.success("保存成功！");
      onCancel();
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Modal
        title="个人信息"
        centered
        forceRender
        open={open}
        width={416}
        onOk={() => form.submit()}
        onCancel={() => onCancel()}
        maskClosable={false}
      >
        <div className="float-left mt-24">
          <Form
            form={form}
            name="user-info"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="学员头像"
              labelCol={{ style: { marginTop: 15, marginLeft: 52 } }}
              name="avatar"
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
                <div className="d-flex ml-16">更换头像</div>
              </div>
            </Form.Item>
            <Form.Item label="修改姓名" name="name">
              <Input
                style={{ width: 200 }}
                autoComplete="off"
                placeholder="请输入姓名"
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};
