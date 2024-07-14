import {Button, Form, Input, InputNumber, Space, Switch} from 'antd';
import styles from './styles.module.scss';
import {ActionType, FormInitialFieldsParamsType} from "../../../types/common.ts";

type Props = {
    formType: ActionType
    initialFields: FormInitialFieldsParamsType[]
    onSubmit: (data: any, type: ActionType) => void
    onClose: () => void
    isLoading: boolean
}

export const ReviewUpdateForm = (props: Props) => {
    const {
        formType,
        initialFields,
        onSubmit,
        onClose,
        isLoading
    } = props;

    const [form] = Form.useForm();

    const formFields = [
        {
            name: 'text',
            element: <Input placeholder="Введите текст комментария" />,
            label: 'Текст комментария',
            rules: [{
                required: true,
                message: 'Обязательное поле!'
            }]
        },
        {
            name: 'rating',
            element: <InputNumber min={1} max={5} placeholder="Введите рейтинг" />,
            label: 'Рейтинг',
            rules: [{
                required: true,
                message: 'Обязательное поле!'
            }]
        },
        {
            name: 'is_reply',
            element: <Switch />,
            label: 'Ответ на комментарий',
            valuePropName: 'checked'
        },
        // {
        //     name: 'parent_comment',
        //     element: <InputNumber min={0} placeholder="Введите ID родительского комментария" />,
        //     label: 'ID родительского комментария',
        //     rules: [{
        //         required: true,
        //         message: 'Обязательное поле!'
        //     }]
        // },
        // {
        //     name: 'visit',
        //     element: <InputNumber min={0} placeholder="Введите ID визита" />,
        //     label: 'ID визита',
        //     rules: [{
        //         required: true,
        //         message: 'Обязательное поле!'
        //     }]
        // },
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
