import type { FC } from 'react'
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';


const App: FC = () =>  (
    <ConfigProvider
        theme={{
            token: {
                fontFamily: 'Museo Sans Cyrl, sans-serif',
            },
        }}
    >
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    </ConfigProvider>
)

export default App
