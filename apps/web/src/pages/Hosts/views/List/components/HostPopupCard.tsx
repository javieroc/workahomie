import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Host } from 'src/types';
import { Icon } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { OCCUPATIONS } from 'src/constants/occupations';
import styles from './HostPopupCard.module.css';

interface HostPopupCardProps {
  host: Host;
}

const HostPopupCard: FC<HostPopupCardProps> = ({ host }) => {
  const navigate = useNavigate();
  const firstImage =
    host.pictures?.[0] || host.profileImages?.[0] || 'https://via.placeholder.com/250x150';
  const occupation = OCCUPATIONS.find((o) => o.name === host.occupation);

  const handleClick = () => {
    navigate(`/hosts/${host._id}`);
  };

  return (
    <div
      className={styles['popup-container']}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleClick();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <img src={firstImage} alt={host.placeDescription} className={styles['host-image']} />
      <div className={styles['popup-content']}>
        <h2 className={styles['host-name']}>{`${host.firstName} ${host.lastName}`}</h2>
        <div className={styles['host-occupation']}>
          {occupation && <Icon as={occupation.icon} className={styles['occupation-icon']} />}
          <h2>{host.occupation}</h2>
        </div>
        <h2 className={styles['host-address']}>
          {host?.addressObj?.display_name ?? host?.address}
        </h2>
        {host.phone && <h2 className={styles['host-phone']}>{host.phone}</h2>}
        <div className={styles['host-rating']}>
          <Icon as={StarIcon} color="yellow.400" />
          <span className={styles['host-rating-value']}>{host.rate?.toFixed(1) || 'N/A'}</span>
          <span className={styles['host-rating-count']}>({host.countReviews || 0} reviews)</span>
        </div>
      </div>
    </div>
  );
};

export { HostPopupCard };
