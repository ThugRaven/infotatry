import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';
import classNames from 'classnames';
import Image from 'next/image';
import {
  CurrentWeatherResponse,
  WeatherForecastResponse,
} from 'types/weather-types';
import CurrentWeather from '../CurrentWeather';
import s from './WeatherModal.module.css';

interface WeatherModalProps {
  weatherData: {
    currentWeather?: CurrentWeatherResponse;
    weatherForecast?: WeatherForecastResponse;
  };
  isOpen: boolean;
  onClose: () => void;
}

const dateTimeFormat = Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

const timeFormat = Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
  minute: 'numeric',
});

const WeatherModal = ({
  weatherData: { currentWeather, weatherForecast },
  isOpen,
  onClose,
}: WeatherModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={'full'}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent className={classNames(s.modal, s.modal__content)}>
        <ModalCloseButton />
        <aside className={s.card}>
          <CurrentWeather
            location="Morskie Oko"
            weather={currentWeather}
            full={true}
          />
        </aside>
        <main className={s.main}>
          <section className={classNames(s.card, s['card--forecast'])}>
            <h2 className={s.title}>Prognoza</h2>
            <ul className={s.forecast__list}>
              {weatherForecast?.list.map((data) => (
                <li key={data.dt}>
                  <button className={s.forecast__btn}>
                    <span className={s.forecast__date}>
                      {dateTimeFormat.format(data.dt * 1000)}
                    </span>
                    <Image
                      className={s.icon}
                      src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                      alt={data.weather[0].main}
                      width={100}
                      height={100}
                    />
                    <span className={s.desc}>{data.weather[0].main}</span>
                    <div className={s.temperature}>
                      <span className={s['temp__value']}>
                        {Math.round(data.main.temp)}°
                      </span>
                      <span className={s['temp__value--feels-like']}>
                        {Math.round(data.main.feels_like)}°
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <section className={s.card}></section>
        </main>
      </ModalContent>
    </Modal>
  );
};

export default WeatherModal;
