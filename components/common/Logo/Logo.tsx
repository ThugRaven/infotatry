import LogoIcon from '@components/icons/LogoIcon';
import s from './Logo.module.css';

// interface LogoProps {}

// {}: LogoProps
const Logo = () => {
  return (
    <div className={s.logo}>
      <LogoIcon className={s.icon} />
      InfoTatry
    </div>
  );
};

export default Logo;
