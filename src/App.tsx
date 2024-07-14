import type { FC } from 'react'
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';


const App: FC = () =>  (
    <ConfigProvider
        theme={{
            token: {
                fontFamily: 'Museo Sans Cyrl, sans-serif',
                colorPrimary: '#5194C1',
            },
            components: {
                Input: {
                    controlHeight: 44
                },
                Select: {
                    controlHeight: 44
                },
                DatePicker: {
                    controlHeight: 44
                }
            }
        }}
    >
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    </ConfigProvider>
)

export default App
