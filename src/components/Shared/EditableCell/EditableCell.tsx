import React from "react";
import {Form, Input, InputNumber, Switch} from "antd";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text' | 'switch';
    record: any;
    index: number;
}

export const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
                                                                                editing,
                                                                                dataIndex,
                                                                                title,
                                                                                inputType,
                                                                                record,
                                                                                index,
                                                                                children,
                                                                                ...restProps
                                                                            }) => {

    const getInputNode = (() => {
        switch (inputType) {
            case 'number':
                return <InputNumber />;
            case 'switch':
                return <Switch />;
            default:
                return <Input />;
        }
    });

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    valuePropName={inputType === 'switch' ? 'checked' : 'value'}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {getInputNode()}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};
