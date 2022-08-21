import styles from './BaseTemplate.module.css';

interface BaseTemplateProps {
  prop: string;
}

const BaseTemplate = ({ prop }: BaseTemplateProps) => {
  return <div className={styles.container}>{prop}</div>;
};

export default BaseTemplate;
