import { Button, Form, InputNumber, Space } from 'antd';
import styles from './styles.module.scss';
import { ActionType, FormInitialFieldsParamsType } from "../../../types/common.ts";

type Props = {
    formType: ActionType
    initialFields: FormInitialFieldsParamsType[]
    onSubmit: (data: any, type: ActionType) => void
    onClose: () => void
    isLoading: boolean
}

export const AmenityCreateUpdateForm = (props: Props) => {
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
            name: 'clinic_branch',
            element: <InputNumber placeholder="Введите ID филиала клиники" style={{ width: '100%' }} />,
            label: 'ID филиала клиники',
            rules: [{
                required: true,
                message: 'Обязательное поле!'
            }]
        },
        {
            name: 'amenity',
            element: <InputNumber placeholder="Введите ID удобства" style={{ width: '100%' }} />,
            label: 'ID удобства',
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
