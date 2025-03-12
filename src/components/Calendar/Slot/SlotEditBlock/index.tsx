import styles from "./styles.module.scss";
import { SlotEditBlockHeader } from "../SlotEditBlockHeader";
import { WorkingHoursList } from "../../../../types/calendar.ts";
import { SlotEditBlockContent } from "../SlotEditBlockContent";

type Props = {
  workingHours: WorkingHoursList[];
  handleCopyPreviousDay: () => void;
  isLoading: boolean;
};
export const SlotEditBlock = ({
  workingHours,
  handleCopyPreviousDay,
  isLoading,
}: Props) => {
  return (
    <div className={styles.container}>
      <SlotEditBlockHeader
        workingHours={workingHours}
        handleCopyPreviousDay={handleCopyPreviousDay}
        isLoading={isLoading}
      />
      <SlotEditBlockContent workingHours={workingHours} />
    </div>
  );
};
