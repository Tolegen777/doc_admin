import styles from './styles.module.scss';
import {memo} from "react";
import {Descriptions} from "antd";
import {DoctorWorkScheduleDetailedApiView} from "../../../../types/calendar.ts";

type Props = {
    slotInfoData: DoctorWorkScheduleDetailedApiView | undefined
}

export const SlotAdditionalInfoBlock = memo(({slotInfoData}: Props) => {

    return (
        <div className={styles.container}>
            <div className={styles.container_title}>
                Информация о записи
            </div>
            <Descriptions
                column={1}
            >
                <Descriptions.Item label="Франшиза">{slotInfoData?.clinic_branch}</Descriptions.Item>
                <Descriptions.Item label="Идентификатор франшизы">{slotInfoData?.clinic_branch_id}</Descriptions.Item>
                <Descriptions.Item label="Доктор">{slotInfoData?.doctor_profile}</Descriptions.Item>
                <Descriptions.Item label="Дата работы">{slotInfoData?.work_date}</Descriptions.Item>
            </Descriptions>
        </div>
    );
});
