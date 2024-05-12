import styles from './styles.module.scss'
import {ReactNode} from "react";
import Header from "../Header/Header.tsx";
import NavigationMenu from "../NavigationMenu/Header.tsx";

type Props = {
    children: ReactNode
}
const ClientLayout = ({children}: Props) => {
    return (
        <div className={styles.container}>
            <Header/>
            <div className={styles.container_content}>
                <NavigationMenu/>
                {children}
            </div>
        </div>
    );
};

export default ClientLayout;
