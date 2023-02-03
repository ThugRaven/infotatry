export const formatMinutesToHours = (minutes: number, includeUnit = false) => {
  return `${Math.floor(minutes / 60)}:${
    minutes % 60 >= 10 ? minutes % 60 : `0${minutes % 60}`
  }${includeUnit ? ' h' : ''}`;
};

export const formatMetersToKm = (meters: number, includeUnit = false) => {
  return `${
    (Math.floor(meters / 1000) * 1000 +
      Math.round((meters % 1000) / 100) * 100) /
    1000
  }${includeUnit ? ' km' : ''}`;
};
