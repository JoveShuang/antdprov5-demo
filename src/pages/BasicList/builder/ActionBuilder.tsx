import { Button } from 'antd';
import moment from 'moment';
import type { ButtonType } from 'antd/lib/button';
import styles from './ActionBuilder.less';

const ActionsBuilder = (
  actions: BasicListApi.Action[] | undefined,
  actionHandler: BasicListApi.ActionHandler,
  loading?: false,
  record?: any,
  update_time?: '',
) => {
  const componentArr = [];
  if (update_time) {
    componentArr.push(
      <span className={styles.update_time}>
        Update Time: {moment(update_time).format('YYYY-MM-DD HH:mm:ss')}
      </span>,
    );
  }
  const actionsArr = (actions || []).map((action: any) => {
    if (action.component === 'button') {
      return (
        <Button
          key={action.text}
          type={action.type as ButtonType}
          onClick={() => {
            actionHandler(action, record || {});
          }}
          loading={loading}
        >
          {action.text}
        </Button>
      );
    }
    return <span />;
  });
  return componentArr.concat(actionsArr);
};

export default ActionsBuilder;
