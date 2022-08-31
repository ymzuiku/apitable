import { Alert } from '@vikadata/components';
import { Strings, t } from '@vikadata/core';
import { FC } from 'react';
import styles from './style.module.less';

export const InviteAlert: FC = () => {
  return (
    <Alert
      type='default'
      className={styles.inviteAlert}
      content={t(Strings.invite_give_capacity_intro)}
    />
  );
};
