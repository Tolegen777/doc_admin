import { Button, Form, Select, Space } from 'antd';
import styles from './styles.module.scss';
import { ActionType, FormInitialFieldsParamsType } from "../../../types/common.ts";

type Props = {
    formType: ActionType
    initialFields: FormInitialFieldsParamsType[]
    onSubmit: (data: {amenity: number}) => void
    onClose: () => void
    isLoading: boolean
    allAmenities: Array<{id: number, title: string}>
    amenitiesLoading: boolean
}

export const AmenityCreateUpdateForm = (props: Props) => {
    const {
        formType,
        initialFields,
        onSubmit,
        onClose,
        isLoading,
        allAmenities,
        amenitiesLoading,
    } = props;

    const [form] = Form.useForm();

    const formFields = [
        {
            name: 'amenity',
            element: (
                <Select
                    placeholder="Выберите удобство"
                    style={{ width: '100%' }}
                    loading={amenitiesLoading}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        (option?.children as string)?.toLowerCase()?.includes(input.toLowerCase())
                    }
                >
                    {allAmenities?.map((amenity) => (
                        <Select.Option key={amenity.id} value={amenity.id}>
                            {amenity.title}
                        </Select.Option>
                    ))}
                </Select>
            ),
            label: 'Удобство',
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
                onFinish={value => onSubmit(value)}
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
                    {formType === 'create' ? 'Добавить' : 'Сохранить изменения'}
                </Button>
            </div>
        </div>
    );
};
