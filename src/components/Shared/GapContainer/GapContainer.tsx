import { ReactNode, CSSProperties } from "react";

type Props = {
    flexDirection?: 'row' | 'column',
    gap?: string | number, // Лучше использовать number для gap
    alignItems?: CSSProperties['alignItems'], // Используем тип из CSSProperties для alignItems и justifyContent
    justifyContent?: CSSProperties['justifyContent'],
    children: ReactNode
}

const GapContainer = ({flexDirection, alignItems, justifyContent, gap, children, ...props}: Props & React.HTMLAttributes<HTMLDivElement>) => {
    const containerStyle: CSSProperties = {
        display: 'flex',
        alignItems: alignItems,
        justifyContent: justifyContent,
        gap: gap,
        flexDirection: flexDirection
    };

    return (
        <div style={containerStyle} {...props}>
            {children}
        </div>
    );
};

export default GapContainer;
