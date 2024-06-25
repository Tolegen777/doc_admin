import {Button} from 'antd';

type Props = {
    action: () => void,
    text: string
    type?: 'default' | 'primary' | 'dander',
    disabled?: boolean
}

const textColors = {
    default: '#000000',
    dander: '#ED6D6C',
    primary: '#5194C1'
}

export const TextButton = ({action, type = 'default', text, disabled = false}: Props) => {

    return <Button
        type={'text'}
        color={textColors[type]}
        onClick={action}
        style={{color: textColors[type]}}
        disabled={disabled}
    >
        {text}
    </Button>
};
