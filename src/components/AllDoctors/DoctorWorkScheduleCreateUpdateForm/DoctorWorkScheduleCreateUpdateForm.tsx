import { Button, DatePicker, Form, Select, Space } from "antd";
import styles from "./styles.module.scss";
import {
  ActionType,
  FormInitialFieldsParamsType,
} from "../../../types/common.ts";
import { selectOptionsParser } from "../../../utils/selectOptionsParser.ts";
import { IFranchise } from "../../../types/franchiseTypes.ts";
import { ITime } from "../../../types/calendar.ts";

type Props = {
  formType: ActionType;
  initialFields: FormInitialFieldsParamsType[];
  onSubmit: (data: any, type: ActionType) => void;
  onClose: () => void;
  isLoading: boolean;
  clinics: IFranchise[] | null;
  workingHours: ITime[];
  workingHoursLoading: boolean;
  clinicLoading: boolean;
};

export const DoctorWorkScheduleCreateUpdateForm = (props: Props) => {
  const {
    formType,
    initialFields,
    onSubmit,
    onClose,
    isLoading,
    clinics,
    workingHours,
    clinicLoading,
    workingHoursLoading,
  } = props;

  const [form] = Form.useForm();

  const options = selectOptionsParser(clinics ?? [], "title", "id");
  const workingHoursOptions = selectOptionsParser(
    workingHours ?? [],
    "start_time",
    "id",
  );

  const formFields = [
    {
      name: "clinic",
      element: (
        <Select
          placeholder="Выберите филиал клиники"
          options={options}
          showSearch
          allowClear
          loading={clinicLoading}
          popupMatchSelectWidth={false}
          style={{ width: "100%" }}
        />
      ),
      label: "Филиал клиники",
      rules: [
        {
          required: true,
          message: "Обязательное поле!",
        },
      ],
    },
    {
      name: "date",
      element: (
        <DatePicker placeholder="Выберите дату" style={{ width: "100%" }} />
      ),
      label: "Дата работы",
      rules: [
        {
          required: true,
          message: "Обязательное поле!",
        },
      ],
    },
    {
      name: "working_hours",
      element: (
        <Select
          mode="multiple"
          placeholder="Выберите рабочие часы"
          options={workingHoursOptions}
          showSearch
          allowClear
          loading={workingHoursLoading}
          popupMatchSelectWidth={false}
          style={{ width: "100%" }}
        />
      ),
      label: "Рабочие часы",
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
