import styles from './styles.module.scss'
import {Pagination} from 'antd';

type Props = {
    totalCount: number,
    setPage: (page: number) => void
}

const CustomPagination = ({totalCount, setPage} : Props) => {

    const handleChange = (val: number) => {
       setPage(val)
    }

    return (
        <div className={styles.container}>
                <Pagination
                    defaultCurrent={1}
                    total={totalCount}
                    onChange={handleChange}
                    showSizeChanger={false}
                    size={'default'}
                />
        </div>
    );
};

export default CustomPagination;
