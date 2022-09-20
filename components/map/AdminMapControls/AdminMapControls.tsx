import { AddIcon } from '@chakra-ui/icons';
import s from './AdminMapControls.module.css';

interface AdminMapControlsProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const AdminMapControls = ({ onClick }: AdminMapControlsProps) => {
  const controls = [
    {
      id: 'trail',
      name: 'Add trail',
      icon: <AddIcon w={4} h={4} />,
    },
    {
      id: 'node',
      name: 'Add node',
      icon: <AddIcon w={4} h={4} />,
    },
  ];

  return (
    <ul className={s.container}>
      {controls.map((item) => (
        <li key={item.id}>
          <button
            name={item.id}
            className={s.button}
            title={item.name}
            onClick={onClick}
          >
            {item.icon}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default AdminMapControls;
