import React, { useState } from 'react';
import {Button, Switch, TableProps} from 'antd';
import { Form, Popconfirm, Table, Typography } from 'antd';
import {EditableCell} from "../../Shared/EditableCell/EditableCell.tsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {axiosInstance} from "../../../api";
import {customNotification} from "../../../utils/customNotification.ts";
import {IDoctorProcPrice, ICreatePrice, IUpdatePrice} from "../../../types/doctorProcPrice.ts";
import {useStateContext} from "../../../contexts";
import {DoctorProcedure} from "../../../types/doctorSpec.ts";
import {customConfirmAction} from "../../../utils/customConfirmAction.ts";
import CustomModal from "../../Shared/CustomModal/CustomModal.tsx";
import {DoctorProcPriceCreateForm} from "./DoctorProcPriceCreateForm/DoctorProcPriceCreateForm.tsx";

type Props = {
    activeSpecId: number | null,
    activeProcId: number | null
}

const DoctorProcedurePrices: React.FC<Props> = ({activeSpecId, activeProcId}) => {

    const {state} = useStateContext()

    const {doctorData, addressId} = state

    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isEditing = (record: IDoctorProcPrice) => record.id === editingKey;

    // SPECIALITY POST PUT DELETE API
    const {
        mutate: onCreatePrice,
        isPending: isPriceCreateLoading,
        isSuccess: createPriceSuccess
    } = useMutation({
        mutationKey: ['createPrice'],
        mutationFn: (body: ICreatePrice) =>
            axiosInstance.post(`partners/franchise-branches/${addressId}/doctors/${doctorData?.id}/doc_spec/${activeSpecId}/doc_proc/${activeProcId}/prices/`, body),
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Специальность врача успешно создана!'
            })
            setIsModalOpen(false)
        }
    });

    const {
        mutate: onUpdatePrice,
        isPending: isPriceUpdateLoading,
        isSuccess: updatePriceSuccess
    } = useMutation({
        mutationKey: ['updatePrice'],
        mutationFn: ({id, ...body}: IUpdatePrice) => {
            return axiosInstance.put(`partners/franchise-branches/${addressId}/doctors/${doctorData?.id}/doc_spec/${activeSpecId}/doc_proc/${activeProcId}/prices/${id}`, body)
        },
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Специальность врача успешно изменена!'
            })
        }
    });

    const {
        mutate: onDeletePrice,
        isPending: isPriceDeleteLoading,
        isSuccess: deletePriceSuccess
    } = useMutation({
        mutationKey: ['deletePrice'],
        mutationFn: (id: number) =>
            axiosInstance.delete(`partners/franchise-branches/${addressId}/doctors/${doctorData?.id}/doc_spec/${activeSpecId}/doc_proc/${activeProcId}/prices/${id}`),
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Специальность врача успешно удалена!'
            })
        }
    });

    // PRICE GET API
    const { data, isLoading: isPriceLoading } = useQuery({
        queryKey: [
            'doctorPricesList',
            createPriceSuccess,
            updatePriceSuccess,
            deletePriceSuccess,
            doctorData?.id,
            addressId,
            activeSpecId,
            activeProcId
        ],
        queryFn: () =>
            axiosInstance
                .get<IDoctorProcPrice[]>(
                    `partners/franchise-branches/${addressId}/doctors/${doctorData?.id}/doc_spec/${activeSpecId}/doc_proc/${activeProcId}/prices`)
                .then((response) => response?.data),
        enabled: !!addressId && !!doctorData?.id && !!activeProcId && !!activeSpecId
    });

    const handleOnUpdate = (record: Partial<IDoctorProcPrice>) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record?.id as number);
    };

    const cancel = () => {
        setEditingKey(null);
    };

    const handleCreatePrice = () => {
        const values = form.getFieldsValue()

        onCreatePrice(values)
    }

    const handleDeletePrice = (id: number) => {
        customConfirmAction({
            message: 'Вы действительно хотите удалить специальность!',
            action: () => onDeletePrice(id),
            okBtnText: 'Удалить',
            isCentered: true
        })
    }

    const handleSave = (id: number) => {
        const formErrors = form.getFieldsError()
        const isError = formErrors?.some(item => item?.errors?.length)
        if (isError) {
            customConfirmAction({
                message: 'Заполните все поля правильно',
                isCentered: true,
                hideCancelButton: true,
                action: () => {}
            })
        } else {
            const values = form.getFieldsValue()
            onUpdatePrice({
                id: id,
                ...values
            })
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false)
        form.resetFields()
    }

    const procColumns = [
        {
            title: 'ID цены',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Стоимость услуги по умолчанию',
            dataIndex: 'default_price',
            key: 'default_price',
            editable: true,
            inputType: 'number',
        },
        {
            title: 'Скидка в процентах',
            dataIndex: 'discount',
            key: 'discount',
            editable: true,
            inputType: 'number',
            render: (item: number) => <div>{item || 0} %</div>
        },
        {
            title: 'Конечная стоимость услуги',
            dataIndex: 'final_price',
            editable: true,
            inputType: 'number',
        },
        {
            title: 'Детский прием',
            key: 'is_for_children',
            dataIndex: 'is_for_children',
            editable: true,
            inputType: 'switch',
            render: (item: boolean) => (
                <Switch
                    checked={item}
                    disabled
                />
            ),
        },
        {
            title: 'Возраст детей от',
            dataIndex: 'child_age_from',
            editable: true,
            inputType: 'text',
        },
        {
            title: 'Возраст детей до',
            dataIndex: 'child_age_to',
            editable: true,
            inputType: 'text',
        },
        {
            title: 'Активность',
            key: 'is_active',
            render: (item: boolean) => (
                <Switch
                    checked={item}
                    disabled
                />
            ),
        },
        {
            title: 'Удалить',
            key: 'action',
            render: (item: DoctorProcedure) => (
                <Button
                    onClick={() => handleDeletePrice(item?.id)}
                    disabled={isPriceDeleteLoading}
                >
                    Удалить
                </Button>
            ),
        },
        {
            title: 'Действие',
            render: (_: any, record: IDoctorProcPrice) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
            <Typography.Link onClick={() => handleSave(record?.id)} style={{ marginRight: 8 }}>
              Сохранить
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Отмена</a>
            </Popconfirm>
          </span>
                ) : (
                    <Typography.Link disabled={editingKey !== null} onClick={() => handleOnUpdate(record)}>
                        Изменить
                    </Typography.Link>
                );
            },
        },
    ];

    const mergedColumns: TableProps['columns'] = procColumns.map((col) => {
        if (!col?.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: IDoctorProcPrice) => ({
                record,
                inputType: col?.inputType,
                dataIndex: col?.dataIndex,
                title: col?.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <div>
            <CustomModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={() => handleCreatePrice()}
                title={'Создание цена процедуры'}
                isLoading={isPriceCreateLoading}
            >
                <DoctorProcPriceCreateForm form={form}/>
            </CustomModal>
            <Button
                onClick={() => setIsModalOpen(true)}
                style={{float: 'right', marginBottom: 20}}
                type={'primary'}
                size={"large"}
            >
                Создать
            </Button>
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{
                        onChange: cancel,
                    }}
                    loading={isPriceLoading}
                />
            </Form>
        </div>
    );

};

export default DoctorProcedurePrices;
