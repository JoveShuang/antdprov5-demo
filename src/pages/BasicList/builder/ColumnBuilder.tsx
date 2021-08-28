import moment from 'moment';
import { Tag, Space } from 'antd';
import ActionsBuilder from './ActionBuilder';

const ColumnBuilder = (tableColumn: BasicListApi.TableColumn[] | undefined) => {
  // return [{ title: 'ID', dataIndex: 'id', key: 'id'}]
  //   .concat(
  //     init?.data?.layout?.tableColumn
  //     .filter((item) => item.hideInColumn !== true) || []
  //   )
  const newColumns: BasicListApi.TableColumn[] = [];
  (tableColumn || []).forEach((column: any) => {
    if (column.hideInColumn !== true) {
      switch (column.type) {
        case 'datetime':
          column.render = (value: string) => {
            return moment(value).format('YYYY-MM-DD HH:mm:ss');
          };
          break;
        case 'switch':
          column.render = (value: any) => {
            const option = (column?.data || []).find((item: any) => item.value === value);
            return <Tag color={value ? 'blue' : 'red'}>{option?.title}</Tag>;
          };
          break;
        case 'actions':
          column.render = () => {
            return <Space>{ActionsBuilder(column.actions)}</Space>;
          };
          break;
        default:
          break;
      }
      newColumns.push(column);
    }
  });
  const idColumn = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
  ];
  return idColumn.concat(newColumns);
};

export default ColumnBuilder;
