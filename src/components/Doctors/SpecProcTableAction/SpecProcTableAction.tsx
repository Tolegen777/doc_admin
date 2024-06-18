import {Button, Form, Select, Table, Typography} from 'antd';
import {TableType} from "../../../types/common.ts";
import {selectOptionsParser} from "../../../utils/selectOptionsParser.ts";
import {useState} from "react";
import {Spinner} from "../../Shared/Spinner";
import styles from './styles.module.scss'
import GapContainer from "../../Shared/GapContainer/GapContainer.tsx";

type Props = {
    columns: TableType<any>
    data: any
    onCreate: (id: number) => void
    procSpecList: any
    isLoading: boolean,
    entityType: 'speciality' | 'procedure'
}

export const SpecProcTableAction = ({
                                        columns,
                                        data,
                                        onCreate,
                                        procSpecList,
                                        isLoading,
                                        entityType
                                    }: Props) => {

    const {Title} = Typography

    const [value, setValue] = useState<number | null>(null)

    const [isOpenSelect, setOpenSelect] = useState(false)

    const options =
        selectOptionsParser(procSpecList ?? [], 'medical_speciality_title', 'medical_speciality_id')

    console.log(value, 'LLL')

    const handleCreate = () => {
        onCreate(value as number)
    }

    if (isLoading) {
        return <Spinner/>
    }

    return <div className={styles.container}>
        <Title>Специальности доктора</Title>
        <Table
            columns={columns}
            dataSource={data}
            scroll={{y: 240}}
            pagination={false}
            style={{marginBottom: 30}}
        />
        {!isOpenSelect ?
            <Button
                onClick={() => setOpenSelect(true)}
                type={'primary'}
            >
                Добавить специальность доктора
            </Button> :
            <GapContainer gap={10}>
                <Select
                    showSearch
                    style={{width: 300}}
                    placeholder={`Выберите ${entityType === "speciality" ? "специальность" : 'процедуру'}`}
                    optionFilterProp="label"
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    options={options}
                    popupMatchSelectWidth={false}
                    onChange={(value: number) => {
                        console.log(value, 'VALUE')
                        setValue(value)
                    }}
                />
                <Button
                    type={"primary"}
                    onClick={() => handleCreate()}
                    disabled={!value}
                >
                    Создать
                </Button>
            </GapContainer>
        }
    </div>
};
