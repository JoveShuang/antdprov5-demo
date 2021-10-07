import React, { useEffect, useState } from 'react';
import { useRequest, useLocation, history } from 'umi';
import { Form, Input, message, Spin, Row, Col, Tabs, Card, Space } from 'antd';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import moment from 'moment';
import FormBuilder from '../builder/FormBuilder';
import ActionsBuilder from '../builder/ActionBuilder';
import { setFieldsAdaptor, submitFieldsAdaptor } from '../helper';
import styles from './Page.less';

const Page = () => {
  const [form] = Form.useForm();
  const [modalLoading, setModalLoading] = useState(true);
  const { TabPane } = Tabs;
  const location = useLocation();
  const init = useRequest<{ data: BasicListApi.PageData }>(
    `https://public-api-v2.aspirantzhang.com${location.pathname.replace(
      '/basic-list',
      '',
    )}?X-API-KEY=antd`,
    {
      onSuccess: () => {
        changeLoading(false);
      },
      onError: () => {
        history.goBack();
        changeLoading(false);
      },
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
          ...submitFieldsAdaptor(formValues),
          'X-API-KEY': 'antd',
        },
      };
    },
    {
      manual: true,
      onSuccess: (res) => {
        message.success({
          content: res.message,
          key: 'process',
        });
        history.goBack();
        changeLoading(false);
      },
      formatResult: (res: any) => {
        return res;
      },
    },
  );

  useEffect(() => {
    if (init.data) {
      form.setFieldsValue(setFieldsAdaptor(init?.data));
    }
  }, [init.data]);

  const layout = {
    laeblcol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  const onFinish = (values: any) => {
    request.run(values);
  };

  const actionHandler = (action: BasicListApi.Action) => {
    // const { action, uri, method } = action
    switch (action.action) {
      case 'submit':
        form.setFieldsValue({ uri: action.uri, method: action.method });
        form.submit();
        break;
      case 'cancel':
        history.goBack();
        break;
      case 'reset':
        form.resetFields();
        break;
      default:
        break;
    }
  };

  function changeLoading(isLoading: boolean) {
    setModalLoading(isLoading);
  }

  return (
    <PageContainer>
      <Spin spinning={modalLoading}>
        <Form
          form={form}
          {...layout}
          initialValues={{
            create_time: moment(),
            update_time: moment(),
            status: true,
          }}
          onFinish={onFinish}
        >
          <Row gutter={24}>
            <Col sm={16}>
              <Tabs type="card" className={styles.pageTabs}>
                {init?.data?.layout?.tabs?.map((tab) => {
                  return (
                    <TabPane tab={tab.title} key={tab.title}>
                      <Card>{FormBuilder(tab.data)}</Card>
                    </TabPane>
                  );
                })}
              </Tabs>
            </Col>
            <Col sm={8} className={styles.textAlignCenter}>
              {init?.data?.layout?.actions?.map((action) => {
                return (
                  <Card>
                    <Space>{ActionsBuilder(action.data, actionHandler)}</Space>
                  </Card>
                );
              })}
            </Col>
          </Row>
          <FooterToolbar>
            {ActionsBuilder(
              init?.data?.layout?.actions[0]?.data,
              actionHandler,
              false,
              null,
              moment(form.getFieldValue('update_time')).format('YYYY-MM-DD HH:mm:ss') || '',
            )}
          </FooterToolbar>
          <Form.Item name="uri" key="uri" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="method" key="method" hidden>
            <Input />
          </Form.Item>
        </Form>
      </Spin>
    </PageContainer>
  );
};

export default Page;
