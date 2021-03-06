import React, { useEffect, useState } from 'react';
import { useSessionStorageState, useToggle, useUpdateEffect } from 'ahooks';
import { stringify } from 'query-string';
// import QueueAnim from 'rc-queue-anim';
import {
  Table,
  Row,
  Col,
  Card,
  Pagination,
  Space,
  Modal as AntdModal,
  message,
  Button,
  Tooltip,
  Form,
  InputNumber,
} from 'antd';
import { useRequest, useIntl, history, useLocation } from 'umi';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import ColumnBuilder from './builder/ColumnBuilder';
import ActionsBuilder from './builder/ActionBuilder';
import SearchBuilder from './builder/SearchBuilder';
import Modal from './component/Modal';
import { submitFieldsAdaptor } from './helper';
import styles from './index.less';

const Index = () => {
  const [pageQuery, setPageQuery] = useState('');
  const [sortQuery, setSortQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalUri, setModalUri] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableColumns, setTableColumns] = useSessionStorageState<BasicListApi.Field[]>(
    'basicListTableColumns',
    [],
  );
  const [searchVisible, searchAction] = useToggle(false);
  const { confirm } = AntdModal;
  const intl = useIntl();
  const [searchForm] = Form.useForm();
  const location = useLocation();

  const init = useRequest<{ data: BasicListApi.Data }>(
    // `https://public-api-v2.aspirantzhang.com/api/admins?X-API-KEY=antd${pageQuery}${sortQuery}`,
    (values: any) => {
      return {
        url: `https://public-api-v2.aspirantzhang.com/${location.pathname.replace(
          '/basic-list',
          '',
        )}?X-API-KEY=antd${pageQuery}${sortQuery}`,
        params: values,
        paramsSerializer: (params: any) => {
          return stringify(params, { arrayFormat: 'comma', skipEmptyString: true, skipNull: true });
        },
      };
    },
  );

  const request = useRequest(
    ({ uri, method, ...formValues }) => {
      message.loading({
        content: 'Processing...',
        key: 'process',
        duration: 0,
      });
      return {
        url: `https://public-api-v2.aspirantzhang.com${uri}`,
        method,
        data: {
          ...formValues,
          'X-API-KEY': 'antd',
        },
      };
    },
    {
      manual: true,
      throttleInterval: 1000,
      onSuccess: (res) => {
        message.success({
          content: res?.message,
          key: 'process',
        });
      },
      formatResult: (res: any) => {
        return res;
      },
    },
  );

  useUpdateEffect(() => {
    init.run();
  }, [pageQuery, sortQuery, location.pathname]);

  // useTrackedEffect(
  //   (changes: [], previousDeps: [], currentDeps: []) => {
  //     console.log(changes, previousDeps, currentDeps)
  //     init.run()
  //   },
  //   [pageQuery, sortQuery, location.pathname],
  // )

  useEffect(() => {
    if (init?.data?.layout?.tableColumn) {
      setTableColumns(ColumnBuilder(init.data.layout.tableColumn, actionHandler));
    }
  }, [init?.data?.layout?.tableColumn]);

  useEffect(() => {
    if (modalUri) {
      setModalVisible(true);
    }
  }, [modalUri]);

  function actionHandler(action: BasicListApi.Action, record: BasicListApi.Field) {
    switch (action.action) {
      case 'modal':
        setModalUri(
          (action.uri || '').replace(/:\w+/g, (field) => {
            return record[field.replace(':', '')];
          }),
        );
        break;
      case 'page': {
        const uri = (action.uri || '').replace(/:\w+/g, (field) => {
          return record[field.replace(':', '')];
        });
        history.push(`/basic-list${uri}`);
        break;
      }
      case 'reload':
        init.run();
        break;
      case 'delete':
      case 'deletePermanently':
      case 'restore': {
        const operationName = intl.formatMessage({
          id: `basic-list.list.actionHandler.operation.${action.action}`,
        });
        confirm({
          title: intl.formatMessage(
            {
              id: 'basic-list.list.actionHandler.confirmTitle',
            },
            {
              operationName,
            },
          ),
          icon: <ExclamationCircleOutlined />,
          content: batchOverview(Object.keys(record).length ? [record] : selectedRows),
          okText: `Sure to ${action.action}!!!`,
          okType: 'danger',
          cancelText: 'Cancel',
          onOk() {
            return request.run({
              uri: action.uri,
              method: action.method,
              type: action.action,
              ids: Object.keys(record).length ? [record.id] : selectedRowKeys,
            });
          },
          onCancel() {
            console.log('Cancel');
          },
        });
        break;
      }
      default:
        break;
    }
  }

  function batchOverview(dataSource: BasicListApi.Field[]) {
    return (
      <Table
        size="small"
        rowKey="id"
        columns={tableColumns ? [tableColumns[0] || {}, tableColumns[1] || {}] : []}
        dataSource={dataSource}
        pagination={false}
      />
    );
  }

  const paginationChangeHandler = (page: any, per_page: any) => {
    setPageQuery(`&page=${page}&per_page=${per_page}`);
  };

  const onChange = (_: any, __: any, sorter: any) => {
    if (sorter?.order === undefined) {
      setSortQuery('');
    } else {
      const orderType = sorter?.order === 'descend' ? 'desc' : 'asc';
      setSortQuery(`&sort=${sorter.field}&order=${orderType}`);
    }
  };

  const hideModal = (reload = false) => {
    setModalVisible(false);
    setModalUri('');
    if (reload) {
      init.run();
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (_selectedRowKeys: any, _selectedRows: any) => {
      setSelectedRowKeys(_selectedRowKeys);
      setSelectedRows(_selectedRows);
    },
  };

  const onFinish = (value: any) => {
    init.run(submitFieldsAdaptor(value));
  };

  const searchLayout = () => {
    return (
      // <QueueAnim type="top">
      //   {
      searchVisible && (
        <Card className={styles.searchForm} key="searchForm">
          <Form onFinish={onFinish} form={searchForm}>
            <Row gutter={24}>
              <Col sm={6}>
                <Form.Item label="ID" name="id" key="id">
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              {SearchBuilder(init?.data?.layout?.tableColumn)}
            </Row>
            <Row>
              <Col sm={24} className={styles.textAlignRight}>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                  <Button
                    onClick={() => {
                      init.run();
                      searchForm.resetFields();
                    }}
                  >
                    Clear
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </Card>
      )
      //   }
      // </QueueAnim>
    );
  };

  const beforeTableLayout = () => {
    return (
      <Row>
        <Col xs={24} sm={12}>
          ...
        </Col>
        <Col xs={24} sm={12} className={styles.tableToolBar}>
          <Space>
            <Tooltip title="search">
              <Button
                shape="circle"
                icon={<SearchOutlined />}
                onClick={() => {
                  searchAction.toggle();
                }}
                type={searchVisible ? 'primary' : 'default'}
              />
            </Tooltip>
            {ActionsBuilder(init.data?.layout?.tableToolBar, actionHandler)}
          </Space>
        </Col>
      </Row>
    );
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

  const batchToolbar = () => {
    return (
      selectedRowKeys.length > 0 && (
        <Space>{ActionsBuilder(init?.data?.layout?.batchToolBar, actionHandler)}</Space>
      )
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
          columns={tableColumns}
          pagination={false}
          loading={init?.loading}
          onChange={onChange}
          rowSelection={rowSelection}
        />
        {afterTableLayout()}
      </Card>
      <Modal modalVisible={modalVisible} hideModal={hideModal} modalUri={modalUri}></Modal>
      <FooterToolbar extra={batchToolbar()} />
    </PageContainer>
  );
};

export default Index;
