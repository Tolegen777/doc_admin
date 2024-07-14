import styles from './styles.module.scss'
import {CustomTable} from "../../components/Shared/CustomTable";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {axiosInstance} from "../../api";
import {useStateContext} from "../../contexts";
import {IVisit, IVisitCreate} from "../../types/visits.ts";
import {datePickerFormatter, formatDateTime, formatDateToString} from "../../utils/date/getDates.ts";
import {DoctorProfile} from "../../components/Doctors/DoctorProfile/DoctorProfile.tsx";
import {FormInitialFieldsParamsType, IGet} from "../../types/common.ts";
import {objectToQueryParams} from "../../utils/objectToQueryParams.ts";
import {useState} from "react";
import {customNotification} from "../../utils/customNotification.ts";
import {Button, Drawer} from "antd";
import {changeFormFieldsData} from "../../utils/changeFormFieldsData.ts";
import {VisitUpdateForm} from "../../components/Visits/VisitUpdateForm/VisitUpdateForm.tsx";

const initialValues: FormInitialFieldsParamsType[] = [
    {
        name: 'date',
        value: '',
    },
    {
        name: 'is_child',
        value: false,
    },
    {
        name: 'note',
        value: '',
    },
    {
        name: 'paid',
        value: false,
    },
    {
        name: 'approved_by_clinic',
        value: false,
    },
    {
        name: 'approved',
        value: false,
    },
    // {
    //     name: 'doctor_id',
    //     value: null,
    // },
    // {
    //     name: 'doctor_procedure_id',
    //     value: null,
    // },
    // {
    //     name: 'visit_time_id',
    //     value: null,
    // },
    // {
    //     name: 'clinic_branch_id',
    //     value: null,
    // },
    // {
    //     name: 'patient_id',
    //     value: null,
    // },
    // {
    //     name: 'status_id',
    //     value: null,
    // },
];


const VisitsPage = () => {

    const queryClient = useQueryClient();

    const {state} = useStateContext()

    const {addressId, visitsQuery} = state

    const [page, setPage] = useState(1)
    const [createUpdateModalOpen, setCreateUpdateModalOpen] = useState<boolean>(false)
    const [editEntity, setEditEntity] = useState<IVisit | null>(null)
    const [createUpdateFormInitialFields, setCreateUpdateFormInitialFields] = useState<FormInitialFieldsParamsType[]>(initialValues)

    const {
        mutate: onUpdate,
        isPending: isUpdateLoading,
    } = useMutation({
        mutationKey: ['updateVisit'],
        mutationFn: ({id, ...body}: IVisitCreate) => {
            return axiosInstance.put(`partners/franchise-branches/${addressId}/visits/${id}/edit/`, body)
        },
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Запись успешно изменена!'
            })
            queryClient.invalidateQueries({queryKey: ['visitsData']});
        },
    });

    const {data, isLoading} = useQuery({
        queryKey: ['visitsData', addressId, visitsQuery, page],
        queryFn: () =>
            axiosInstance
                .get<IGet<IVisit>>(`partners/franchise-branches/${addressId}/visits/?page=${page}&${objectToQueryParams({
                    part_of_name: visitsQuery
                })}`)
                .then((response) => response?.data),
        enabled: !!addressId
    });

    const onClose = () => {
        setCreateUpdateModalOpen(false);
        setCreateUpdateFormInitialFields(initialValues)
        setEditEntity(null)
    };

    const onOpenCreateUpdateModal = (data: IVisit) => {
        if (data) {
            setEditEntity(data)
            setCreateUpdateFormInitialFields(changeFormFieldsData<object>(initialValues,
                {
                    ...data,
                    date: datePickerFormatter(data?.date ?? '')
                }
            ))
        }

        setCreateUpdateModalOpen(true);
    };

    const onSubmitCreateUpdateModal = async (formData: IVisitCreate) => {

        const payload = {
            ...formData,
            date: formatDateToString(formData?.date?.$d ?? null) ?? '',
            id: editEntity?.visit_id
        };

        console.log(payload, 'PAYLOAD');
        onUpdate(payload);
        onClose();
    };

    const columns = [
        {
            title: 'Идентификатор',
            key: 'visit_id',
            dataIndex: 'visit_id',
        },
        {
            title: 'Дата визита',
            key: 'date',
            render: (visit: IVisit) => <p>{formatDateTime({
                inputDate: visit?.date,
                inputTime: visit?.visit_time_slot
            })}</p>
        },
        {
            title: 'Врач',
            key: 'doctor_full_name',
            render: (visit: IVisit) => <DoctorProfile
                title={visit?.doctor_full_name}
                subTitle={visit?.procedure_title}
                imgSrc={''}
            />
        },
        {
            title: 'Статус',
            key: 'status',
            render: (status: any) => (
                <div>
                    <div>{status?.status?.status_title}</div>
                    {/*<TextButton text={'Изменить'} type={'primary'} action={() => {}} />*/}
                </div>

            ),
        },
        {
            title: 'Пациент',
            key: 'patient_full_name',
            render: (visit: IVisit) => {
                    return <div>
                        <div>{visit?.patient_full_name}</div>
                        <div>{visit?.patient_phone_number}</div>
                        <div>{visit?.patient_iin_number}</div>
                    </div>
            },
        },
        {
            title: 'Дата создания/обновления',
            key: 'visit_time_slot',
            render: (visit: IVisit) => <div>
                <p>
                    {formatDateTime({
                        isoDateTime: visit?.created_at
                    })}
                </p>
                {visit?.updated_at?.length > 0 && <p>
                    Изменено: {formatDateTime({
                        isoDateTime: visit?.updated_at
                    })}
                </p>}
            </div>
        },
        {
            title: 'Редактировать',
            render: (data: IVisit) => <Button
                onClick={() => onOpenCreateUpdateModal(data)}
                type={"primary"}
            >
                Редактировать
            </Button>
        },
    ];

    return (
        <>
            <Drawer
                title={'Редактирование записи'}
                onClose={onClose}
                open={createUpdateModalOpen}
                width="500px"
            >
                <VisitUpdateForm
                    formType={'update'}
                    initialFields={createUpdateFormInitialFields}
                    onSubmit={onSubmitCreateUpdateModal}
                    onClose={onClose}
                    isLoading={isUpdateLoading}
                />
            </Drawer>
            <div className={styles.container}>
                {/*<Filters/>*/}
                <CustomTable
                    columns={columns}
                    dataSource={data?.results}
                    loading={isLoading}
                    setPage={setPage}
                    total={data?.count ?? 0}
                    current={page}
                />
            </div>
        </>
    );
};

export default VisitsPage;
