export const formatMinutesToHours = (minutes: number) => {
  return `${Math.floor(minutes / 60)}:${
    minutes % 60 >= 10 ? minutes % 60 : `0${minutes % 60}`
  } h`;
};

export const formatMetersToKm = (meters: number) => {
  return `${
    (Math.floor(meters / 1000) * 1000 +
      Math.round((meters % 1000) / 100) * 100) /
    1000
  } km`;
};
