import { useEffect, useRef, useState } from 'react';
import './yearSelector.css';

type YearSelector = {
    visible: boolean;
    setVisible(): void;
    changeYear(year: number): void;
};

export default function YearSelector({
    visible,
    setVisible,
    changeYear,
}: YearSelector) {
    // Refs
    const selectorRef = useRef<HTMLDivElement>(null);

    // States
    const [years, setYears] = useState<number[]>([]);

    // Effects

    // Get the min and max years, to complete the list
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

    useEffect(() => {
        if (visible) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [visible]);

    const handleClickOutside = (event: MouseEvent) => {
        if (
            selectorRef.current &&
            !selectorRef.current.contains(event.target as Node)
        ) {
            setVisible();
        }
    };

    return (
        <div
            className={`yearSelector ${visible ? 'year-active' : ''}`}
            ref={selectorRef}
        >
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
