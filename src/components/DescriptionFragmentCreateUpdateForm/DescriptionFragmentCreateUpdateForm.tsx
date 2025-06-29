import { Button, Form, Input, InputNumber, Space } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect } from "react";
import styles from "./styles.module.scss";
import {
  ActionType,
  FormInitialFieldsParamsType,
} from "../../types/common.ts";
import { IDescriptionFragmentUpdate } from "../../types/descriptionFragment.ts";

type Props = {
  formType: ActionType;
  initialFields: FormInitialFieldsParamsType[];
  onSubmit: (data: IDescriptionFragmentUpdate, type: ActionType) => void;
  onClose: () => void;
  isLoading: boolean;
};

export const DescriptionFragmentCreateUpdateForm = (props: Props) => {
  const { formType, initialFields, onSubmit, onClose, isLoading } = props;

  const [form] = Form.useForm();

  // Инициализируем значение content из initialFields при редактировании
  useEffect(() => {
    const contentField = initialFields.find(field => field.name === 'content');
    if (contentField && contentField.value) {
      form.setFieldValue('content', contentField.value);
    }
  }, [initialFields, form]);

  const formFields = [
    {
      name: "title",
      element: <Input placeholder="Введите заголовок" />,
      label: "Заголовок",
      rules: [
        {
          required: true,
          message: "Обязательное поле!",
        },
      ],
    },
    {
      name: "ordering_number",
      element: (
          <InputNumber placeholder="Введите номер" style={{ width: "100%" }} />
      ),
      label: "Номер",
      rules: [
        {
          required: true,
          message: "Обязательное поле!",
        },
      ],
    },
    {
      name: "content",
      element: (
          <ReactQuill
              value={form.getFieldValue('content') || ''}
              onChange={(value) => form.setFieldValue('content', value)}
              placeholder="Введите контент"
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, false] }],
                  ['bold', 'italic', 'underline'],
                  ['link', 'blockquote'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  ['clean']
                ],
              }}
              formats={[
                'header', 'bold', 'italic', 'underline',
                'link', 'blockquote', 'list', 'bullet'
              ]}
          />
      ),
      label: "Контент",
      rules: [
        {
          required: true,
          message: "Обязательное поле!",
        },
      ],
    },
  ];

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values, formType);
      form.resetFields();
    });
  };

  return (
      <div className={styles.container}>
        <Form
            fields={initialFields}
            form={form}
            layout="vertical"
            className={styles.form}
        >
          <Space size="small" direction="vertical" style={{ width: "100%" }}>
            {formFields.map((field) => (
                <Form.Item
                    key={field.name}
                    name={field.name}
                    label={field.label}
                    rules={field?.rules ?? []}
                >
                  {field.element}
                </Form.Item>
            ))}
          </Space>
        </Form>
        <div className={styles.action}>
          <Button onClick={onClose} size={"large"}>
            Отмена
          </Button>
          <Button
              onClick={handleSubmit}
              type={"primary"}
              disabled={isLoading}
              size={"large"}
          >
            {formType === "create" ? "Создать" : "Сохранить изменения"}
          </Button>
        </div>
      </div>
  );
};
