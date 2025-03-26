/* eslint-disable react-hooks/exhaustive-deps */
import styles from "./styles.module.scss";
import { SlotEditBlock } from "../SlotEditBlock";
import { axiosInstance } from "../../../../api";
import {
  ITime,
  ITimeSlot,
  WorkingHoursList,
} from "../../../../types/calendar.ts";
import { Spinner } from "../../../Shared/Spinner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useStateContext } from "../../../../contexts";
import { SlotAdditionalInfoBlock } from "../SlotAdditionalInfoBlock";
import { getPreviousDate } from "../../../../utils/date/getDates.ts";
import { customNotification } from "../../../../utils/customNotification.ts";
import { ActionType } from "../../../../types/common.ts";
import { useMemo } from "react";
import { IVisit } from "../../../../types/visits.ts";

type Props = {
  createLoading: boolean;
  actionType: ActionType;
  times: ITime[];
};

export const SlotDetails = ({ createLoading, actionType, times }: Props) => {
  const { state, dispatch } = useStateContext();

  const { addressId, slot, visitId } = state;

  const { doctorId, workScheduleId } = slot;

  const { data: visitData, isLoading: isVisitLoading } = useQuery({
    queryKey: ["visitDetailsById", visitId],
    queryFn: () =>
      axiosInstance
        .get<IVisit>(`/employee_endpoints/visits/${visitId}`)
        .then((response) => response?.data),
    enabled: Boolean(visitId),
  });

  const { data, isFetching: isLoading } = useQuery({
    queryKey: ["doctorTimeSlotDetails", doctorId, addressId, workScheduleId],
    queryFn: () =>
      axiosInstance
        .get<ITimeSlot>(
          `/employee_endpoints/doctors/${doctorId}/schedules/${workScheduleId}`,
        )
        .then((response) => response?.data),
    enabled: !!addressId && !!doctorId && !!workScheduleId,
  });
  const { isPending: isUpdateLoading, mutateAsync: onGetPrevWorkSchedule } =
    useMutation({
      mutationKey: ["previousDoctorTimeSlotDetails"],
      mutationFn: (date: string): Promise<ITimeSlot> =>
        axiosInstance.get(
          `/employee_endpoints/doctors/${doctorId}/get_schedule_by_date/${date}`,
        ),
    });

  const formattedWorkingHours: WorkingHoursList[] = useMemo(() => {
    if (actionType === "create") {
      return times?.map((item) => ({
        ...item,
        panel_colour: "empty_blue",
        time_slot_object_id: item.id,
        time_slot_object_start_time: item.start_time,
        time_slot_object_end_time: item.end_time,
        patient_clinic_visit_id: visitId,
        reserved: false,
      }));
    }
    return [];
  }, [actionType]);

  const handleCopyPreviousDay = async () => {
    const prevDate = getPreviousDate(data?.work_date ?? "");
    if (prevDate === "weekend") {
      customNotification({
        type: "warning",
        message:
          "Предыдущий день был выходным, и в этот день у врача не было рабочих часов.",
      });
    } else {
      const data = await onGetPrevWorkSchedule(prevDate);
      const workingHours = data?.working_hours_list;
      const activeSlotIds = workingHours
        ?.filter((item) => item?.panel_colour === "full_blue")
        ?.map((item) => item?.time_slot_object_id);
      dispatch({
        type: "SET_SELECTED_TIME_SLOTS_IDS",
        payload: activeSlotIds,
      });
    }
  };

  if (isLoading || createLoading) {
    return (
      <div className={styles.loader}>
        <Spinner />
      </div>
    );
  }

  const workingHours =
    actionType === "update" ? data?.working_hours_list : formattedWorkingHours;
  return (
    <div className={styles.container}>
      <SlotEditBlock
        workingHours={workingHours ?? []}
        handleCopyPreviousDay={handleCopyPreviousDay}
        isLoading={isUpdateLoading}
      />
      <SlotAdditionalInfoBlock
        data={visitId ? visitData : undefined}
        isLoading={isVisitLoading}
      />
    </div>
  );
};
