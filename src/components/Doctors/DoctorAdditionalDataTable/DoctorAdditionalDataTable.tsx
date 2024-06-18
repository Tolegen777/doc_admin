import React, {useState} from 'react';
import type {TableProps} from 'antd';
import {Button, Switch} from 'antd';
import {useMutation, useQuery} from "@tanstack/react-query";
import {axiosInstance} from "../../../api";
import {useStateContext} from "../../../contexts";
import {SpecProcTableAction} from "../SpecProcTableAction/SpecProcTableAction.tsx";
import {IAllSpec, ICreateSpec, ISpec} from "../../../types/doctorSpec.ts";
import {Spinner} from "../../Shared/Spinner";
import {customConfirmAction} from "../../../utils/customConfirmAction.ts";

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

    const {
        mutate: onCreateSpec,
        isPending: isSpecCreateLoading,
        isSuccess: createSpecSuccess
    } = useMutation({
        mutationKey: ['createSpec'],
        mutationFn: (body: ICreateSpec) =>
            axiosInstance.post(`partners/franchise-branches/${addressId}/doctors/${doctorData?.id}/doc_spec`, body),
    });

    const {
        mutate: onUpdateSpec,
        isPending: isSpecUpdateLoading,
        isSuccess: updateSpecSuccess
    } = useMutation({
        mutationKey: ['updateSpec'],
        mutationFn: (body: ICreateSpec) => {
            return axiosInstance.put(`partners/franchise-branches/${addressId}/doctors/${doctorData?.id}/doc_spec`, body)
        },
        onSuccess: (response: any) => {
            console.log(response, 'RESPONSE');
            // setIsModalOpen(false)
            // queryClient.invalidateQueries({queryKey: ['calendarData']})
        },
    });

    const {
        mutate: onDeleteSpec,
        isPending: isSpecDeleteLoading,
        isSuccess: deleteSpecSuccess
    } = useMutation({
        mutationKey: ['deleteSpec'],
        mutationFn: (id: number) =>
            axiosInstance.delete(`partners/franchise-branches/${addressId}/doctors/${doctorData?.id}/doc_spec/${id}`),
    });

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

    const handleUpdateSpec = (id:number, isActive: boolean) => {
        const payload = {
            med_spec_id: id,
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
            okBtnText: 'Удалить'
        })

    }


    const specColumns: TableProps<DataType>['columns'] = [
        {
            title: 'Name',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Age',
            dataIndex: 'speciality',
            key: 'speciality',
        },
        {
            title: 'Address',
            dataIndex: 'doctor_procedures',
            key: 'doctor_procedures',
            render: (doctor_procedures: any[]) => <div>{doctor_procedures?.length}</div>
        },
        {
            title: 'Action',
            key: 'is_active',
            render: (item: ISpec) => (
                <Switch
                    checked={item?.is_active}
                    onChange={() => handleUpdateSpec(item?.id, !item?.is_active)}
                    disabled={isSpecUpdateLoading}
                />
            ),
        },
        {
            title: 'Action',
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
        />
        {/*{activeSpecId && <SpecProcTableAction data={specs} columns={specColumns} onCreate={handleCreateSpec}/>}*/}
    </>
};

export default DoctorAdditionalDataTable;
