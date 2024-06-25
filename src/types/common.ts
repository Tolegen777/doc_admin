import type { TableProps } from 'antd';

export interface IDate {
    day: number,
    month: string,
    weekday: string,
    date: string,
    time: string
}

export interface IGet<T> {
    count: number
    next: string
    previous: any
    results: T[]
}

export type ActionType = 'create' | 'update' | ''

export type TableType<T> = TableProps<T>['columns']

export type FormInitialFieldsParamsType = {
    name: string;
    value: string | number | boolean | [] | object | null | undefined;
};
