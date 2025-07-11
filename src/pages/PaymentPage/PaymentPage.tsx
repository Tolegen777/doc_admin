import styles from "./styles.module.scss";
import { CustomTable } from "../../components/Shared/CustomTable";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../api";
import { useStateContext } from "../../contexts";
import { IInvoice } from "../../types/invoice.ts";

const PaymentPage = () => {
    const { state } = useStateContext();

    const { addressId } = state;

    const columns = [
        {
            title: "ID",
            key: "id",
            dataIndex: "id",
        },
        {
            title: "Название сводки",
            key: "summary_title",
            dataIndex: "summary_title",
        },
        {
            title: "Период сводки",
            key: "summary_period",
            dataIndex: "summary_period",
        },
        {
            title: "Файл",
            key: "file_url",
            dataIndex: "file_url",
            render: (url: string) => (
                <a href={url} target="_blank" rel="noopener noreferrer">
                    Скачать PDF
                </a>
            ),
        },
    ];

    const { data, isLoading } = useQuery({
        queryKey: ["invoiceData", addressId],
        queryFn: () =>
            axiosInstance
                .get<IInvoice[]>(
                    `employee_endpoints/clinics/${addressId}/invoices/`,
                )
                .then((response) => response?.data),
        enabled: !!addressId,
    });

    return (
        <div className={styles.container}>
            <CustomTable
                columns={columns}
                dataSource={data ?? []}
                loading={isLoading}
            />
        </div>
    );
};

export default PaymentPage;
