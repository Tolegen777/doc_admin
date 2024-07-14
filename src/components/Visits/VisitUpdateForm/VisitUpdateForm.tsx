import {Button, DatePicker, Form, Input, Space, Switch} from 'antd';
import styles from './styles.module.scss'
import {ActionType, FormInitialFieldsParamsType} from "../../../types/common.ts";

type Props = {
    formType: ActionType
    initialFields: FormInitialFieldsParamsType[]
    onSubmit: (data: any, type: ActionType) => void
    onClose: () => void
    isLoading: boolean
}

const { TextArea } = Input;

export const VisitUpdateForm = (props: Props) => {
    const {
        formType,
        initialFields,
        onSubmit,
        onClose,
        isLoading
    } = props;

    const [form] = Form.useForm();

    const formFields = [
        // {
        //     name: 'clinic_branch_id',
        //     element: <Input type="number" placeholder="Введите ID филиала клиники" />,
        //     label: 'ID филиала клиники'
        // },
        // {
        //     name: 'patient_id',
        //     element: <Input type="number" placeholder="Введите ID пациента" />,
        //     label: 'ID пациента'
        // },
        // {
        //     name: 'status_id',
        //     element: <Input type="number" placeholder="Введите ID статуса" />,
        //     label: 'ID статуса'
        // },
        // {
        //     name: 'doctor_id',
        //     element: <Input type="number" placeholder="Введите ID доктора" />,
        //     label: 'ID доктора'
        // },
        // {
        //     name: 'doctor_procedure_id',
        //     element: <Input type="number" placeholder="Введите ID процедуры доктора" />,
        //     label: 'ID процедуры доктора'
        // },
        // {
        //     name: 'visit_time_id',
        //     element: <Input type="number" placeholder="Введите ID времени визита" />,
        //     label: 'ID времени визита'
        // },
        {
            name: 'date',
            element: <DatePicker
                placeholder="Выберите дату визита"
                format="YYYY-MM-DD"
                style={{ width: '100%' }}
            />,
            label: 'Дата визита',
            rules: [{
                required: true,
                message: 'Обязательное поле!'
            }]
        },
        {
            name: 'note',
            element: <TextArea placeholder="Введите заметку" />,
            label: 'Заметка'
        },
        {
            name: 'is_child',
            element: <Switch />,
            label: 'Ребёнок',
            valuePropName: 'checked'
        },
        {
            name: 'paid',
            element: <Switch />,
            label: 'Оплачено',
            valuePropName: 'checked'
        },
        {
            name: 'approved',
            element: <Switch />,
            label: 'Одобрено',
            valuePropName: 'checked',
            rules: [{
                required: true,
                message: 'Обязательное поле!'
            }]
        },
        {
            name: 'approved_by_clinic',
            element: <Switch />,
            label: 'Одобрено клиникой',
            valuePropName: 'checked',
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
                onFinish={value => onSubmit(value, formType)}
                className={styles.form}
            >
                <Space size="small" direction="vertical" style={{width: '100%'}}>
                    {formFields.map(field => (
                        <Form.Item
                            key={field.name}
                            name={field.name}
                            label={field.label}
                            rules={field?.rules ?? []}
                            valuePropName={field.valuePropName}
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
