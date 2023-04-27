import Image from 'next/image';
import { MdSouth } from 'react-icons/md';
import { CurrentWeatherResponse } from 'types/weather-types';
import openWeatherLogo from '../../../public/openweather-logo.png';
import WeatherDataItem from '../WeatherDataItem';
import s from './CurrentWeather.module.css';

interface CurrentWeatherProps {
  location: string;
  weather?: CurrentWeatherResponse;
  full?: boolean;
  onWeatherModalOpen?: () => void;
}

const dateTimeFormat = Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: 'numeric',
});

const timeFormat = Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
  minute: 'numeric',
});

const CurrentWeather = ({
  location,
  weather,
  full = false,
  onWeatherModalOpen,
}: CurrentWeatherProps) => {
  return (
    <section className={s.container}>
      {!full && (
        <div className={s.location}>
          <span className={s.location__name}>{location}</span>
        </div>
      )}
      <span className={s.date}>
        {weather?.dt && dateTimeFormat.format(weather?.dt * 1000)}
      </span>

      <div className={s.temperature}>
        <span className={s.temperature__value}>
          {Math.round(weather?.main.temp ?? 0)}
        </span>
        <span className={s.temperature__unit}>°C</span>
      </div>
      <div className={s['feels-like']}>
        Odczuwalna {Math.round(weather?.main.feels_like ?? 0)}
        <span>°C</span>
      </div>
      {weather && (
        <Image
          className={s.icon}
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt={weather.weather[0].main}
          layout={'fixed'}
          width={100}
          height={100}
        />
      )}
      <span>{weather?.weather[0].main}</span>
      <span className={s.desc}>{weather?.weather[0].description}</span>
      {full && weather ? (
        <>
          <ul className={s['weather-data__grid']}>
            {[
              {
                name: 'Ciśnienie',
                value: weather.main.pressure,
                unit: 'hPa',
              },
              {
                name: 'Widoczność',
                value:
                  weather.visibility > 1000
                    ? Math.round(weather.visibility / 100) / 10
                    : weather.visibility,
                unit: weather.visibility > 1000 ? 'km' : 'm',
              },
              {
                name: 'Wilgotność',
                value: weather.main.humidity,
                unit: '%',
              },
              {
                name: 'Wschód słońca',
                value: timeFormat.format(weather.sys.sunrise * 1000),
              },
              {
                name: 'Wiatr',
                value: weather.wind.speed,
                unit: 'm/s',
              },
              {
                name: 'Zachód słońca',
                value: timeFormat.format(weather.sys.sunset * 1000),
              },
              {
                name: 'Zachmurzenie',
                value: weather.clouds.all,
                unit: '%',
              },
              {
                children: (
                  <MdSouth
                    className={s['wind-dir']}
                    style={{
                      transform: `rotate(${weather.wind.deg}deg)`,
                    }}
                  />
                ),
                value: `${weather.wind.deg}°`,
              },
              {
                name: 'Opad',
                value: (weather.rain?.['1h'] || weather.snow?.['1h']) ?? 0,
                unit: 'mm/h',
              },
            ].map((data, index) => (
              <WeatherDataItem key={`${index}-${data.name}`} data={data}>
                {data.children}
              </WeatherDataItem>
            ))}
          </ul>
          <div className={s.attribution}>
            <span>Dane pogodowe dostarczane przez OpenWeather</span>
            <a
              href="https://openweathermap.org/"
              target="_blank"
              rel="noopener noreferrer"
              className={s.link}
            >
              <div className={s.image}>
                <Image
                  src={openWeatherLogo}
                  alt="OpenWeatherMap Logo"
                  layout="responsive"
                />
              </div>
            </a>
          </div>
        </>
      ) : (
        <>
          <div className={s.attribution}>
            <span>Dane OpenWeather</span>
            <a
              href="https://openweathermap.org/"
              target="_blank"
              rel="noopener noreferrer"
              className={s.link}
            >
              https://openweathermap.org/
            </a>
          </div>
          <button className={s.details__btn} onClick={onWeatherModalOpen}>
            Szczegóły
          </button>
        </>
      )}
    </section>
  );
};

export default CurrentWeather;
