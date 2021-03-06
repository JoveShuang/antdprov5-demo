import React, { useEffect, useState } from 'react';
import { useRequest } from 'umi';
import { Modal as AntdModal, Form, Input, message, Spin } from 'antd';
import moment from 'moment';
import FormBuilder from '../builder/FormBuilder';
import ActionsBuilder from '../builder/ActionBuilder';
import { setFieldsAdaptor, submitFieldsAdaptor } from '../helper';

const Modal = ({
  modalVisible,
  hideModal,
  modalUri,
}: {
  modalVisible: boolean;
  hideModal: (reload?: boolean) => void;
  modalUri: string;
}) => {
  const [form] = Form.useForm();
  const [modalLoading, setModalLoading] = useState(true);
  const init = useRequest<{ data: BasicListApi.PageData }>(
    `https://public-api-v2.aspirantzhang.com${modalUri}?X-API-KEY=antd`,
    {
      manual: true,
      onSuccess: () => {
        changeLoading(false);
      },
      onError: () => {
        hideModal();
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
        hideModal(true);
        changeLoading(false);
      },
      formatResult: (res: any) => {
        return res;
      },
    },
  );

  useEffect(() => {
    if (modalVisible) {
      form.resetFields();
      init.run();
    }
  }, [modalVisible]);

  useEffect(() => {
    if (init.data) {
      form.setFieldsValue(setFieldsAdaptor(init?.data));
    }
  }, [init.data]);

  const layout = {
    laeblcol: { span: 8 },
    wrapperCol: { span: 16 },
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
        hideModal();
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
    <div>
      <AntdModal
        title={init?.data?.page?.title}
        visible={modalVisible}
        onCancel={() => {
          hideModal();
        }}
        footer={ActionsBuilder(
          init?.data?.layout?.actions[0]?.data,
          actionHandler,
          request?.loading,
          {},
          init?.data?.dataSource?.update_time,
        )}
        maskClosable={false}
        forceRender
      >
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
            {FormBuilder(init?.data?.layout?.tabs[0]?.data)}
            <Form.Item name="uri" key="uri" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="method" key="method" hidden>
              <Input />
            </Form.Item>
          </Form>
        </Spin>
      </AntdModal>
    </div>
  );
};

export default Modal;
