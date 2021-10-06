import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Card, Pagination, Space } from 'antd';
import { useRequest } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import ColumnBuilder from './builder/ColumnBuilder';
import ActionsBuilder from './builder/ActionBuilder';
import Modal from './component/Modal';
import styles from './index.less';

const Index = () => {
  const [page, setPage] = useState(1);
  const [per_page, setPerPage] = useState(10);
  const [sortQuery, setSortQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalUri, setModalUri] = useState('');
  const init = useRequest<{ data: BasicListApi.Data }>(
    `https://public-api-v2.aspirantzhang.com/api/admins?X-API-KEY=antd&page=${page}&per_page=${per_page}${sortQuery}`,
  );

  useEffect(() => {
    init.run();
  }, [page, per_page, sortQuery]);

  const searchLayout = () => {};
  const actionHandler = (action: BasicListApi.Action) => {
    switch (action.action) {
      case 'modal':
        setModalUri(action.uri as string);
        setModalVisible(true);
        break;
      default:
        break;
    }
  };
  const beforeTableLayout = () => {
    return (
      <Row>
        <Col xs={24} sm={12}>
          ...
        </Col>
        <Col xs={24} sm={12} className={styles.tableToolBar}>
          <Space>{ActionsBuilder(init.data?.layout?.tableToolBar, actionHandler, false)}</Space>
        </Col>
      </Row>
    );
  };
  const paginationChangeHandler = (_page: any, _per_page: any) => {
    setPage(_page);
    setPerPage(_per_page);
  };

  const onChange = (_: any, __: any, sorter: any) => {
    if (sorter?.order === undefined) {
      setSortQuery('');
    } else {
      const orderType = sorter?.order === 'descend' ? 'desc' : 'asc';
      setSortQuery(`&sort=${sorter.field}&order=${orderType}`);
    }
  };

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
          rowKey="id"
          dataSource={init?.data?.dataSource}
          columns={ColumnBuilder(init?.data?.layout?.tableColumn, actionHandler)}
          pagination={false}
          loading={init.loading}
          onChange={onChange}
        />
        {afterTableLayout()}
      </Card>
      <Modal
        modalVisible={modalVisible}
        hideModal={() => {
          setModalVisible(false);
        }}
        modalUri={modalUri}
      ></Modal>
    </PageContainer>
  );
};

export default Index;
