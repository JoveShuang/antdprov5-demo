import moment from 'moment';

export const submitFieldsAdaptor = (formValues: any) => {
  const newValues = formValues;
  Object.keys(formValues).forEach((key) => {
    if (moment.isMoment(formValues[key])) {
      formValues[key] = moment(formValues[key]).format();
    }
  });
  return newValues;
};

export const setFieldsAdaptor = (data: BasicListApi.PageData) => {
  if (data?.layout?.tabs && data?.dataSource) {
    const result = {};
    data.layout.tabs.forEach((tab: any) => {
      tab.data.forEach((field: any) => {
        switch (field.type) {
          case 'datetime':
            result[field.key] = moment(data.dataSource[field.key]);
            break;
          default:
            result[field.key] = data.dataSource[field.key];
            break;
        }
      });
    });
    return result;
  }
  return {};
};
