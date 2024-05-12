import { ReactNode, useState } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import {StateContextProvider} from "../../contexts";

// const queryClient = new QueryClient();
function Providers({ children }: { children: ReactNode }) {
    const [client] = useState(
        new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        }),
    );

    return (
        // <QueryClientProvider client={queryClient}>
        <QueryClientProvider client={client}>
            <StateContextProvider>
            {children}
        </StateContextProvider>
        </QueryClientProvider>
    );
}

export default Providers;
