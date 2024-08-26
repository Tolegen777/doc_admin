import { Button, Form, Input, InputNumber, Space } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Подключаем стили Quill
import { useState } from 'react';
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
    const [content, setContent] = useState('');

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
            name: 'number',
            element: <InputNumber placeholder="Введите номер" style={{ width: '100%' }} />,
            label: 'Номер',
            rules: [{
                required: true,
                message: 'Обязательное поле!'
            }]
        },
        {
            name: 'content',
            element: (
                <ReactQuill
                    value={content}
                    onChange={setContent}
                    placeholder="Введите контент"
                />
            ),
            label: 'Контент',
            rules: [{
                required: true,
                message: 'Обязательное поле!'
            }]
        },
    ];

    const handleSubmit = () => {
        form.validateFields().then(values => {
            const payload = {
                ...values,
                content,
            };
            onSubmit(payload, formType);
            form.resetFields()
        });
    };

    return (
        <div className={styles.container}>
            <Form
                fields={initialFields}
                form={form}
                layout="vertical"
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
                    onClick={handleSubmit}
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
