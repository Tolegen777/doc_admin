import { Button, DatePicker, Form, Input, Select, Space, Switch } from "antd";
import styles from "./styles.module.scss";
import {
  ActionType,
  FormInitialFieldsParamsType,
} from "../../../types/common.ts";
import { axiosInstance } from "../../../api";
import { selectOptionsParser } from "../../../utils/selectOptionsParser.ts";
import { useQuery } from "@tanstack/react-query";

type Props = {
  formType: ActionType;
  initialFields: FormInitialFieldsParamsType[];
  onSubmit: (data: any, type: ActionType) => void;
  onClose: () => void;
  isLoading: boolean;
};

const { TextArea } = Input;

export const VisitUpdateForm = (props: Props) => {
  const { formType, initialFields, onSubmit, onClose, isLoading } = props;

  const [form] = Form.useForm();

  const { data: statuses, isLoading: statusLoading } = useQuery({
    queryKey: ["doctorStatuses"],
    queryFn: () =>
        axiosInstance
            .get("employee_endpoints/doctors/list_of_all_visit_statuses/")
            .then((response) => response.data),
    refetchOnMount: false,
  });

  const options = selectOptionsParser(statuses ?? [], "title", "id");

  const formFields = [
    {
      name: "status_id",
      element: (
          <Select
              placeholder="Выберите статус"
              options={options}
              showSearch
              allowClear
              loading={statusLoading}
              popupMatchSelectWidth={false}
          />
      ),
      label: "Статус",
    },
    {
      name: "date",
      element: (
          <DatePicker
              placeholder="Выберите дату визита"
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
          />
      ),
      label: "Дата визита",
      rules: [
        {
          required: true,
          message: "Обязательное поле!",
        },
      ],
    },
    {
      name: "note",
      element: <TextArea placeholder="Введите заметку" />,
      label: "Заметка",
    },
    {
      name: "is_child",
      element: <Switch />,
      label: "Ребёнок",
      valuePropName: "checked",
    },
    {
      name: "paid",
      element: <Switch />,
      label: "Оплачено",
      valuePropName: "checked",
    },
    {
      name: "approved_by_clinic",
      element: <Switch />,
      label: "Подтверждено",
      valuePropName: "checked",
      rules: [
        {
          required: true,
          message: "Обязательное поле!",
        },
      ],
    },
  ];

  return (
      <div className={styles.container}>
        <Form
            fields={initialFields}
            form={form}
            layout="vertical"
            onFinish={(value) => onSubmit(value, formType)}
            className={styles.form}
        >
          <Space size="small" direction="vertical" style={{ width: "100%" }}>
            {formFields.map((field) => (
                <Form.Item
                    key={field.name}
                    name={field.name}
                    label={field.label}
                    rules={field?.rules ?? []}
                    valuePropName={field.valuePropName}
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
              onClick={form.submit}
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
