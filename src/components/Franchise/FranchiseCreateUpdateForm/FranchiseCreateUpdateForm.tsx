import {Button, Form, Input, InputNumber, Select, Space} from 'antd';
import styles from './styles.module.scss'
import {ActionType, FormInitialFieldsParamsType} from "../../../types/common.ts";
import {CityTypes} from "../../../types/cityTypes.ts";
import {selectOptionsParser} from "../../../utils/selectOptionsParser.ts";

type Props = {
    formType: ActionType
    initialFields: FormInitialFieldsParamsType[]
    onSubmit: (data: any, type: ActionType) => void
    onClose: () => void
    isLoading: boolean,
    cities: CityTypes[],
    cityLoading: boolean
}

const { TextArea } = Input;

export const FranchiseCreateUpdateForm = (props: Props) => {
    const {
        formType,
        initialFields,
        onSubmit,
        onClose,
        isLoading,
        cities,
        cityLoading
    } = props;

    const [form] = Form.useForm();

    const options = selectOptionsParser(cities, 'title', 'id')

    const formFields = [
        {
            name: 'title',
            element: <Input placeholder="Введите название" />,
            label: 'Название',
            rules: [{
                required: true,
                message: 'Обязательное поле!'
            }]
        },
        {
            name: 'description',
            element: <TextArea placeholder="Введите описание" />,
            label: 'Описание',
        },
        {
            name: 'address',
            element: <Input placeholder="Введите адрес" />,
            label: 'Адрес',
            rules: [{
                required: true,
                message: 'Обязательное поле!'
            }]
        },
        {
            name: 'latitude',
            element: <InputNumber placeholder="Введите широту" style={{ width: '100%' }} />,
            label: 'Широта',
            rules: [{
                required: true,
                message: 'Обязательное поле!'
            }]
        },
        {
            name: 'longitude',
            element: <InputNumber placeholder="Введите долготу" style={{ width: '100%' }} />,
            label: 'Долгота',
            rules: [{
                required: true,
                message: 'Обязательное поле!'
            }]
        },
        {
            name: 'city',
            element: <Select
                placeholder={`Выберите город`}
                optionFilterProp="label"
                options={options}
                loading={cityLoading}
            />,
            label: 'ID города',
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
