import React, {useState} from 'react';
import type {TableProps} from 'antd';
import {Button, Drawer, Switch} from 'antd';
import {useMutation, useQuery} from "@tanstack/react-query";
import {axiosInstance} from "../../../api";
import {useStateContext} from "../../../contexts";
import {SpecProcTableAction} from "../SpecProcTableAction/SpecProcTableAction.tsx";
import {DoctorProcedure, IAllSpec, ICreateSpec, IMedProcedures, ISpec, IUpdateSpec} from "../../../types/doctorSpec.ts";
import {Spinner} from "../../Shared/Spinner";
import {customConfirmAction} from "../../../utils/customConfirmAction.ts";
import {customNotification} from "../../../utils/customNotification.ts";
import {ICreateProc, IUpdateProc} from "../../../types/doctorProc.ts";

interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
}

const DoctorAdditionalDataTable: React.FC = () => {

    const {state} = useStateContext()

    const {doctorData, addressId} = state

    const [activeSpecId, setActiveSpecId] = useState<number | null>(null)
    const [activeProcId, setActiveProcId] = useState<number | null>(null)

    const [open, setOpen] = useState(false);
    const [priceOpen, setPriceOpen] = useState(false);

    const [allProcs, setAllProcs] = useState<IMedProcedures[]>([]);

    // SPECIALITY POST PUT DELETE API
    const {
        mutate: onCreateSpec,
        isPending: isSpecCreateLoading,
        isSuccess: createSpecSuccess
    } = useMutation({
        mutationKey: ['createSpec'],
        mutationFn: (body: ICreateSpec) =>
            axiosInstance.post(`partners/franchise-branches/${addressId}/doctors/${doctorData?.id}/doc_spec/`, body),
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
            return axiosInstance.put(`partners/franchise-branches/${addressId}/doctors/${doctorData?.id}/doc_spec/${id}/`, body)
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
            axiosInstance.delete(`partners/franchise-branches/${addressId}/doctors/${doctorData?.id}/doc_spec/${id}`),
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
            axiosInstance.post(`partners/franchise-branches/${addressId}/doctors/${doctorData?.id}/doc_spec/${activeSpecId}/doc_proc/`, body),
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
            return axiosInstance.put(`partners/franchise-branches/${addressId}/doctors/${doctorData?.id}/doc_spec/${activeSpecId}/doc_proc/${id}`, body)
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
            axiosInstance.delete(`partners/franchise-branches/${addressId}/doctors/${doctorData?.id}/doc_spec/${activeSpecId}/doc_proc/${id}`),
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Процедура врача успешно удалена!'
            })
        }
    });

    // SPECIALITY GET API
    const { data: specs, isLoading: isSpecLoading } = useQuery({
        queryKey: ['doctorSpecsList', createSpecSuccess, updateSpecSuccess, deleteSpecSuccess],
        queryFn: () =>
            axiosInstance
                .get<ISpec>(`partners/franchise-branches/${addressId}/doctors/${doctorData?.id}/doc_spec`)
                .then((response) => response?.data),
        enabled: !!addressId && !!doctorData?.id
    });

    const { data: allSpecsList } = useQuery({
        queryKey: ['allSpecsList', createSpecSuccess, updateSpecSuccess],
        queryFn: () =>
            axiosInstance
                .get<IAllSpec>(`partners/medical-specialties-list/`)
                .then((response) => response?.data),
    });

    // PROCEDURE GET API
    const { data: procs, isLoading: isProcLoading } = useQuery({
        queryKey: ['doctorProcsList', createProcSuccess, updateProcSuccess, deleteProcSuccess],
        queryFn: () =>
            axiosInstance
                .get<ISpec>(`partners/franchise-branches/${addressId}/doctors/${doctorData?.id}/doc_spec/${activeSpecId}/doc_proc/`)
                .then((response) => response?.data),
        enabled: !!addressId && !!doctorData?.id
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

    const handleOpenProcedures = (id: number, procs:  IMedProcedures[]) => {
        setAllProcs(procs)
        setActiveSpecId(id)
        setOpen(true);
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

    const handleOpenProcedurePrices = (id: number) => {
        setActiveProcId(id)
        setPriceOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };


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
                    onClick={() => handleOpenProcedures(item?.id, item?.medical_procedures)}
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
            title: 'Количество цен в процедуре',
            dataIndex: 'doctor_procedures',
            render: (doctor_procedures: DoctorProcedure) => <div>{doctor_procedures?.comission_amount}</div>
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
            title: 'Открыть цену процедуры',
            key: 'action',
            render: (item: DoctorProcedure) => (
                <Button
                    onClick={() => handleOpenProcedurePrices(item?.id)}
                    disabled={isSpecDeleteLoading}
                >
                    Открыть процедуры
                </Button>
            ),
        },
    ];

    if (isSpecLoading) {
        return <Spinner/>
    }

    return <>
        <SpecProcTableAction
            data={specs}
            columns={specColumns}
            onCreate={handleCreateSpec}
            procSpecList={allSpecsList}
            isLoading={isSpecLoading}
            entityType={'speciality'}
            isDisabled={isSpecCreateLoading}
        />
        <Drawer
            title="Basic Drawer"
            onClose={onClose}
            open={open}
            width={'1000px'}
        >
            <SpecProcTableAction
                data={procs}
                columns={procColumns}
                onCreate={handleCreateProc}
                procSpecList={allProcs}
                isLoading={isProcLoading}
                entityType={'procedure'}
                isDisabled={isProcCreateLoading}
            />
        </Drawer>
    </>
};

export default DoctorAdditionalDataTable;
