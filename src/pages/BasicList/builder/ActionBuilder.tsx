import { Button } from 'antd';
import type { ButtonType } from 'antd/lib/button';

const ActionsBuilder = (
  actions: BasicListApi.Action[] | undefined,
  actionHandler: BasicListApi.Action,
) => {
  return (actions || []).map((action: any) => {
    if (action.component === 'button') {
      return (
        <Button
          key={action.text}
          type={action.type as ButtonType}
          onClick={() => {
            actionHandler(action);
          }}
        >
          {action.text}
        </Button>
      );
    }
    return null;
  });
};

export default ActionsBuilder;
