import {Button, Select, Table, Typography} from 'antd';
import {TableType} from "../../../types/common.ts";
import {selectOptionsParser} from "../../../utils/selectOptionsParser.ts";
import {IFranchise} from "../../../types/franchiseTypes.ts";
import {useState} from "react";
import {Spinner} from "../../Shared/Spinner";

type Props = {
    columns: TableType<any>
    data: any
    onCreate: (id: number) => void
    procSpecList: any
    isLoading: boolean
}

export const SpecProcTableAction = ({columns, data, onCreate, procSpecList, isLoading}: Props) => {

    const {Title} = Typography

    const [value, setValue] = useState<number | null>(null)

    const [isOpenSelect, setOpenSelect] = useState(false)

    const options =
        selectOptionsParser<IFranchise>(procSpecList ?? [], 'title', 'id')

    const handleCreate = () => {
        onCreate(value as number)
    }

    if (isLoading) {
        return <Spinner/>
    }

    return <>
        <Title>Специальности доктора</Title>
        <Table
            columns={columns}
            dataSource={data}
            scroll={{ y: 240 }}
        />
        {!isOpenSelect ?
            <Button onClick={() => setOpenSelect(true)}>Добавить специальность доктора</Button> :
            <div>
                <Select
                    onChange={(value: number) => {
                        setValue(value)
                    }}
                    style={{width: 'max-content', color: 'red'}}
                    options={options}
                    showSearch
                    popupMatchSelectWidth={false}
                    labelRender={(e) => <div
                        style={{
                            color: '#fff',
                            maxWidth: 300,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            cursor: "pointer"
                        }}
                    >{e?.label}
                    </div>
                    }

                />
                <Button
                    type={"primary"}
                    onClick={() => handleCreate()}
                    disabled={!!value}
                >
                    Создать
                </Button>
            </div>
        }
    </>
};
