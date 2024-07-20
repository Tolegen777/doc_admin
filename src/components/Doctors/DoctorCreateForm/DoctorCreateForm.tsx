import {Button, DatePicker, Form, Input, Select, Space, Switch} from 'antd';
import {useQuery} from "@tanstack/react-query";
import styles from './styles.module.scss'
import {ActionType, FormInitialFieldsParamsType} from "../../../types/common.ts";
import {ICategory, IDoctorCreate} from "../../../types/doctor.ts";
import {axiosInstance} from "../../../api";
import {selectOptionsParser} from "../../../utils/selectOptionsParser.ts";
import {gender} from "../../../const/common.ts";

type Props = {
    formType: ActionType
    initialFields: FormInitialFieldsParamsType[]
    onSubmit: (data: IDoctorCreate, type: ActionType) => void
    onClose: () => void
    isLoading: boolean
}

export const DoctorCreateForm = (props: Props) => {
    const {
        formType,
        initialFields,
        onSubmit,
        onClose,
        isLoading
    } = props;

    const [form] = Form.useForm();

    const {data, isLoading: categoryLoading} = useQuery({
        queryKey: ['doctorCategoriesData'],
        queryFn: () =>
            axiosInstance
                .get<ICategory[]>(`partners/doctor-categories/`)
                .then((response) => {
                    return response?.data
                }),
        refetchOnMount: false,
    });

    const options = selectOptionsParser(data ?? [], 'title', 'doctor_category_id')

    const formFields = [
        {
            name: 'first_name',
            element: <Input placeholder="Введите имя" width={'100%'} style={{width: '100%'}}/>,
            label: 'Имя',
            rules: [{
                required: true,
                message: 'Обязательное поле!'
            }]
        },
        {
            name: 'last_name',
            element: <Input placeholder="Введите фамилию"/>,
            label: 'Фамилия',
        },
        {
            name: 'patronymic_name',
            element: <Input placeholder="Введите отчество"/>,
            label: 'Отчество',
        },
        {
            name: 'description',
            element: <Input placeholder="Введите описание"/>,
            label: 'Описание',
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
            label: 'Категория',
        },
        {
            name: 'gender',
            element: <Select
                placeholder="Пол врача"
                options={gender}
                showSearch
                allowClear
            />,
            label: 'Пол',
            rules: [{
                required: true,
                message: 'Обязательное поле!'
            }]
        },
        {
            name: 'works_since',
            element: <DatePicker
                placeholder="Выберите дату начала трудовой деятельности"
                format="YYYY-MM-DD"
            />,
            label: 'Дата начала трудовой деятельности',
            rules: [{
                required: true,
                message: 'Обязательное поле!'
            }]
        },
    ];

    return (
        <div className={styles.container}>
            <Form
                fields={initialFields}
                form={form}
                layout="vertical"
                onFinish={value => {
                    onSubmit(value, formType)
                }}
                className={styles.form}
            >
                <Space size="small" direction="vertical" style={{width: '100%'}}>
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
                    {/*<Form.Item label="Upload" valuePropName="fileList"  name="photos" getValueFromEvent={normFile}>*/}
                    {/*    <Upload action="/upload.do" listType="picture-card">*/}
                    {/*        <button style={{ border: 0, background: 'none' }} type="button">*/}
                    {/*            <PlusOutlined />*/}
                    {/*            <div style={{ marginTop: 8 }}>Upload</div>*/}
                    {/*        </button>*/}
                    {/*    </Upload>*/}
                    {/*</Form.Item>*/}
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
                </Space>
            </Form>
            <div className={styles.action}>
                <Button
                    onClick={() => {
                        onClose()
                    }}
                    size={"large"}
                >
                    Отмена
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
