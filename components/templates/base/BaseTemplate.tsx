import s from './BaseTemplate.module.css';

interface BaseTemplateProps {
  prop: string;
}

const BaseTemplate = ({ prop }: BaseTemplateProps) => {
  return <div className={s.container}>{prop}</div>;
};

export default BaseTemplate;
