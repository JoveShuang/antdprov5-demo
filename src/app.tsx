import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import { message } from 'antd';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import {
  currentUser as queryCurrentUser,
  currentMenu as queryCurrentMenu,
} from './services/ant-design-pro/api';

const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  currentMenu?: any;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  const fetchMenu = async () => {
    try {
      const data = await queryCurrentMenu();
      return data;
    } catch (error) {
      message.error('Get menu data failed', 10);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    const currentMenu = await fetchMenu();
    return {
      fetchUserInfo,
      currentUser,
      currentMenu,
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    settings: {},
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    menuHeaderRender: undefined,
    menuDataRender: () => {
      return initialState?.currentMenu;
    },
    // menu: {
    //   params: {
    //     userId: initialState?.currentUser?.userid
    //   },
    //   request: async () => {
    //     const menuData = await queryCurrentMenu()
    //     return menuData
    //   }
    // },
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};

/** 异常处理程序
 *
 */
const errorHandler = (error: ResponseError) => {
  switch (error.name) {
    case 'BizError':
      if (error.data.message) {
        message.error({
          content: error.data.message,
          key: 'process',
          duration: 2,
        });
      } else {
        message.error({
          content: 'Business Error, please try again.',
          key: 'process',
          duration: 2,
        });
      }
      break;
    case 'ResponseError':
      message.error({
        content: `${error.response.status} ${error.response.statusText}. Please try again.`,
        key: 'process',
        duration: 2,
      });
      break;
    case 'TypeError':
      message.error({
        content: `Network error. Please try again.`,
        key: 'process',
        duration: 2,
      });
      break;
    default:
      break;
  }

  throw error;
};

export const request: RequestConfig = {
  errorHandler,
};
