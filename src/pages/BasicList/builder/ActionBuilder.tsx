import { Button } from 'antd';
import type { ButtonType } from 'antd/lib/button';

const ActionsBuilder = (actions: BasicListApi.Action[] | undefined) => {
  return (actions || []).map((action: any) => {
    if (action.component === 'button') {
      return <Button type={action.type as ButtonType}>{action.text}</Button>;
    }
    return null;
  });
};

export default ActionsBuilder;
