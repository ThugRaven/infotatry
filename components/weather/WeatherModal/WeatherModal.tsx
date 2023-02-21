import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react';
import { IconButton } from '@components/ui';
import classNames from 'classnames';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { MdClose, MdSouth } from 'react-icons/md';
import {
  CurrentWeatherResponse,
  WeatherForecastResponse,
} from 'types/weather-types';
import CurrentWeather from '../CurrentWeather';
import WeatherDataItem from '../WeatherDataItem';
import s from './WeatherModal.module.css';

interface WeatherModalProps {
  location: string;
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

const dateFormat = Intl.DateTimeFormat(undefined, {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
});

const dayFormat = Intl.DateTimeFormat(undefined, {
  weekday: 'long',
});

const timeFormat = Intl.DateTimeFormat(undefined, {
  timeStyle: 'short',
});

const WeatherModal = ({
  location,
  weatherData: { currentWeather, weatherForecast },
  isOpen,
  onClose,
}: WeatherModalProps) => {
  const [itemIndex, setItemIndex] = useState(0);

  useEffect(() => {
    setItemIndex(0);
  }, [currentWeather, weatherForecast]);

  const selectedItem = weatherForecast && weatherForecast.list[itemIndex];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={'full'}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent className={classNames(s.modal, s.modal__content)}>
        <IconButton
          buttonType="action"
          aria-label="Close"
          onClick={onClose}
          className={s.popup__close}
        >
          <MdClose />
        </IconButton>
        <div className={classNames(s.card, s.location)}>
          <h2 className={s.location__name}>{location}</h2>
        </div>
        <div className={s.modal__wrapper}>
          <aside className={classNames(s.card, s.aside)}>
            <h3 className={s.title}>Aktualna pogoda</h3>
            <CurrentWeather
              location={location}
              weather={currentWeather}
              full={true}
            />
          </aside>
          <main className={s.main}>
            <section className={classNames(s.card, s['card--forecast'])}>
              <h3 className={s.title}>Prognoza</h3>
              <ul className={s.forecast__list}>
                {weatherForecast &&
                  weatherForecast.list.map((data, index) => (
                    <li key={data.dt}>
                      <button
                        className={classNames(s.forecast__btn, {
                          [s['forecast__btn--active']]: index === itemIndex,
                        })}
                        onClick={() => setItemIndex(index)}
                      >
                        <span className={s.forecast__date}>
                          {dateTimeFormat.format(data.dt * 1000)}
                        </span>
                        <Image
                          className={s.icon}
                          src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                          alt={data.weather[0].main}
                          layout={'fixed'}
                          width={100}
                          height={100}
                        />
                        <span className={s.desc}>{data.weather[0].main}</span>
                        <div className={s.forecast__temperature}>
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
            <section
              className={classNames(s.card, s['card--forecast-details'])}
            >
              {selectedItem && (
                <>
                  <h3 className={s.title}>Szczegóły</h3>
                  <div className={s.forecast__details}>
                    <div className={s.details}>
                      <span>{dateFormat.format(selectedItem.dt * 1000)}</span>
                      <span>{dayFormat.format(selectedItem.dt * 1000)}</span>
                      <span>{timeFormat.format(selectedItem.dt * 1000)}</span>
                      <div className={s.temperature}>
                        <span className={s.temperature__value}>
                          {Math.round(selectedItem.main.temp ?? 0)}
                        </span>
                        <span className={s.temperature__unit}>°C</span>
                      </div>
                      <div className={s['feels-like']}>
                        Odczuwalna{' '}
                        {Math.round(selectedItem.main.feels_like ?? 0)}
                        <span>°C</span>
                      </div>
                      <Image
                        className={s.icon}
                        src={`https://openweathermap.org/img/wn/${selectedItem.weather[0].icon}@2x.png`}
                        alt={selectedItem.weather[0].main}
                        layout={'fixed'}
                        width={100}
                        height={100}
                      />
                      <span>{selectedItem.weather[0].main}</span>
                      <span className={s.desc}>
                        {selectedItem.weather[0].description}
                      </span>
                    </div>
                    <ul className={s['forecast-data__grid']}>
                      {[
                        {
                          name: 'Ciśnienie',
                          value: selectedItem.main.pressure,
                          unit: 'hPa',
                        },

                        {
                          name: 'Wiatr',
                          value: selectedItem.wind.speed,
                          unit: 'm/s',
                        },
                        {
                          name: 'Ciśnienie grunt',
                          value: selectedItem.main.grnd_level,
                          unit: 'hPa',
                        },
                        {
                          name: 'Wilgotność',
                          value: selectedItem.main.humidity,
                          unit: '%',
                        },
                        {
                          children: (
                            <MdSouth
                              className={s['wind-dir']}
                              style={{
                                transform: `rotate(${selectedItem.wind.deg}deg)`,
                              }}
                            />
                          ),
                          value: `${selectedItem.wind.deg}°`,
                        },
                        {
                          name: 'Zachmurzenie',
                          value: selectedItem.clouds.all,
                          unit: '%',
                        },
                        {
                          name: 'Opady',
                          value: Math.round(selectedItem.pop * 100),
                          unit: '%',
                        },
                        {
                          name: 'Porywy wiatru',
                          value: selectedItem.wind.gust,
                          unit: 'm/s',
                        },
                        {
                          name: 'Opad',
                          value:
                            (selectedItem.rain?.['3h'] ||
                              selectedItem.snow?.['3h']) ??
                            0,
                          unit: 'mm/h',
                        },
                        {
                          name: 'Widoczność',
                          value:
                            selectedItem.visibility > 1000
                              ? Math.round(selectedItem.visibility / 100) / 10
                              : selectedItem.visibility,
                          unit: selectedItem.visibility > 1000 ? 'km' : 'm',
                        },
                      ].map((data, index) => (
                        <WeatherDataItem
                          key={`${index}-${data.name}`}
                          data={data}
                        >
                          {data.children}
                        </WeatherDataItem>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </section>
          </main>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default WeatherModal;
