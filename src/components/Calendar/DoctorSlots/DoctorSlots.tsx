import React, { memo, useMemo, useState } from "react";
import styles from "./styles.module.scss";
import {
  ITime,
  IWorkScheduleCreate,
  IWorkScheduleUpdate,
  WorkSchedule,
} from "../../../types/calendar";
import Slot from "../Slot/Slot";
import { SlotDetails } from "../Slot/SlotDetails";
import CustomModal from "../../Shared/CustomModal/CustomModal";
import { useStateContext } from "../../../contexts";
import { formatDateToDayMonth } from "../../../utils/date/getDates";
import { axiosInstance } from "../../../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ActionType } from "../../../types/common.ts";
import { customNotification } from "../../../utils/customNotification.ts";

type DateType = {
  day: number;
  month: string;
  weekday: string;
  date: string;
  time: string;
};

type Props = {
  slots: WorkSchedule[];
  doctorName: string;
  doctorId: number;
  dates: DateType[];
};

const fillEmptySlots = (
  slots: WorkSchedule[],
  dates: DateType[],
  clinicBranchId: number,
): WorkSchedule[] => {
  return dates.map((date) => {
    const foundSlot = slots.find((slot) => slot.date === date.date);
    if (foundSlot) {
      return foundSlot;
    }
    return {
      clinic_branch_id: clinicBranchId,
      doctor_work_schedule_object_id: null,
      tile_color: "gray",
      appointments_count: 0,
      date: date.date,
      time_slots_count: 0,
    };
  });
};

const DoctorSlots: React.FC<Props> = memo(
  ({ slots, doctorName, doctorId, dates }) => {
    const queryClient = useQueryClient();
    const { state, dispatch } = useStateContext();
    const { selectedTimeSlotIds, slot, addressId } = state;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionType, setActionType] = useState<ActionType>("");
    const [activeWorkDate, setActiveWorkDate] = useState<string>("");

    const filledSlots = useMemo(
      () => fillEmptySlots(slots, dates, addressId as number),
      [slots, dates, addressId],
    );

    const { data, isLoading } = useQuery({
      queryKey: ["TimeSlotsList"],
      queryFn: () =>
        axiosInstance
          .get<ITime[]>(`/employee_endpoints/clinics/time_slots/`)
          .then((response) => response?.data),
      refetchOnMount: false,
    });

    const { mutate: onCreateWorkSchedule, isPending: isCreateLoading } =
      useMutation({
        mutationKey: ["doctorTimeSlotDetailsCreate"],
        mutationFn: (body: IWorkScheduleCreate) =>
          axiosInstance.post(`employee_endpoints/doctors/1/schedules/`, body),
        onSuccess: () => {
          setIsModalOpen(false);
          customNotification({
            type: "success",
            message: "Успешно выполнено!",
          });
          queryClient.invalidateQueries({ queryKey: ["calendarData"] });
          queryClient.invalidateQueries({
            queryKey: ["doctorTimeSlotDetails"],
          });
        },
      });

    const { mutate: onUpdateWorkSchedule, isPending: isUpdateLoading } =
      useMutation({
        mutationKey: ["doctorTimeSlotDetailsUpdate"],
        mutationFn: (body: IWorkScheduleUpdate) => {
          return axiosInstance.put(
            `employee_endpoints/doctors/1/schedules/${slot.workScheduleId}`,
            body,
          );
        },
        onSuccess: () => {
          setIsModalOpen(false);
          customNotification({
            type: "success",
            message: "Успешно выполнено!",
          });
          queryClient.invalidateQueries({ queryKey: ["calendarData"] });
          queryClient.invalidateQueries({
            queryKey: ["doctorTimeSlotDetails"],
          });
        },
      });

    const onSlotOpen = async (item: WorkSchedule) => {
      setIsModalOpen(true);
      const { doctor_work_schedule_object_id, time_slots_count, tile_color } =
        item;

      if (tile_color === "gray") {
        setActionType("create");
        setActiveWorkDate(String(time_slots_count));
        dispatch({
          type: "SET_SLOT_DATA",
          payload: {
            doctorId: doctorId,
            workScheduleId: doctor_work_schedule_object_id,
            title: `${doctorName}, ${formatDateToDayMonth(String(time_slots_count) ?? "")}`,
            panelColor: tile_color,
          },
        });
      } else {
        setActionType("update");
        dispatch({
          type: "SET_SLOT_DATA",
          payload: {
            doctorId: doctorId,
            workScheduleId: doctor_work_schedule_object_id,
            title: `${doctorName}, ${formatDateToDayMonth(String(time_slots_count) ?? "")}`,
            panelColor: tile_color,
          },
        });
      }
    };

    const handleConfirm = () => {
      const payload = selectedTimeSlotIds?.map((item) => ({
        time_slot_id: item,
      }));

      if (actionType === "create") {
        onCreateWorkSchedule({
          addressId,
          work_date: activeWorkDate,
          working_hours: payload,
        });
      } else {
        onUpdateWorkSchedule({
          addressId,
          working_hours: payload,
        });
      }
    };

    const handleCloseModal = async () => {
      setIsModalOpen(false);

      dispatch({
        type: "SET_VISIT_ID",
        payload: null,
      });
    };

    return (
      <>
        <CustomModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirm}
          title={state?.slot?.title ?? ""}
          isLoading={isUpdateLoading || isCreateLoading || isLoading}
        >
          <SlotDetails
            createLoading={isCreateLoading}
            actionType={actionType}
            times={data ?? []}
          />
        </CustomModal>
        <div className={styles.container}>
          {filledSlots.map((item, index) => (
            <Slot
              key={index}
              panelColour={item?.tile_color}
              workingHoursCount={item.time_slots_count}
              visitsCount={item.appointments_count}
              onSlotOpen={() => onSlotOpen(item)}
            />
          ))}
        </div>
      </>
    );
  },
);

export default DoctorSlots;
