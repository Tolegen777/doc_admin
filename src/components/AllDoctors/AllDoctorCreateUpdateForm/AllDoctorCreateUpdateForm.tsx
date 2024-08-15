import { Button, Form, Input, Select, DatePicker, Space, Switch } from 'antd';
import styles from './styles.module.scss';
import { ActionType, FormInitialFieldsParamsType } from "../../../types/common";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../../api";
import {selectOptionsParser} from "../../../utils/selectOptionsParser.ts";

type Props = {
    formType: ActionType
    initialFields: FormInitialFieldsParamsType[]
    onSubmit: (data: any, type: ActionType) => void
    onClose: () => void
    isLoading: boolean
}

const AllDoctorCreateUpdateForm = (props: Props) => {
    const {
        formType,
        initialFields,
        onSubmit,
        onClose,
        isLoading,
    } = props;

    const [form] = Form.useForm();

    const { data: categories, isLoading: categoryLoading } = useQuery({
        queryKey: ['doctorCategoriesData'],
        queryFn: () =>
            axiosInstance
                .get('partners/doctor-categories/')
                .then((response) => response.data),
        refetchOnMount: false,
    });

    const { data: cities, isLoading: citiesLoading } = useQuery({
        queryKey: ['doctorCitiesData'],
        queryFn: () =>
            axiosInstance
                .get('patients/cities/')
                .then((response) => response.data),
        refetchOnMount: false,
    });

    const options = selectOptionsParser(categories ?? [], 'title', 'doctor_category_id')
    const cityOptions = selectOptionsParser(cities ?? [], 'title', 'id')

    const formFields = [
        {
            name: 'first_name',
            element: <Input placeholder="Введите имя" style={{width: '600px'}} />,
            label: 'Имя',
            rules: [{
                required: true,
                message: 'Обязательное поле!'
            }]
        },
        {
            name: 'last_name',
            element: <Input placeholder="Введите фамилию" style={{width: '600px'}} />,
            label: 'Фамилия',
            rules: [{
                required: true,
                message: 'Обязательное поле!'
            }]
        },
        {
            name: 'patronymic_name',
            element: <Input placeholder="Введите отчество" style={{width: '600px'}} />,
            label: 'Отчество',
            rules: [{
                required: true,
                message: 'Обязательное поле!'
            }]
        },
        {
            name: 'categories',
            element: <Select
                placeholder="Выберите категорий врача"
                options={options}
                showSearch
                allowClear
                loading={categoryLoading}
                popupMatchSelectWidth={false}
                style={{width: '600px'}}
                mode={"multiple"}
            />,
            label: 'Категорий врача',
            // rules: [{
            //     required: true,
            //     message: 'Обязательное поле!'
            // }],
        },
        {
            name: 'city',
            element: <Select
                placeholder="Выберите город врача"
                options={cityOptions}
                showSearch
                allowClear
                loading={citiesLoading}
                popupMatchSelectWidth={false}
                style={{width: '600px'}}
            />,
            label: 'Город врача',
            rules: [{
                required: true,
                message: 'Обязательное поле!'
            }],
        },
        {
            name: 'gender',
            element: <Select
                placeholder="Пол врача"
                options={[
                    { label: 'Мужской', value: 'MALE' },
                    { label: 'Женский', value: 'FEMALE' },
                ]}
                showSearch
                allowClear
                style={{width: '600px'}}
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
                style={{width: '600px'}}
            />,
            label: 'Дата начала трудовой деятельности',
        },
    ];

    const formSwithFields = [
        {
            name: 'for_child',
            element: <Switch />,
            label: 'Для детей',
        },
        {
            name: 'is_active',
            element: <Switch />,
            label: 'Активен',
        },
        {
            name: 'is_top',
            element: <Switch />,
            label: 'Топовый врач',
        },
    ]

    const textareaFields = [
        {
            name: 'description',
            element: <Input.TextArea placeholder="Введите описание" rows={12} />,
            label: 'Описание',
            rules: [{
                required: true,
                message: 'Обязательное поле!'
            }]
        },
    ]

    return (
        <div className={styles.container}>
            <Form
                fields={initialFields}
                form={form}
                layout="vertical"
                onFinish={value => onSubmit(value, formType)}
                className={styles.form}
            >
                <div className={styles.container_fields}>
                    {formFields.map(field => (
                        <Form.Item
                            key={field.name}
                            name={field.name}
                            label={field.label}
                            rules={field?.rules ?? []}
                        >
                            {field.element}
                        </Form.Item>
                    ))}
                </div>
                <div className={styles.container_swith_fields}>
                    {formSwithFields.map(field => (
                        <Form.Item
                            key={field.name}
                            name={field.name}
                            label={field.label}
                        >
                            {field.element}
                        </Form.Item>
                    ))}
                </div>
                <Space size="small" direction="vertical" style={{ width: '100%', boxSizing: 'border-box', padding: '0 30px' }}>
                    {textareaFields.map(field => (
                        <Form.Item
                            key={field.name}
                            name={field.name}
                            label={field.label}
                        >
                            {field.element}
                        </Form.Item>
                    ))}
                </Space>
            </Form>
            <div className={styles.action}>
                <Button
                    onClick={onClose}
                    size={"large"}
                >
                    Назад
                </Button>
                <Button
                    onClick={form.submit}
                    type={"primary"}
                    disabled={isLoading}
                    size={"large"}
                >
                {formType === 'create' ? 'Создать' : 'Сохранить изменения'}
                </Button>
            </div>
        </div>
    );
};

export default AllDoctorCreateUpdateForm;
