import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Card, Pagination, Space } from 'antd';
import { useRequest } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './index.less';
import ColumnBuilder from './builder/ColumnBuilder';
import ActionsBuilder from './builder/ActionBuilder';

const Index = () => {
  const [page, setPage] = useState(1);
  const [per_page, setPerPage] = useState(10);
  const [order, setOrder] = useState('desc')
  const init = useRequest<{ data: BasicListApi.Data }>(
    `https://public-api-v2.aspirantzhang.com/api/admins?X-API-KEY=antd&page=${page}&per_page=${per_page}&sort=${['create_time']}&order=${order}`,
  );

  useEffect(() => {
    init.run();
  }, [page, per_page, order]);

  const searchLayout = () => {};
  const beforeTableLayout = () => {
    return (
      <Row>
        <Col xs={24} sm={12}>
          ...
        </Col>
        <Col xs={24} sm={12} className={styles.tableToolBar}>
          <Space>{ActionsBuilder(init.data?.layout?.tableToolBar)}</Space>
        </Col>
      </Row>
    );
  };
  const paginationChangeHandler = (_page: any, _per_page: any) => {
    setPage(_page);
    setPerPage(_per_page);
  };

  const onChange = (pagination, filters, sorter, extra) => {
    if (sorter?.order === 'descend') {
      setOrder('desc')
    } else if (sorter?.order === 'ascend') {
      setOrder('asc')
    } else {
      setOrder('')
    }
  }

  const afterTableLayout = () => {
    return (
      <Row>
        <Col xs={24} sm={12}>
          ...
        </Col>
        <Col xs={24} sm={12} className={styles.tableToolBar}>
          <Pagination
            total={init?.data?.meta?.total || 0}
            current={init?.data?.meta?.page || 1}
            pageSize={init?.data?.meta?.per_page || 10}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Total ${total} items`}
            onChange={paginationChangeHandler}
            onShowSizeChange={paginationChangeHandler}
          />
        </Col>
      </Row>
    );
  };

  return (
    <PageContainer>
      {searchLayout()}
      <Card>
        {beforeTableLayout()}
        <Table
          dataSource={init?.data?.dataSource}
          columns={ColumnBuilder(init?.data?.layout?.tableColumn)}
          pagination={false}
          loading={init.loading}
          onChange={onChange}
        />
        {afterTableLayout()}
      </Card>
    </PageContainer>
  );
};

export default Index;
