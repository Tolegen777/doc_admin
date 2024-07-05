import {useState} from 'react';
import type {TableProps} from 'antd';
import {Button, Drawer, Switch} from 'antd';
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
    IUpdateSpec
} from "../../../types/doctorSpec.ts";
import {customConfirmAction} from "../../../utils/customConfirmAction.ts";
import {customNotification} from "../../../utils/customNotification.ts";
import {ICreateProc, IProc, IUpdateProc} from "../../../types/doctorProc.ts";
import DoctorProcedurePrices from "../DoctorProcedurePrices/DoctorProcedurePrices.tsx";
import {IDoctor} from "../../../types/doctor.ts";

interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
}

type Props = {
    doctorDetails: IDoctor | undefined
}

const DoctorAdditionalDataTable = ({doctorDetails}: Props) => {

    const {state} = useStateContext()

    const {addressId} = state

    const [activeSpecId, setActiveSpecId] = useState<number | null>(null)
    const [activeSpecTitle, setActiveSpecTitle] = useState<string>('')
    const [activeProcId, setActiveProcId] = useState<number | null>(null)
    const [activeProcTitle, setActiveProcTitle] = useState<string>('')

    const [isProcOpen, setIsProcOpen] = useState(false);
    const [isPriceOpen, setPriceOpen] = useState(false);

    const [allProcs, setAllProcs] = useState<IMedProcedures[]>([]);

    // SPECIALITY POST PUT DELETE API
    const {
        mutate: onCreateSpec,
        isPending: isSpecCreateLoading,
        isSuccess: createSpecSuccess
    } = useMutation({
        mutationKey: ['createSpec'],
        mutationFn: (body: ICreateSpec) =>
            axiosInstance.post(`partners/franchise-branches/${addressId}/doctors/${doctorDetails?.id}/doc_spec/`, body),
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Специальность врача успешно создана!'
            })
        }
    });

    const {
        mutate: onUpdateSpec,
        isPending: isSpecUpdateLoading,
        isSuccess: updateSpecSuccess
    } = useMutation({
        mutationKey: ['updateSpec'],
        mutationFn: ({id, ...body}: IUpdateSpec) => {
            return axiosInstance.put(`partners/franchise-branches/${addressId}/doctors/${doctorDetails?.id}/doc_spec/${id}/`, body)
        },
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Специальность врача успешно изменена!'
            })
        }
    });

    const {
        mutate: onDeleteSpec,
        isPending: isSpecDeleteLoading,
        isSuccess: deleteSpecSuccess
    } = useMutation({
        mutationKey: ['deleteSpec'],
        mutationFn: (id: number) =>
            axiosInstance.delete(`partners/franchise-branches/${addressId}/doctors/${doctorDetails?.id}/doc_spec/${id}`),
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Специальность врача успешно удалена!'
            })
        }
    });

    // PROCEDURE POST PUT DELETE API
    const {
        mutate: onCreateProc,
        isPending: isProcCreateLoading,
        isSuccess: createProcSuccess
    } = useMutation({
        mutationKey: ['createProc'],
        mutationFn: (body: ICreateProc) =>
            axiosInstance.post(`partners/franchise-branches/${addressId}/doctors/${doctorDetails?.id}/doc_spec/${activeSpecId}/doc_proc/`, body),
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Процедура врача успешно создана!'
            })
        }
    });

    const {
        mutate: onUpdateProc,
        isPending: isProcUpdateLoading,
        isSuccess: updateProcSuccess
    } = useMutation({
        mutationKey: ['updateProc'],
        mutationFn: ({id, ...body}: IUpdateProc) => {
            return axiosInstance.put(`partners/franchise-branches/${addressId}/doctors/${doctorDetails?.id}/doc_spec/${activeSpecId}/doc_proc/${id}`, body)
        },
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Процедура врача успешно изменена!'
            })
        }
    });

    const {
        mutate: onDeleteProc,
        isPending: isProcDeleteLoading,
        isSuccess: deleteProcSuccess
    } = useMutation({
        mutationKey: ['deleteProc'],
        mutationFn: (id: number) =>
            axiosInstance.delete(`partners/franchise-branches/${addressId}/doctors/${doctorDetails?.id}/doc_spec/${activeSpecId}/doc_proc/${id}`),
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Процедура врача успешно удалена!'
            })
        }
    });

    // SPECIALITY GET API
    const { data: specs, isLoading: isSpecLoading } = useQuery({
        queryKey: ['doctorSpecsList', createSpecSuccess, updateSpecSuccess, deleteSpecSuccess, doctorDetails?.id, addressId],
        queryFn: () =>
            axiosInstance
                .get<ISpec[]>(`partners/franchise-branches/${addressId}/doctors/${doctorDetails?.id}/doc_spec`)
                .then((response) => response?.data),
        enabled: !!addressId && !!doctorDetails?.id
    });

    const { data: allSpecsList } = useQuery({
        queryKey: ['allSpecsList', createSpecSuccess, updateSpecSuccess],
        queryFn: () =>
            axiosInstance
                .get<IAllSpec[]>(`partners/medical-specialties-list/`)
                .then((response) => response?.data),
    });

    // PROCEDURE GET API
    const { data: procs, isLoading: isProcLoading } = useQuery({
        queryKey: ['doctorProcsList', createProcSuccess, updateProcSuccess, deleteProcSuccess, activeSpecId, doctorDetails?.id, addressId],
        queryFn: () =>
            axiosInstance
                .get<IProc[]>(`partners/franchise-branches/${addressId}/doctors/${doctorDetails?.id}/doc_spec/${activeSpecId}/doc_proc/`)
                .then((response) => response?.data),
        enabled: !!addressId && !!doctorDetails?.id && !!activeSpecId
    });

    // SPEC methods
    const handleUpdateSpec = (id:number, specId: number, isActive: boolean) => {
        const payload = {
            id: id,
            med_spec_id: specId,
            is_active: isActive
        }
        onUpdateSpec(payload)
    }

    const handleCreateSpec = (id: number) => {
        const payload = {
            med_spec_id: id,
            is_active: true
        }

        onCreateSpec(payload)
    }

    const handleDeleteSpec = (id: number) => {
        customConfirmAction({
            message: 'Вы действительно хотите удалить специальность!',
            action: () => onDeleteSpec(id),
            okBtnText: 'Удалить',
            isCentered: true
        })
    }

    const handleOpenProcedures = (id: number, procs:  IMedProcedures[], title: string) => {
        setAllProcs(procs)
        setActiveSpecId(id)
        setActiveSpecTitle(title)
        setIsProcOpen(true);
    };

    // PROC methods
    const handleUpdateProc = (id:number, procId: number, isActive: boolean) => {
        const payload = {
            id: id,
            med_proc_id: procId,
            is_active: isActive
        }
        onUpdateProc(payload)
    }

    const handleCreateProc = (id: number) => {
        const payload = {
            med_proc_id: id,
            is_active: true
        }

        onCreateProc(payload)
    }

    const handleDeleteProc = (id: number) => {
        customConfirmAction({
            message: 'Вы действительно хотите удалить специальность!',
            action: () => onDeleteProc(id),
            okBtnText: 'Удалить',
            isCentered: true
        })
    }

    const handleOpenProcedurePrices = (id: number, title: string) => {
        setActiveProcId(id)
        setActiveProcTitle(title)
        setPriceOpen(true);
    };

    const onProcClose = () => {
        setIsProcOpen(false);
    };

    const onPriceClose = () => {
        setPriceOpen(false);
    };

    const filterAllFields = (type: 'spec' | 'proc') => {
        if (type === 'spec') {
            const doctorSpecIds = specs?.map(item => item?.speciality?.id);
            return allSpecsList?.filter(item => !doctorSpecIds?.includes(item?.medical_speciality_id))
        } else {
            const doctorProcIds = procs?.map(item => item?.med_proc_info?.id);
            return allProcs?.filter(item => !doctorProcIds?.includes(item?.id))
        }
    }


    const specColumns: TableProps<DataType>['columns'] = [
        {
            title: 'ID специальности врача',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Название специальности',
            dataIndex: 'speciality',
            key: 'speciality',
            render: (speciality: ISpecContent) => <div>{speciality?.title}</div>
        },
        {
            title: 'Количество процедур',
            dataIndex: 'doctor_procedures',
            key: 'doctor_procedures',
            render: (doctor_procedures: any[]) => <div>{doctor_procedures?.length}</div>
        },
        {
            title: 'Активность',
            key: 'is_active',
            render: (item: ISpec) => (
                <Switch
                    checked={item?.is_active}
                    onChange={() => handleUpdateSpec(item?.id, item?.speciality?.id, !item?.is_active)}
                    disabled={isSpecUpdateLoading}
                />
            ),
        },
        {
            title: 'Удалить',
            key: 'action',
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
            title: 'Открыть процедуры',
            key: 'action',
            render: (item: ISpec) => (
                <Button
                    onClick={() => handleOpenProcedures(item?.id, item?.available_medical_procedures, item?.speciality?.title)}
                    disabled={isSpecDeleteLoading}
                >
                    Открыть процедуры
                </Button>
            ),
        },
    ];

    const procColumns: TableProps<DataType>['columns'] = [
        {
            title: 'ID процедуры врача',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Название процедуры',
            dataIndex: 'med_proc_info',
            key: 'med_proc_info',
            render: (item: IMedProcedures) => <div>{item?.title}</div>
        },
        {
            title: 'Конечная стоимость услуги',
            dataIndex: 'price',
            key: 'price',
            render: (doctor_procedures: IPrice) => <div>{doctor_procedures?.final_price} Тг</div>
        },
        {
            title: 'Активность',
            key: 'is_active',
            render: (item: DoctorProcedure) => (
                <Switch
                    checked={item?.is_active}
                    onChange={() => handleUpdateProc(item?.id, item?.med_proc_info?.id, !item?.is_active)}
                    disabled={isProcUpdateLoading}
                />
            ),
        },
        {
            title: 'Удалить',
            key: 'action',
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
            title: 'Открыть цены процедуры',
            key: 'action',
            render: (item: DoctorProcedure) => (
                <Button
                    onClick={() => handleOpenProcedurePrices(item?.id, item?.med_proc_info?.title)}
                    disabled={isSpecDeleteLoading}
                >
                    Открыть цены процедуры
                </Button>
            ),
        },
    ];

    return <>
        <SpecProcTableAction
            data={specs ?? []}
            columns={specColumns}
            onCreate={handleCreateSpec}
            procSpecList={filterAllFields('spec') ?? []}
            isLoading={isSpecLoading}
            entityType={'speciality'}
            isDisabled={isSpecCreateLoading}
        />
        <Drawer
            title={`Выбранная специальность: ${activeSpecTitle}`}
            onClose={onProcClose}
            open={isProcOpen}
            width={'90%'}
        >
            <SpecProcTableAction
                data={procs ?? []}
                columns={procColumns}
                onCreate={handleCreateProc}
                procSpecList={filterAllFields('proc') ?? []}
                isLoading={isProcLoading}
                entityType={'procedure'}
                isDisabled={isProcCreateLoading}
            />
        </Drawer>
        <Drawer
            title={`Выбранная процедура: ${activeProcTitle}`}
            onClose={onPriceClose}
            open={isPriceOpen}
            width={'90%'}
        >
            <DoctorProcedurePrices activeSpecId={activeSpecId} activeProcId={activeProcId}/>
        </Drawer>
    </>
};

export default DoctorAdditionalDataTable;
