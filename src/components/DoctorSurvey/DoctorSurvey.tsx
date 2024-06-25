import {Button, DatePicker, Form, Input, Select, Switch} from "antd";
import {useStateContext} from "../../contexts";
import {gender} from "../../const/common.ts";
import {useMutation} from "@tanstack/react-query";
import {axiosInstance} from "../../api";
import {ICreateUpdateDoctor} from "../../types/doctor.ts";
import {customNotification} from "../../utils/customNotification.ts";

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
            options={[]}
            showSearch
            allowClear
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
        name: 'work_since',
        element: <DatePicker
            placeholder="Выберите дату начала трудовой деятельности"
            showTime
            format="YYYY/MM/DD HH:mm"
        />,
        label: 'Дата начала трудовой деятельности',
    },
];

const DoctorSurvey = () => {

    const [form] = Form.useForm();

    const {state} = useStateContext()

    const {addressId, doctorData, doctorSurveyData} = state

    const {
        mutate: onUpdate,
        isPending: isUpdateLoading,
    } = useMutation({
        mutationKey: ['updateDoctor'],
        mutationFn: (body: ICreateUpdateDoctor) => {
            return axiosInstance.put(`partners/franchise-branches/${addressId}/doctors/${doctorData?.id}/`, body)
        },
        onSuccess: () => {
            customNotification({
                type: 'success',
                message: 'Изменеия успешно сохранены!'
            })
        },
    });

    const handleUpdate = (value) => {
        onUpdate(value)

    }

    return (
        <div>
            <Form
                {...formItemLayout}
                variant="filled"
                fields={doctorSurveyData}
                form={form}
                layout="vertical"
                onFinish={value => handleUpdate(value)}

            >
                {formFields.map(field => (
                    <Form.Item key={field.name} name={field.name} label={field.label}>
                        {field.element}
                    </Form.Item>
                ))}
                <Form.Item label="Принимает ли детей" valuePropName="for_child">
                    <Switch/>
                </Form.Item>
                <Form.Item label="Активен" valuePropName="is_active">
                    <Switch/>
                </Form.Item>
                <Button
                    type={'primary'}
                    onClick={form.submit}
                    disabled={isUpdateLoading}
                >
                    Сохранить
                </Button>
            </Form>
        </div>
    );
};

export default DoctorSurvey;
