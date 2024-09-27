import { Movie } from '../../types/api';
import './InfoPopUp.css';
import Line from './Line';
import CloseIcon from '../../assets/close_icon.svg';

type InfoPopUpProps = {
    movie: Movie;
    onClose: () => void;
};
export default function InfoPopUp({ movie, onClose }: InfoPopUpProps) {
    return (
        <div className='popup'>
            <div className='popup-content'>
                <div className='popup-header'>
                    <h1>{movie.title}</h1>
                    <div className='close-btn' onClick={onClose}>
                        <img src={CloseIcon} alt='close' />
                        <span>Close</span>
                    </div>
                </div>
                <hr />
                <div className='popup-body'>
                    <Line text='Year' value={movie.year} />
                    <Line text='Genre' value={movie.genre} />
                    <Line text='Description' value={movie.description} />
                    <div className='double-line'>
                        <Line text='Director' value={movie.director} blue />
                        <Line text='Actors' value={movie.actors} blue />
                    </div>

                    <Line
                        text='Runtime'
                        value={movie.runtime.toString() + ' mins'}
                    />
                    <Line text='Votes' value={movie.votes} />
                    <Line
                        text='Revenue'
                        value={`$${movie.box_office_revenue.toLocaleString(
                            'en-US'
                        )}`}
                    />
                    <Line text='Metascore' value={movie.metascore} />
                </div>
            </div>
        </div>
    );
}
