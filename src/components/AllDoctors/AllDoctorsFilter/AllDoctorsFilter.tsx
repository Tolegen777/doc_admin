import { Button, Input, Select, Form } from "antd";
import styles from "./styles.module.scss";

type FilterPayload = {
  name?: string;
  specialities?: string[];
  procedures?: string[];
  categories?: string[];
  cities?: string[];
  branches?: string[];
};

type OptionsType = {
  label: string;
  value: string | number;
};

type Props = {
  onFilter: (filters: FilterPayload) => void;
  specialitiesOptions: OptionsType[];
  categoriesOptions: OptionsType[];
  citiesOptions: OptionsType[];
  branchesOptions: OptionsType[];
  specLoading: boolean;
  categoriesLoading: boolean;
  citiesLoading: boolean;
  branchesLoading: boolean;
};

const AllDoctorsFilter = ({
  onFilter,
  specialitiesOptions,
  categoriesOptions,
  citiesOptions,
  branchesOptions,
  specLoading,
  categoriesLoading,
  citiesLoading,
  branchesLoading,
}: Props) => {
  const [form] = Form.useForm();

  const onFinish = (values: FilterPayload) => {
    onFilter(values);
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="inline"
      className={styles.filterForm}
    >
      <Form.Item
        name="search"
        // label="Имя"
      >
        <Input placeholder="Введите имя врача" />
      </Form.Item>
      <Form.Item
        name="specialities"
        // label="Специальности"
      >
        <Select
          mode="multiple"
          placeholder="Выберите специальности"
          options={specialitiesOptions}
          style={{ width: "300px" }}
          popupMatchSelectWidth={false}
          loading={specLoading}
        />
      </Form.Item>
      <Form.Item
        name="categories"
        // label="Категории"
      >
        <Select
          mode="multiple"
          placeholder="Выберите категории"
          options={categoriesOptions}
          style={{ width: "200px" }}
          popupMatchSelectWidth={false}
          loading={categoriesLoading}
        />
      </Form.Item>
      <Form.Item
        name="cities"
        // label="Города"
      >
        <Select
          mode="multiple"
          placeholder="Выберите города"
          options={citiesOptions}
          style={{ width: "200px" }}
          popupMatchSelectWidth={false}
          loading={citiesLoading}
        />
      </Form.Item>
      <Form.Item
        name="clinics"
        // label="Филиалы"
      >
        <Select
          mode="multiple"
          placeholder="Выберите филиалы"
          options={branchesOptions}
          style={{ width: "400px" }}
          popupMatchSelectWidth={false}
          loading={branchesLoading}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" size={"large"}>
          Поиск
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AllDoctorsFilter;
