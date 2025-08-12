import {useState} from "react";
import type {TableProps} from "antd";
import {Button, Drawer} from "antd";
import {useMutation, useQuery} from "@tanstack/react-query";
import {axiosInstance} from "../../../api";
import {useStateContext} from "../../../contexts";
import {SpecProcTableAction} from "../SpecProcTableAction/SpecProcTableAction.tsx";
import {
  DoctorProcedure,
  IAllSpec,
  ICreateSpec,
  IMedProcedures,
  IPrice,
  ISpec,
  ISpecContent,
} from "../../../types/doctorSpec.ts";
import {customConfirmAction} from "../../../utils/customConfirmAction.ts";
import {customNotification} from "../../../utils/customNotification.ts";
import {ICreateProc, IProc} from "../../../types/doctorProc.ts";
import DoctorProcedurePrices from "../DoctorProcedurePrices/DoctorProcedurePrices.tsx";
import {IDoctor} from "../../../types/doctor.ts";
import {IGet} from "../../../types/common.ts";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

type Props = {
  doctorDetails: IDoctor | undefined;
};

const DoctorAdditionalDataTable = ({ doctorDetails }: Props) => {
  const { state } = useStateContext();

  const { addressId } = state;

  const [activeSpecId, setActiveSpecId] = useState<number | null>(null);
  const [activeSpecTitle, setActiveSpecTitle] = useState<string>("");
  const [activeProcId, setActiveProcId] = useState<number | null>(null);
  const [activeProcTitle, setActiveProcTitle] = useState<string>("");

  const [isProcOpen, setIsProcOpen] = useState(false);
  const [isPriceOpen, setPriceOpen] = useState(false);

  const [allProcs, setAllProcs] = useState<IMedProcedures[]>([]);

  const [specPage, setSpecPage] = useState<number>(1);
  const [procPage, setProcPage] = useState<number>(1);

  // SPECIALITY POST PUT DELETE API
  const {
    mutate: onCreateSpec,
    isPending: isSpecCreateLoading,
    isSuccess: createSpecSuccess,
  } = useMutation({
    mutationKey: ["createSpec"],
    mutationFn: (body: ICreateSpec) =>
      axiosInstance.post(
        `employee_endpoints/doctors/${doctorDetails?.id}/specialities/`,
        body,
      ),
    onSuccess: () => {
      customNotification({
        type: "success",
        message: "Специальность врача успешно создана!",
      });
    },
  });

  const {
    mutate: onDeleteSpec,
    isPending: isSpecDeleteLoading,
    isSuccess: deleteSpecSuccess,
  } = useMutation({
    mutationKey: ["deleteSpec"],
    mutationFn: (id: number) =>
      axiosInstance.delete(
        `employee_endpoints/doctors/${doctorDetails?.id}/specialities/${id}`,
      ),
    onSuccess: () => {
      customNotification({
        type: "success",
        message: "Специальность врача успешно удалена!",
      });
    },
  });

  // PROCEDURE POST PUT DELETE API
  const {
    mutate: onCreateProc,
    isPending: isProcCreateLoading,
    isSuccess: createProcSuccess,
  } = useMutation({
    mutationKey: ["createProc"],
    mutationFn: (body: ICreateProc) =>
      axiosInstance.post(
        `employee_endpoints/doctors/${doctorDetails?.id}/specialities/${activeSpecId}/procedures/`,
        body,
      ),
    onSuccess: () => {
      customNotification({
        type: "success",
        message: "Процедура врача успешно создана!",
      });
    },
  });

  const {
    mutate: onDeleteProc,
    isPending: isProcDeleteLoading,
    isSuccess: deleteProcSuccess,
  } = useMutation({
    mutationKey: ["deleteProc"],
    mutationFn: (id: number) =>
      axiosInstance.delete(
        `employee_endpoints/doctors/${doctorDetails?.id}/specialities/${activeSpecId}/procedures/${id}`,
      ),
    onSuccess: () => {
      customNotification({
        type: "success",
        message: "Процедура врача успешно удалена!",
      });
    },
  });

  // SPECIALITY GET API
  const { data: specs, isLoading: isSpecLoading } = useQuery({
    queryKey: [
      "doctorSpecsList",
      createSpecSuccess,
      deleteSpecSuccess,
      doctorDetails?.id,
      addressId,
      specPage
    ],
    queryFn: () =>
      axiosInstance
        .get<
          IGet<ISpec>
        >(`employee_endpoints/doctors/${doctorDetails?.id}/specialities?page=${specPage}`)
        .then((response) => response?.data),
    enabled: !!addressId && !!doctorDetails?.id,
  });

  const { data: allSpecsList } = useQuery({
    queryKey: ["allSpecsList", createSpecSuccess],
    queryFn: () =>
      axiosInstance
        .get<IAllSpec[]>(`employee_endpoints/doctors/list_of_all_specialities/`)
        .then((response) => response?.data),
  });

  // PROCEDURE GET API
  const { data: procs, isLoading: isProcLoading } = useQuery({
    queryKey: [
      "doctorProcsList",
      createProcSuccess,
      deleteProcSuccess,
      activeSpecId,
      doctorDetails?.id,
      addressId,
        procPage
    ],
    queryFn: () =>
      axiosInstance
        .get<
          IGet<IProc>
        >(`employee_endpoints/doctors/${doctorDetails?.id}/specialities/${activeSpecId}/procedures/?page=${procPage}`)
        .then((response) => response?.data),
    enabled: !!addressId && !!doctorDetails?.id && !!activeSpecId,
  });

  const handleCreateSpec = (id: number) => {
    const payload = {
      medical_speciality: id,
    };

    onCreateSpec(payload);
  };

  const handleDeleteSpec = (id: number) => {
    customConfirmAction({
      message: "Вы действительно хотите удалить специальность!",
      action: () => onDeleteSpec(id),
      okBtnText: "Удалить",
      isCentered: true,
    });
  };

  const handleOpenProcedures = (
    id: number,
    procs: IMedProcedures[],
    title: string,
  ) => {
    setAllProcs(procs);
    setActiveSpecId(id);
    setActiveSpecTitle(title);
    setIsProcOpen(true);
    setSpecPage(1)
    setProcPage(1)
  };

  const handleCreateProc = (id: number) => {
    const payload = {
      medical_procedure: id,
    };

    onCreateProc(payload);
  };

  const handleDeleteProc = (id: number) => {
    customConfirmAction({
      message: "Вы действительно хотите удалить процедуру!",
      action: () => onDeleteProc(id),
      okBtnText: "Удалить",
      isCentered: true,
    });
  };

  const handleOpenProcedurePrices = (id: number, title: string) => {
    setActiveProcId(id);
    setActiveProcTitle(title);
    setPriceOpen(true);
  };

  const onProcClose = () => {
    setIsProcOpen(false);
    setSpecPage(1)
    setProcPage(1)
  };

  const onPriceClose = () => {
    setPriceOpen(false);
  };

  const filterAllFields = (type: "spec" | "proc") => {
    if (type === "spec") {
      const doctorSpecIds = specs?.results?.map((item) => item?.speciality?.id);
      return allSpecsList?.filter(
        (item) => !doctorSpecIds?.includes(item?.id),
      );
    } else {
      const doctorProcIds = procs?.results?.map((item) => item?.med_proc_info?.id);
      return allProcs?.filter((item) => !doctorProcIds?.includes(item?.id));
    }
  };

  const specColumns: TableProps<DataType>["columns"] = [
    {
      title: "ID специальности врача",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Название специальности",
      dataIndex: "speciality",
      key: "speciality",
      render: (speciality: ISpecContent) => <div>{speciality?.title}</div>,
    },
    {
      title: "Количество процедур",
      dataIndex: "doctor_procedures",
      key: "doctor_procedures",
      render: (doctor_procedures: any[]) => (
        <div>{doctor_procedures?.length}</div>
      ),
    },
    {
      title: "Удалить",
      key: "action",
      render: (item: ISpec) => (
        <Button
          onClick={() => handleDeleteSpec(item?.id)}
          disabled={isSpecDeleteLoading}
        >
          Удалить
        </Button>
      ),
    },
    {
      title: "Открыть процедуры",
      key: "action",
      render: (item: ISpec) => (
        <Button
          onClick={() =>
            handleOpenProcedures(
              item?.id,
              item?.available_medical_procedures,
              item?.speciality?.title,
            )
          }
          disabled={isSpecDeleteLoading}
        >
          Открыть процедуры
        </Button>
      ),
    },
  ];

  const procColumns: TableProps<DataType>["columns"] = [
    {
      title: "ID процедуры врача",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Название процедуры",
      dataIndex: "medical_procedure_title",
      key: "medical_procedure_title",
      render: (item: string) => <div>{item}</div>,
    },
    {
      title: "Конечная стоимость услуги",
      dataIndex: "price",
      key: "price",
      render: (doctor_procedures: IPrice) => (
        <div>{doctor_procedures?.final_price ? `${doctor_procedures?.final_price} Тг` : 'Нет данных'} </div>
      ),
    },
    {
      title: "Удалить",
      key: "action",
      render: (item: DoctorProcedure) => (
        <Button
          onClick={() => handleDeleteProc(item?.id)}
          disabled={isProcDeleteLoading}
        >
          Удалить
        </Button>
      ),
    },
    {
      title: "Открыть цены процедуры",
      key: "action",
      render: (item: DoctorProcedure) => (
        <Button
          onClick={() => {
            handleOpenProcedurePrices(item?.id, item?.medical_procedure_title)
          }
          }
          disabled={isSpecDeleteLoading}
        >
          Открыть цены процедуры
        </Button>
      ),
    },
  ];

  return (
    <>
      <SpecProcTableAction
        data={specs}
        columns={specColumns}
        onCreate={handleCreateSpec}
        procSpecList={filterAllFields("spec") ?? []}
        isLoading={isSpecLoading}
        entityType={"speciality"}
        isDisabled={isSpecCreateLoading}
        page={specPage}
        setPage={setSpecPage}
      />
      <Drawer
        title={`Выбранная специальность: ${activeSpecTitle}`}
        onClose={onProcClose}
        open={isProcOpen}
        width={"90%"}
      >
        <SpecProcTableAction
          data={procs}
          columns={procColumns}
          onCreate={handleCreateProc}
          procSpecList={filterAllFields("proc") ?? []}
          isLoading={isProcLoading}
          entityType={"procedure"}
          isDisabled={isProcCreateLoading}
          page={procPage}
          setPage={setProcPage}
        />
      </Drawer>
      <Drawer
        title={`Выбранная процедура: ${activeProcTitle}`}
        onClose={onPriceClose}
        open={isPriceOpen}
        width={"90%"}
      >
        <DoctorProcedurePrices
          activeSpecId={activeSpecId}
          activeProcId={activeProcId}
        />
      </Drawer>
    </>
  );
};

export default DoctorAdditionalDataTable;
