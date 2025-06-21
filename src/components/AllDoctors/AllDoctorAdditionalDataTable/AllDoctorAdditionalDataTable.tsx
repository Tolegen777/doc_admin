import { useState } from "react";
import type { TableProps } from "antd";
import { Button, Drawer, Switch } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../../api";
import { useStateContext } from "../../../contexts";
import { SpecProcTableAction } from "../SpecProcTableAction/SpecProcTableAction.tsx";
import { IAllSpec } from "../../../types/doctorSpec.ts";
import { customConfirmAction } from "../../../utils/customConfirmAction.ts";
import { customNotification } from "../../../utils/customNotification.ts";
import AllDoctorProcedurePrices from "../AllDoctorProcedurePrices/AllDoctorProcedurePrices.tsx";
import {
  AllAvailableMedicalProcedure,
  AllCurrentPrice,
  IAllCreateProc,
  IAllCreateSpec,
  IAllDoctorProcs,
  //   IAllDoctors,
  IAllDoctorSpec,
  IAllUpdateProc,
  IAllUpdateSpec,
} from "../../../types/allDoctors.ts";
import { IDoctor } from "../../../types/doctor.ts";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

type Props = {
  doctorDetails: IDoctor | null;
};

const AllDoctorAdditionalDataTable = ({ doctorDetails }: Props) => {
  const { state } = useStateContext();

  const { addressId } = state;

  const [activeSpecId, setActiveSpecId] = useState<number | null>(null);
  const [activeSpecTitle, setActiveSpecTitle] = useState<string>("");
  const [activeProcId, setActiveProcId] = useState<number | null>(null);
  const [activeProcTitle, setActiveProcTitle] = useState<string>("");

  const [isProcOpen, setIsProcOpen] = useState(false);
  const [isPriceOpen, setPriceOpen] = useState(false);

  const [allProcs, setAllProcs] = useState<AllAvailableMedicalProcedure[]>([]);

  // SPECIALITY POST PUT DELETE API
  const {
    mutate: onCreateSpec,
    isPending: isSpecCreateLoading,
    isSuccess: createSpecSuccess,
  } = useMutation({
    mutationKey: ["createAllSpec"],
    mutationFn: (body: IAllCreateSpec) =>
      axiosInstance.post(
        `partners/franchise-info/all-doctors/${doctorDetails?.id}/doctor-specialities/`,
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
    mutate: onUpdateSpec,
    isPending: isSpecUpdateLoading,
    isSuccess: updateSpecSuccess,
  } = useMutation({
    mutationKey: ["updateAllSpec"],
    mutationFn: ({ id, ...body }: IAllUpdateSpec) => {
      return axiosInstance.put(
        `partners/franchise-info/all-doctors/${doctorDetails?.id}/doctor-specialities/${id}`,
        body,
      );
    },
    onSuccess: () => {
      customNotification({
        type: "success",
        message: "Специальность врача успешно изменена!",
      });
    },
  });

  const {
    mutate: onDeleteSpec,
    isPending: isSpecDeleteLoading,
    isSuccess: deleteSpecSuccess,
  } = useMutation({
    mutationKey: ["deleteAllSpec"],
    mutationFn: (id: number) =>
      axiosInstance.delete(
        `partners/franchise-info/all-doctors/${doctorDetails?.id}/doctor-specialities/${id}`,
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
    mutationKey: ["createAllProc"],
    mutationFn: (body: IAllCreateProc) =>
      axiosInstance.post(
        `partners/franchise-info/all-doctors/${doctorDetails?.id}/doctor-specialities/${activeSpecId}/doctor-procedures/`,
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
    mutate: onUpdateProc,
    isPending: isProcUpdateLoading,
    isSuccess: updateProcSuccess,
  } = useMutation({
    mutationKey: ["updateAllProc"],
    mutationFn: ({ id, ...body }: IAllUpdateProc) => {
      return axiosInstance.put(
        `partners/franchise-info/all-doctors/${doctorDetails?.id}/doctor-specialities/${activeSpecId}/doctor-procedures/${id}`,
        body,
      );
    },
    onSuccess: () => {
      customNotification({
        type: "success",
        message: "Процедура врача успешно изменена!",
      });
    },
  });

  const {
    mutate: onDeleteProc,
    isPending: isProcDeleteLoading,
    isSuccess: deleteProcSuccess,
  } = useMutation({
    mutationKey: ["deleteAllProc"],
    mutationFn: (id: number) =>
      axiosInstance.delete(
        `partners/franchise-info/all-doctors/${doctorDetails?.id}/doctor-specialities/${activeSpecId}/doctor-procedures/${id}`,
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
      updateSpecSuccess,
      deleteSpecSuccess,
      doctorDetails?.id,
      addressId,
    ],
    queryFn: () =>
      axiosInstance
        .get<
          IAllDoctorSpec[]
        >(`partners/franchise-info/all-doctors/${doctorDetails?.id}/doctor-specialities`)
        .then((response) => response?.data),
    enabled: !!addressId && !!doctorDetails?.id,
  });

  const { data: allSpecsList } = useQuery({
    queryKey: ["allSpecsList", createSpecSuccess, updateSpecSuccess],
    queryFn: () =>
      axiosInstance
        .get<IAllSpec[]>(`partners/medical-specialties-list/`)
        .then((response) => response?.data),
  });

  // PROCEDURE GET API
  const { data: procs, isLoading: isProcLoading } = useQuery({
    queryKey: [
      "doctorProcsList",
      createProcSuccess,
      updateProcSuccess,
      deleteProcSuccess,
      activeSpecId,
      doctorDetails?.id,
      addressId,
    ],
    queryFn: () =>
      axiosInstance
        .get<
          IAllDoctorProcs[]
        >(`partners/franchise-info/all-doctors/${doctorDetails?.id}/doctor-specialities/${activeSpecId}/doctor-procedures/`)
        .then((response) => response?.data),
    enabled: !!addressId && !!doctorDetails?.id && !!activeSpecId,
  });

  // SPEC methods
  const handleUpdateSpec = (id: number, isActive: boolean) => {
    const payload = {
      id: id,
      is_active: isActive,
      // speciality: id,
      // doctor: doctorDetails?.id as number
    };
    onUpdateSpec(payload);
  };

  const handleCreateSpec = (id: number) => {
    const payload = {
      is_active: true,
      speciality: id,
      doctor: doctorDetails?.id as number,
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
    procs: AllAvailableMedicalProcedure[],
    title: string,
  ) => {
    setAllProcs(procs);
    setActiveSpecId(id);
    setActiveSpecTitle(title);
    setIsProcOpen(true);
  };

  // PROC methods
  const handleUpdateProc = (id: number, isActive: boolean) => {
    const payload = {
      id: id,
      is_active: isActive,
    };
    onUpdateProc(payload);
  };

  const handleCreateProc = (id: number) => {
    const payload = {
      is_active: true,
      procedure: id,
      doctor: doctorDetails?.id as number,
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
  };

  const onPriceClose = () => {
    setPriceOpen(false);
  };

  const filterAllFields = (type: "spec" | "proc") => {
    if (type === "spec") {
      const doctorSpecIds = specs?.map((item) => item?.doctor_speciality_id);
      return allSpecsList?.filter(
        (item) => !doctorSpecIds?.includes(item?.id),
      );
    } else {
      const doctorProcIds = procs?.map((item) => item?.id);
      return allProcs?.filter(
        (item) => !doctorProcIds?.includes(item?.procedure_id),
      );
    }
  };

  const specColumns: TableProps<DataType>["columns"] = [
    {
      title: "ID специальности врача",
      dataIndex: "doctor_speciality_id",
      key: "doctor_speciality_id",
    },
    {
      title: "Название специальности",
      dataIndex: "medical_speciality_title",
      key: "medical_speciality_title",
    },
    {
      title: "Количество процедур",
      dataIndex: "doctor_procedures_count",
      key: "doctor_procedures_count",
    },
    {
      title: "Доступное количество процедур",
      dataIndex: "available_procedures_count",
      key: "available_procedures_count",
    },
    {
      title: "Активность",
      key: "is_active",
      render: (item: IAllDoctorSpec) => (
        <Switch
          checked={item?.is_active}
          onChange={() =>
            handleUpdateSpec(item?.doctor_speciality_id, !item?.is_active)
          }
          disabled={isSpecUpdateLoading}
        />
      ),
    },
    {
      title: "Удалить",
      key: "action",
      render: (item: IAllDoctorSpec) => (
        <Button
          onClick={() => handleDeleteSpec(item?.doctor_speciality_id)}
          disabled={isSpecDeleteLoading}
        >
          Удалить
        </Button>
      ),
    },
    {
      title: "Открыть процедуры",
      key: "action",
      render: (item: IAllDoctorSpec) => (
        <Button
          onClick={() =>
            handleOpenProcedures(
              item?.doctor_speciality_id,
              item?.available_medical_procedures,
              item?.medical_speciality_title,
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
      dataIndex: "procedure_title",
      key: "procedure_title",
    },
    {
      title: "Количество цен",
      dataIndex: "price_count",
      key: "price_count",
    },
    {
      title: "Конечная стоимость",
      dataIndex: "current_price",
      key: "price",
      render: (price: AllCurrentPrice) => <div>{price?.final_price} Тг</div>,
    },
    {
      title: "Стандартная цена",
      dataIndex: "current_price",
      key: "default_price",
      render: (price: AllCurrentPrice) => <div>{price?.default_price} Тг</div>,
    },
    {
      title: "Скидка",
      dataIndex: "current_price",
      key: "discount",
      render: (price: AllCurrentPrice) => <div>{price?.discount}%</div>,
    },
    {
      title: "Для детей",
      dataIndex: "current_price",
      key: "is_for_children",
      render: (price: AllCurrentPrice) => (
        <div>{price?.is_for_children ? "Да" : "Нет"}</div>
      ),
    },
    {
      title: "Возраст ребенка (от)",
      key: "child_age_from",
      dataIndex: "current_price",
      render: (price: AllCurrentPrice) => (
        <div>{price?.child_age_from || "-"}</div>
      ),
    },
    {
      title: "Возраст ребенка (до)",
      key: "child_age_to",
      dataIndex: "current_price",
      render: (price: AllCurrentPrice) => (
        <div>{price?.child_age_to || "-"}</div>
      ),
    },

    {
      title: "Активность",
      key: "is_active",
      render: (item: IAllDoctorProcs) => (
        <Switch
          checked={item?.is_active}
          onChange={() => handleUpdateProc(item?.id, !item?.is_active)}
          disabled={isProcUpdateLoading}
        />
      ),
    },
    {
      title: "Удалить",
      key: "action",
      render: (item: IAllDoctorProcs) => (
        <Button
          onClick={() => handleDeleteProc(item?.id)}
          disabled={isProcDeleteLoading}
        >
          Удалить
        </Button>
      ),
    },
    {
      title: "Открыть цены",
      key: "action",
      render: (item: IAllDoctorProcs) => (
        <Button
          onClick={() => {
            handleOpenProcedurePrices(item?.id, item?.procedure_title)
          }
          }
          disabled={isSpecDeleteLoading}
        >
          Открыть цены процедурыd
        </Button>
      ),
    },
  ];

  return (
    <>
      <SpecProcTableAction
        data={specs ?? []}
        columns={specColumns}
        onCreate={handleCreateSpec}
        procSpecList={filterAllFields("spec") ?? []}
        isLoading={isSpecLoading}
        entityType={"speciality"}
        isDisabled={isSpecCreateLoading}
      />
      <Drawer
        title={`Выбранная специальность: ${activeSpecTitle}`}
        onClose={onProcClose}
        open={isProcOpen}
        width={"90%"}
      >
        <SpecProcTableAction
          data={procs ?? []}
          columns={procColumns}
          onCreate={handleCreateProc}
          procSpecList={filterAllFields("proc") ?? []}
          isLoading={isProcLoading}
          entityType={"procedure"}
          isDisabled={isProcCreateLoading}
        />
      </Drawer>
      <Drawer
        title={`Выбранная процедура: ${activeProcTitle}`}
        onClose={onPriceClose}
        open={isPriceOpen}
        width={"90%"}
      >
        <AllDoctorProcedurePrices
          activeSpecId={activeSpecId}
          activeProcId={activeProcId}
          doctorId={doctorDetails?.id ?? null}
        />
      </Drawer>
    </>
  );
};

export default AllDoctorAdditionalDataTable;
