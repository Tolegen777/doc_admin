import styles from './styles.module.scss'
import {Button, Form, InputNumber, Switch} from "antd";
import {axiosInstance} from "../../../../api";
import {useQuery} from "@tanstack/react-query";
import {AgeType} from "../../../../types/doctor.ts";
import {FormInitialFieldsParamsType} from "../../../../types/common.ts";

type Props = {
    form: any,
    onSubmit: (value: any) => void,
    initialFields: FormInitialFieldsParamsType[]
}

export const DoctorProcPriceCreateForm = ({form, onSubmit, initialFields}: Props) => {

    const {data, isLoading} = useQuery({
        queryKey: [
            'ageChoicesList',
        ],
        queryFn: () =>
            axiosInstance
                .get<AgeType[]>(
                    `partners/age-choices/`)
                .then((response) => response?.data),
        refetchOnMount: false,
        enabled: false
    });

    // const options = selectOptionsParser(data ?? [], 'display', 'value')

    const formFields = [
        {
            name: 'default_price',
            element: <InputNumber style={{width: '100%'}} size={'large'}/>,
            label: 'Стоимость услуги по умолчанию',
            // rules: [{required: true, message: 'Обяательное поле'}]
        },
        {
            name: 'discount',
            element: <InputNumber style={{width: '100%'}} size={'large'}/>,
            label: 'Скидка в процентах',
            // rules: [
            //     {
            //         max: 100,
            //         message: 'Максимальное возможное количество 100%'
            //     }
            // ]
        },
        // {
        //     name: 'final_price',
        //     element: <InputNumber style={{width: '100%'}} size={'large'}/>,
        //     label: 'Конечная стоимость услуги',
        //     // rules: [{required: true, message: 'Обяательное поле'}]
        // },
        // {
        //     name: 'child_age_from',
        //     element: <Select options={options} size={'large'} loading={isLoading} popupMatchSelectWidth={false}/>,
        //     label: 'Возраст детей от',
        //     // rules: [{required: true, message: 'Обяательное поле'}]
        // },
        // {
        //     name: 'child_age_to',
        //     element: <Select options={options} size={'large'} loading={isLoading} popupMatchSelectWidth={false}/>,
        //     label: 'Возраст детей до',
        //     // rules: [{required: true, message: 'Обяательное поле'}]
        // },
        // {
        //     name: 'price_date',
        //     element: <DatePicker placeholder="Выберите дату" format="YYYY-MM-DD" style={{width: '100%'}} size={'large'}/>,
        //     label: 'Дата установки цены',
        // },
    ];

    return (
        <div className={styles.container}>
            <Form
                autoComplete={'off'}
                form={form}
                layout="vertical"
                onFinish={value => onSubmit(value)}
                fields={initialFields}
            >
                {formFields.map(field => (
                    <Form.Item
                        key={field.name}
                        name={field.name}
                        label={field.label}
                        // rules={field.rules}
                    >
                        {field.element}
                    </Form.Item>
                ))}
                <Form.Item
                    name="is_for_children"
                    label="Детский прием"
                    // rules={[{required: true}]}
                    valuePropName={'checked'}
                >
                    <Switch/>
                </Form.Item>
                <Button
                    onClick={form.submit}
                    type={"primary"}
                    disabled={isLoading}
                >
                    Создать
                </Button>
            </Form>
        </div>
    );
};
