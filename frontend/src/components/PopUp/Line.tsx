import './Line.css';

type LineProps = {
    text: string;
    value: string | number;
    blue?: boolean;
};

export default function Line({ text, value, blue }: LineProps) {
    return (
        <div className='line'>
            <span>{text}</span>
            <p className={blue ? 'blue' : 'dark'}>{value}</p>
        </div>
    );
}
