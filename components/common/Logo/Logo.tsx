import LogoIcon from '@components/icons/LogoIcon';
import classNames from 'classnames';
import s from './Logo.module.css';

// interface LogoProps {}

// {}: LogoProps
const Logo = ({
  className,
  textClassName,
  ...props
}: { textClassName?: string } & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={classNames(className, s.logo)} {...props}>
      <LogoIcon className={s.icon} />
      <span className={textClassName}>InfoTatry</span>
    </div>
  );
};

export default Logo;
