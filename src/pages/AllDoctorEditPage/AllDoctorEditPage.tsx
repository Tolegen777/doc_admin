import styles from './styles.module.scss'
import {axiosInstance} from "../../api";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useNavigate, useParams} from "react-router-dom";
import {FullSpinner} from "../../components/Shared/FullSpinner";
import AllDoctorCreateUpdateForm
    from "../../components/AllDoctors/AllDoctorCreateUpdateForm/AllDoctorCreateUpdateForm.tsx";
import {useState} from "react";
import {ActionType, FormInitialFieldsParamsType} from "../../types/common.ts";
import {IAllDoctors, ICreateDoctors, IUpdateDoctors} from "../../types/allDoctors.ts";
import {datePickerFormatter, formatDateToString} from "../../utils/date/getDates.ts";
import {customNotification} from "../../utils/customNotification.ts";
import {changeFormFieldsData} from "../../utils/changeFormFieldsData.ts";


const initialValues: FormInitialFieldsParamsType[] = [
    {
        name: 'first_name',
        value: null,
    },
    {
        name: 'last_name',
        value: null,
    },
    {
        name: 'patronymic_name',
        value: null,
    },
    {
        name: 'description',
        value: null,
    },
    {
        name: 'city',
        value: null,
    },
    {
        name: 'category',
        value: null,
    },
    {
        name: 'gender',
        value: null,
    },
    {
        name: 'works_since',
        value: null,
    },
    {
        name: 'for_child',
        value: null,
    },
    {
        name: 'is_active',
        value: null,
    },
    {
        name: 'is_top',
        value: null,
    }
];

const AllDoctorEditPage = () => {

    const queryClient = useQueryClient();

    const pathname = useParams()

    const navigate = useNavigate()

    const formType: ActionType = pathname?.id?.length ? 'update' : 'create'

    const [createUpdateFormInitialFields, setCreateUpdateFormInitialFields] = useState<FormInitialFieldsParamsType[]>(initialValues);

    const onClose = () => {
        setCreateUpdateFormInitialFields(initialValues);
        navigate('/all-doctors')
    };

    const {
        mutate: onUpdate,
        isPending: isUpdateLoading,
    } = useMutation({
        mutationKey: ['updateDoctor'],
        mutationFn: ({id, ...body}: IUpdateDoctors) => {
            return axiosInstance.put(`partners/franchise-info/all-doctors/${id}/`, body);
        },
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Данные врача успешно обновлены!'
            });
            queryClient.invalidateQueries({queryKey: ['doctorsData']});
        },
    });

    const {
        mutate: onCreate,
        isPending: isCreateLoading,
    } = useMutation({
        mutationKey: ['createDoctor'],
        mutationFn: (body: ICreateDoctors) => {
            return axiosInstance.post(`partners/franchise-info/all-doctors/`, body);
        },
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Врач успешно создан!'
            });
            queryClient.invalidateQueries({queryKey: ['doctorsData']});
            onClose()
        },
    });

    const { isLoading } = useQuery({
        queryKey: ['allDoctorByIDData', pathname?.id],
        queryFn: () =>
            axiosInstance
                .get<IAllDoctors>(`partners/franchise-info/all-doctors/${pathname?.id}`)
                .then((response) => {
                    if (response) {
                        setCreateUpdateFormInitialFields(changeFormFieldsData(initialValues, {
                            ...response?.data,
                            // @ts-ignore
                            works_since: datePickerFormatter(response?.data?.works_since ?? ''),
                            city: parseInt(response?.data?.city_id),
                            category: parseInt(response?.data?.category_id)
                        }))
                    }
                    return response?.data
                }),
        enabled: !!pathname?.id?.length
    });

    const onSubmitCreateUpdateModal = async (formData: ICreateDoctors) => {
        if (formType === 'update') {
            const payload = {
                ...formData,
                id: parseInt(pathname?.id ?? ''),
                // @ts-ignore
                works_since: formatDateToString(formData?.works_since?.$d ?? null) ?? ''
            };

            onUpdate(payload);
        } else {
            onCreate({
                ...formData,
                // @ts-ignore
                works_since: formatDateToString(formData?.works_since?.$d ?? null) ?? ''
            });
        }

        // onClose();
    };

    if (isLoading) {
        return <FullSpinner/>
    }

    return (
        <div className={styles.container}>
            <AllDoctorCreateUpdateForm
                formType={formType}
                initialFields={createUpdateFormInitialFields}
                onSubmit={onSubmitCreateUpdateModal}
                onClose={onClose}
                isLoading={isUpdateLoading || isCreateLoading}
            />
        </div>
    );
};

export default AllDoctorEditPage;
