import { useEffect, useState } from 'react';
import './yearSelector.css';

type YearSelector = {
    visible: boolean;
    changeYear(year: number): () => void;
};

export default function YearSelector({ visible, changeYear }: YearSelector) {
    const [years, setYears] = useState<number[]>([]);
    useEffect(() => {
        const getYears = async () => {
            const response = await fetch(
                'http://localhost:5000/api/movies/min-max'
            );
            if (response.ok) {
                const data = await response.json();
                const yearsArray: number[] = [];

                for (let i = data.max; i >= data.min; i--) {
                    yearsArray.push(i);
                }
                setYears(yearsArray);
            }
        };
        getYears();
    }, []);

    return (
        <div className={`yearSelector ${visible ? 'year-active' : ''}`}>
            <div className='year-content'>
                <div className='year-header'>
                    <span>Select a year</span>
                </div>
                <div className='year-body'>
                    {years.map((val, i) => {
                        return (
                            <option
                                key={i}
                                onClick={() => {
                                    changeYear(val);
                                }}
                            >
                                {val}
                            </option>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
