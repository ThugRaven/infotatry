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

export const cardinalDirectionToBooleanArray = (direction: string) => {
  switch (direction) {
    case 'N':
      return [true, false, false, false, false, false, false, false];
    case 'NE':
      return [false, true, false, false, false, false, false, false];
    case 'E':
      return [false, false, true, false, false, false, false, false];
    case 'SE':
      return [false, false, false, true, false, false, false, false];
    case 'S':
      return [false, false, false, false, true, false, false, false];
    case 'SW':
      return [false, false, false, false, false, true, false, false];
    case 'W':
      return [false, false, false, false, false, false, true, false];
    case 'NW':
      return [false, false, false, false, false, false, false, true];
    default:
      return [false, false, false, false, false, false, false, false];
  }
};

export const getAvalancheLevelName = (level: number | null) => {
  const _level = level != null && level >= 0 && level <= 5 ? level : null;

  return _level === 0
    ? 'Brak zagrożenia lawinowego'
    : _level === 1
    ? 'Niskie'
    : _level === 2
    ? 'Umiarkowane'
    : _level === 3
    ? 'Znaczne'
    : _level === 4
    ? 'Wysokie'
    : _level === 5
    ? 'Bardzo wysokie'
    : null;
};
