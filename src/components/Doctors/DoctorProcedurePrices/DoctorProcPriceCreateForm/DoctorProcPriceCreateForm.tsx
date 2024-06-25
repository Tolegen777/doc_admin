import styles from './styles.module.scss'
import {Form, InputNumber, Select, Switch} from "antd";

const formFields = [
    {
        name: 'default_price',
        element: <InputNumber style={{width: '100%'}} size={'large'}/>,
        label: 'Стоимость услуги по умолчанию',
        rules: [{required: true}]
    },
    {
        name: 'discount',
        element: <InputNumber style={{width: '100%'}} size={'large'}/>,
        label: 'Скидка в процентах',
        rules: [
            {
                required: true,
            },
            {
                max: 100,
                message: 'Максимальное возможное количество 100%'
            }
        ]
    },
    {
        name: 'final_price',
        element: <InputNumber style={{width: '100%'}} size={'large'}/>,
        label: 'Конечная стоимость услуги',
        rules: [{required: true}]
    },
    {
        name: 'child_age_from',
        element: <Select options={[]} size={'large'}/>,
        label: 'Возраст детей от',
        rules: [{required: true}]
    },
    {
        name: 'child_age_to',
        element: <Select options={[]} size={'large'}/>,
        label: 'Возраст детей до',
        rules: [{required: true}]
    },
];

export const DoctorProcPriceCreateForm = ({form}: { form: any }) => {

    return (
        <div className={styles.container}>
            <Form
                autoComplete={'off'}
                form={form}
                layout="vertical"
            >
                {formFields.map(field => (
                    <Form.Item
                        key={field.name}
                        name={field.name}
                        label={field.label}
                    >
                        {field.element}
                    </Form.Item>
                ))}
                <Form.Item
                    name="is_for_children"
                    label="Детский прием"
                    rules={[{required: true}]}
                    valuePropName={'checked'}
                >
                    <Switch/>
                </Form.Item>
            </Form>
        </div>
    );
};
