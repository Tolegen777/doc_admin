import { Button, Select, Table, Typography } from "antd";
import {IGet, TableType} from "../../../types/common.ts";
import { selectOptionsParser } from "../../../utils/selectOptionsParser.ts";
import {Dispatch, SetStateAction, useState} from "react";
import styles from "./styles.module.scss";
import GapContainer from "../../Shared/GapContainer/GapContainer.tsx";
import {CustomTable} from "../../Shared/CustomTable";

type Props = {
  columns: TableType<any>;
  data: IGet<any> | undefined;
  onCreate: (id: number) => void;
  procSpecList: any[];
  isLoading: boolean;
  entityType: "speciality" | "procedure";
  isDisabled: boolean;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
};

export const SpecProcTableAction = ({
  columns,
  data,
  onCreate,
  procSpecList,
  isLoading,
  entityType,
  isDisabled,
    page,
    setPage,
}: Props) => {
  const { Title } = Typography;

  const [value, setValue] = useState<number | null>(null);

  const [isOpenSelect, setOpenSelect] = useState(false);

  const options = selectOptionsParser(procSpecList ?? [], "title", "id");

  const entityTitle =
    entityType === "speciality" ? "специальность" : "процедуру";

  const handleCreate = () => {
    onCreate(value as number);
    setOpenSelect(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.container_header}>
        <Title>{`${entityType === "speciality" ? "Специальности" : "Процедуры"} доктора`}</Title>
        {!isOpenSelect ? (
          <Button
            onClick={() => setOpenSelect(true)}
            type={"primary"}
            size={"large"}
          >
            {`Добавить ${entityTitle} доктора`}
          </Button>
        ) : (
          <GapContainer gap={10}>
            <Select
              showSearch
              style={{ width: 300 }}
              placeholder={`Выберите ${entityTitle}`}
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={options}
              popupMatchSelectWidth={false}
              onChange={(value: number) => {
                setValue(value);
              }}
              loading={isLoading}
            />
            <Button
              type={"primary"}
              onClick={() => handleCreate()}
              disabled={!value || isDisabled}
            >
              Создать
            </Button>
          </GapContainer>
        )}
      </div>
      <CustomTable
          columns={columns}
          dataSource={data?.results ?? []}
          loading={isLoading}
          style={{ marginBottom: 30 }}
          setPage={setPage}
          total={data?.count ?? 0}
          current={page}
      />
    </div>
  );
};
