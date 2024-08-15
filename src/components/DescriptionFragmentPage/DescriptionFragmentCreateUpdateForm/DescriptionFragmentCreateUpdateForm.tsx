import { Button, Form, Input, InputNumber, Space } from 'antd';
import styles from './styles.module.scss';
import { ActionType, FormInitialFieldsParamsType } from "../../../types/common.ts";

type Props = {
    formType: ActionType
    initialFields: FormInitialFieldsParamsType[]
    onSubmit: (data: any, type: ActionType) => void
    onClose: () => void
    isLoading: boolean
}

export const DescriptionFragmentCreateUpdateForm = (props: Props) => {
    const {
        formType,
        initialFields,
        onSubmit,
        onClose,
        isLoading,
    } = props;

    const [form] = Form.useForm();

    const formFields = [
        {
            name: 'title',
            element: <Input placeholder="Введите заголовок" />,
            label: 'Заголовок',
            rules: [{
                required: true,
                message: 'Обязательное поле!'
            }]
        },
        {
            name: 'content',
            element: <Input.TextArea placeholder="Введите контент" />,
            label: 'Контент',
            rules: [{
                required: true,
                message: 'Обязательное поле!'
            }]
        },
        {
            name: 'number',
            element: <InputNumber placeholder="Введите номер" style={{ width: '100%' }} />,
            label: 'Номер',
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
                <Space size="small" direction="vertical" style={{ width: '100%' }}>
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
