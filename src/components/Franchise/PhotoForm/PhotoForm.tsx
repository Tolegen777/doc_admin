import { Button, Form, Input, Upload, Space, Switch } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styles from "./styles.module.scss";
import { FormInitialFieldsParamsType } from "../../../types/common.ts";
import { useEffect, useState } from "react";

type Props = {
  initialFields: FormInitialFieldsParamsType[];
  onSubmit: (data: any) => void;
  onClose: () => void;
  isLoading: boolean;
};

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export const PhotoForm = (props: Props) => {
  const { initialFields, onSubmit, onClose, isLoading } = props;

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    const initialValues = initialFields.reduce((acc, field) => {
      // @ts-ignore
      acc[field.name] = field.value;
      return acc;
    }, {});

    form.setFieldsValue(initialValues);

    const photoField = initialFields.find((field) => field.name === "photo");
    if (photoField && photoField.value) {
      setFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: photoField.value,
        },
      ]);
    }
  }, [initialFields, form]);

  const handleFileChange = ({ fileList }: any) => setFileList(fileList);

  return (
    <div className={styles.container}>
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onSubmit(values);
          form.resetFields(["title_code", "photo"]);
          setFileList([]);
        }}
        className={styles.form}
        fields={initialFields}
      >
        <Space size="small" direction="vertical" style={{ width: "100%" }}>
          <Form.Item
            name="title_code"
            label="Название фото"
            rules={[{ required: true, message: "Обязательное поле!" }]}
          >
            <Input placeholder="Введите название фото" />
          </Form.Item>
          <Form.Item
            name="is_main"
            label="Главная фотография"
            rules={[{ required: true, message: "Обязательное поле!" }]}
            valuePropName={"checked"}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="photo"
            label="Загрузить фото"
            // valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Обязательное поле!" }]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              fileList={fileList}
              onChange={(e) => {
                handleFileChange(e);
              }}
              beforeUpload={() => false}
              accept="image/*"
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Загрузить</div>
              </div>
            </Upload>
          </Form.Item>
        </Space>
      </Form>
      <div className={styles.action}>
        <Button
          onClick={() => {
            form.resetFields(["title_code", "photo"]);
            setFileList([]);
            onClose();
          }}
          size={"large"}
        >
          Отмена
        </Button>
        <Button
          onClick={form.submit}
          type={"primary"}
          disabled={isLoading}
          size={"large"}
        >
          Сохранить
        </Button>
      </div>
    </div>
  );
};
