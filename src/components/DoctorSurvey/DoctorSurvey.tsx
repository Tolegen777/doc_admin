import {Button, DatePicker, Form, Input, Select, Spin, Switch} from "antd";
import {useStateContext} from "../../contexts";
import {gender} from "../../const/common.ts";
import {useMutation, useQuery} from "@tanstack/react-query";
import {axiosInstance} from "../../api";
import {ICategory, ICreateUpdateDoctor, IDoctor} from "../../types/doctor.ts";
import {customNotification} from "../../utils/customNotification.ts";
import styles from './styles.module.scss'
import {FormInitialFieldsParamsType} from "../../types/common.ts";
import {useState} from "react";
import {useParams} from "react-router-dom";
import {changeFormFieldsData} from "../../utils/changeFormFieldsData.ts";
import {selectOptionsParser} from "../../utils/selectOptionsParser.ts";
import {datePickerFormatter, formatDateToString} from "../../utils/date/getDates.ts";

const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 6},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
    },
}

const initialValues: FormInitialFieldsParamsType[] = [
    {
        name: 'first_name',
        value: ''
    },
    {
        name: 'last_name',
        value: ''
    },
    {
        name: 'patronymic_name',
        value: '',
    },
    {
        name: 'description',
        value: ''
    },
    {
        name: 'category',
        value: null
    },
    {
        name: 'gender',
        value: null
    },
    {
        name: 'works_since',
        value: null
    },
    {
        name: 'for_child',
        value: false
    },
    {
        name: 'is_active',
        value: false
    },
];

const DoctorSurvey = () => {

    const [form] = Form.useForm();

    const {state} = useStateContext()

    const {addressId} = state

    const pathname = useParams()

    const [createUpdateFormInitialFields, setCreateUpdateFormInitialFields] = useState<FormInitialFieldsParamsType[]>(initialValues)

    const {
        mutate: onUpdate,
        isPending: isUpdateLoading,
    } = useMutation({
        mutationKey: ['updateDoctor', pathname?.id],
        mutationFn: (body: ICreateUpdateDoctor) => {
            return axiosInstance.put(`partners/franchise-branches/${addressId}/doctors/${pathname?.id}`, body)
        },
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Изменеия успешно сохранены!'
            })
        },
    });

    const { data, isLoading: categoryLoading } = useQuery({
        queryKey: ['doctorCategoriesData'],
        queryFn: () =>
            axiosInstance
                .get<ICategory[]>(`partners/doctor-categories/`)
                .then((response) => {
                    return response?.data
                }),
        refetchOnMount: false,
    });

    const { isLoading } = useQuery({
        queryKey: ['doctorByIDData', addressId, ],
        queryFn: () =>
            axiosInstance
                .get<IDoctor>(`partners/franchise-branches/${addressId}/doctors/${pathname?.id}`)
                .then((response) => {
                    if (response) {
                        setCreateUpdateFormInitialFields(changeFormFieldsData(initialValues, {
                            ...response?.data,
                            // @ts-ignore
                            works_since: datePickerFormatter(response?.data?.works_since ?? '')
                    }))
                    }
                    return response?.data
                }),
        enabled: !!addressId
    });

    const options = selectOptionsParser(data ?? [], 'title', 'doctor_category_id')

    const formFields = [
        {
            name: 'first_name',
            element: <Input placeholder="Введите имя врача"/>,
            label: 'Имя врача',
            rules: [{
                required: true,
                message: 'Обязательное поле!'
            }],
        },
        {
            name: 'last_name',
            element: <Input placeholder="Введите фамилию врача"/>,
            label: 'Фамилия врача',
            rules: [{
                required: true,
                message: 'Обязательное поле!'
            }],
        },
        {
            name: 'patronymic_name',
            element: <Input placeholder="Введите отчество врача"/>,
            label: 'Отчество врача',
            rules: [{
                required: true,
                message: 'Обязательное поле!'
            }],
        },
        {
            name: 'description',
            element: <Input.TextArea placeholder="Введите описание врача"/>,
            label: 'Описание врача'
        },
        {
            name: 'category',
            element: <Select
                placeholder="Выберите категорию врача"
                options={options}
                showSearch
                allowClear
                loading={categoryLoading}
                popupMatchSelectWidth={false}
            />,
            label: 'Категория врача',
            rules: [{
                required: true,
                message: 'Обязательное поле!'
            }],
        },
        {
            name: 'gender',
            element: <Select
                placeholder="Пол врача"
                options={gender}
                showSearch
                allowClear
            />,
            label: 'Пол врача',
            rules: [{
                required: true,
                message: 'Обязательное поле!'
            }],
        },
        {
            name: 'works_since',
            element: <DatePicker
                placeholder="Выберите дату начала трудовой деятельности"
                format="YYYY-MM-DD"
            />,
            label: 'Дата начала трудовой деятельности',
        },
    ];

    const handleUpdate = (value: ICreateUpdateDoctor) => {
        const payload = {
            ...value,
            works_since: formatDateToString(value?.works_since?.$d ?? null) ?? ''
        }
        onUpdate(payload)
    }


    if (isLoading) {
        return <Spin/>
    }

    return (
        <div className={styles.container}>
            <Form
                {...formItemLayout}
                variant="filled"
                fields={createUpdateFormInitialFields}
                form={form}
                onFinish={value => handleUpdate(value)}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 800 }}

            >
                {formFields.map(field => (
                    <Form.Item
                        key={field.name}
                        name={field.name}
                        label={field.label}
                    >
                        {field.element}
                    </Form.Item>
                ))}
                <Form.Item
                    name={"for_child"}
                    label="Принимает ли детей"
                    valuePropName="checked"
                >
                    <Switch/>
                </Form.Item>
                <Form.Item
                    name={"is_active"}
                    label="Активен"
                    valuePropName="checked"
                >
                    <Switch/>
                </Form.Item>
                <Button
                    type={'primary'}
                    onClick={form.submit}
                    disabled={isUpdateLoading}
                    className={styles.submit}
                >
                    Сохранить
                </Button>
            </Form>
        </div>
    );
};

export default DoctorSurvey;
