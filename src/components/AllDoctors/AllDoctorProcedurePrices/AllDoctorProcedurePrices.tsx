import React, {useState} from 'react';
import {Button, Form, Modal, Switch, Table} from 'antd';
import {useMutation, useQuery} from "@tanstack/react-query";
import {axiosInstance} from "../../../api";
import {customNotification} from "../../../utils/customNotification.ts";
import {ICreatePrice, IDoctorProcPrice, IUpdatePrice} from "../../../types/doctorProcPrice.ts";
import {useStateContext} from "../../../contexts";
import {DoctorProcedure} from "../../../types/doctorSpec.ts";
import {customConfirmAction} from "../../../utils/customConfirmAction.ts";
import {AllDoctorProcPriceCreateForm} from "./AllDoctorProcPriceCreateForm/AllDoctorProcPriceCreateForm.tsx";
import {FormInitialFieldsParamsType} from "../../../types/common.ts";
import {changeFormFieldsData} from "../../../utils/changeFormFieldsData.ts";
import {useParams} from "react-router-dom";
import {datePickerFormatter, formatDateTime} from "../../../utils/date/getDates.ts";

type Props = {
    activeSpecId: number | null,
    activeProcId: number | null,
    doctorId: number | null,
}

const initialValues: FormInitialFieldsParamsType[] = [
    {
        name: 'default_price',
        value: '',
    },
    {
        name: 'discount',
        value: null
    },
    {
        name: 'final_price',
        value: null
    },
    {
        name: 'child_age_to',
        value: null
    },
    {
        name: 'child_age_from',
        value: null
    },
    {
        name: 'is_for_children',
        value: false
    },
    {
        name: 'price_date',
        value: null
    }
];


const AllDoctorProcedurePrices: React.FC<Props> = ({activeSpecId, activeProcId, doctorId}) => {

    const {state} = useStateContext()

    const {addressId} = state

    const pathname = useParams()

    const [form] = Form.useForm();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formType, setFormType] = useState<'create' | 'update'>('create')

    const [createUpdateFormInitialFields, setCreateUpdateFormInitialFields] = useState<FormInitialFieldsParamsType[]>(initialValues)
    const [editEntity, setEditEntity] = useState<IDoctorProcPrice | null>(null)

    // SPECIALITY POST PUT DELETE API
    const {
        mutate: onCreatePrice,
        // isPending: isPriceCreateLoading,
        isSuccess: createPriceSuccess
    } = useMutation({
        mutationKey: ['createPrice'],
        mutationFn: (body: ICreatePrice) =>
            axiosInstance.post(`partners/franchise-info/all-doctors/${doctorId}/doctor-specialities/${activeSpecId}/doctor-procedures/${activeProcId}/doctor-procedure-prices/`, body),
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Цена процедуры врача успешно создана!'
            })
            setIsModalOpen(false)
        }
    });

    const {
        mutate: onUpdatePrice,
        // isPending: isPriceUpdateLoading,
        isSuccess: updatePriceSuccess
    } = useMutation({
        mutationKey: ['updatePrice'],
        mutationFn: ({id, ...body}: IUpdatePrice) => {
            return axiosInstance.put(`partners/franchise-info/all-doctors/${doctorId}/doctor-specialities/${activeSpecId}/doctor-procedures/${activeProcId}/doctor-procedure-prices/${id}`, body)
        },
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Цена процедуры врача успешно изменена!'
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
            axiosInstance.delete(`partners/franchise-info/all-doctors/${doctorId}/doctor-specialities/${activeSpecId}/doctor-procedures/${activeProcId}/doctor-procedure-prices/${id}`),
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Цена процедуры врача успешно удалена!'
            })
        }
    });

    // PRICE GET API
    const {data, isLoading: isPriceLoading} = useQuery({
        queryKey: [
            'doctorPricesList',
            createPriceSuccess,
            updatePriceSuccess,
            deletePriceSuccess,
            pathname?.id,
            addressId,
            activeSpecId,
            activeProcId
        ],
        queryFn: () =>
            axiosInstance
                .get<IDoctorProcPrice[]>(
                    `partners/franchise-info/all-doctors/${doctorId}/doctor-specialities/${activeSpecId}/doctor-procedures/${activeProcId}/doctor-procedure-prices/`)
                .then((response) => response?.data),
        enabled: !!doctorId && !!activeProcId && !!activeSpecId
    });

    const handleCreateUpdatePrice = (values: any) => {
        if (formType === 'update') {
            const payload = {
                id: editEntity?.id,
                price_date: values?.price_date?.format('YYYY-MM-DD') ?? null,
                ...values
            }
            onUpdatePrice(payload)
        } else {
            onCreatePrice({
                ...values,
                price_date: values?.price_date?.format('YYYY-MM-DD') ?? null,
            })
        }
    }

    const handleDeletePrice = (id: number) => {
        customConfirmAction({
            message: 'Вы действительно хотите удалить специальность!',
            action: () => onDeletePrice(id),
            okBtnText: 'Удалить',
            isCentered: true
        })
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setCreateUpdateFormInitialFields(initialValues)
        setFormType('create')
        setEditEntity(null)
        form.resetFields()
    }

    const onOpenCreateUpdateModal = (formType: 'create' | 'update', value?: IDoctorProcPrice) => {
        if ((formType === 'update') && value) {
            setCreateUpdateFormInitialFields(changeFormFieldsData(initialValues, {
                ...value,
                price_date: datePickerFormatter(value?.price_date ?? '')
            }))
        }

        setFormType(formType)
        setIsModalOpen(true)
        if (value) {
            setEditEntity(value)
        }
    };

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
            title: 'Дата установки цены',
            dataIndex: 'price_date',
            key: 'price_date',
            render: (price_date: string) => <div>
                <p>
                    {formatDateTime({
                        isoDateTime: price_date
                    })}
                </p>
            </div>
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
            render: (item: any) => <Button
                type={"primary"}
                onClick={() => {
                    onOpenCreateUpdateModal('update', item)
                }
                }
            >
                Изменить
            </Button>,
        },
    ];

    return (
        <div>
            <Modal
                open={isModalOpen}
                title={'Создание цена процедуры'}
                footer={<></>}
                onCancel={handleCloseModal}
            >
                <AllDoctorProcPriceCreateForm
                    form={form}
                    onSubmit={handleCreateUpdatePrice}
                    initialFields={createUpdateFormInitialFields}
                />
            </Modal>
            <Button
                onClick={() => setIsModalOpen(true)}
                style={{float: 'right', marginBottom: 20}}
                type={'primary'}
                size={"large"}
            >
                Создать
            </Button>
            <Table
                dataSource={data}
                columns={procColumns}
                loading={isPriceLoading}
            />
        </div>
    );

};

export default AllDoctorProcedurePrices;