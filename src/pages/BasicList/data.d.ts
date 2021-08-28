declare module BasicListApi {
  export interface Page {
    title: string;
    type: string;
    searchBar: boolean;
    trash: boolean;
  }

  export interface Child2 {
    id: number;
    parent_id: number;
    name: string;
    create_time: Date;
    delete_time?: any;
    status: number;
    value: number;
    title: string;
    depth: number;
  }

  export interface Child {
    id: number;
    parent_id: number;
    name: string;
    create_time: Date;
    delete_time?: any;
    status: number;
    value: number;
    title: string;
    depth: number;
    children: Child2[];
  }

  export interface Datum {
    id: number;
    parent_id: number;
    name: string;
    create_time: Date;
    delete_time?: any;
    status: number;
    value: any;
    title: string;
    depth: number;
    children: Child[];
  }

  export interface Action {
    component: string;
    text: string;
    type: string;
    action: string;
    uri: string;
    method: string;
  }

  export interface TableColumn {
    title: string;
    dataIndex: string;
    key: string;
    type?: string;
    data?: Datum[];
    hideInColumn?: boolean;
    sorter?: boolean;
    mode?: string;
    actions?: Action[];
    [key: string]: any;
  }

  export interface Layout {
    tableColumn: TableColumn[];
    tableToolBar: Action[];
    batchToolBar: Action[];
  }

  export interface Pivot {
    id: number;
    admin_id: number;
    group_id: number;
    create_time: string;
    update_time: string;
    delete_time?: any;
    status: number;
  }

  export interface Group {
    id: number;
    parent_id: number;
    name: string;
    create_time: Date;
    update_time: Date;
    delete_time?: any;
    status: number;
    pivot: Pivot;
  }

  export interface DataSource {
    id: number;
    username: string;
    display_name: string;
    create_time: Date;
    delete_time?: any;
    status: number;
    groups: Group[];
  }

  export interface Meta {
    total: number;
    per_page: number;
    page: number;
  }

  export interface Data {
    page: Page;
    layout: Layout;
    dataSource: DataSource[];
    meta: Meta;
  }

  export interface Page2 {
    title: string;
    type: string;
    searchBar: boolean;
    trash: boolean;
  }

  export interface Child4 {
    id: number;
    parent_id: number;
    name: string;
    create_time: Date;
    delete_time?: any;
    status: number;
    value: number;
    title: string;
    depth: number;
  }

  export interface Child3 {
    id: number;
    parent_id: number;
    name: string;
    create_time: Date;
    delete_time?: any;
    status: number;
    value: number;
    title: string;
    depth: number;
    children: Child4[];
  }

  export interface Datum2 {
    id: number;
    parent_id: number;
    name: string;
    create_time: Date;
    delete_time?: any;
    status: number;
    value: any;
    title: string;
    depth: number;
    children: Child3[];
  }

  export interface Action2 {
    component: string;
    text: string;
    type: string;
    action: string;
    uri: string;
    method: string;
  }

  export interface TableColumn2 {
    title: string;
    dataIndex: string;
    key: string;
    type: string;
    data: Datum2[];
    hideInColumn?: boolean;
    sorter?: boolean;
    mode: string;
    actions: Action2[];
  }

  export interface TableToolBar2 {
    component: string;
    text: string;
    type: string;
    action: string;
    id: string;
    uri: string;
  }

  export interface BatchToolBar2 {
    component: string;
    text: string;
    type: string;
    action: string;
    uri: string;
    method: string;
  }

  export interface Layout2 {
    tableColumn: TableColumn2[];
    tableToolBar: TableToolBar2[];
    batchToolBar: BatchToolBar2[];
  }

  export interface Pivot2 {
    id: number;
    admin_id: number;
    group_id: number;
    create_time: string;
    update_time: string;
    delete_time?: any;
    status: number;
  }

  export interface Group2 {
    id: number;
    parent_id: number;
    name: string;
    create_time: Date;
    update_time: Date;
    delete_time?: any;
    status: number;
    pivot: Pivot2;
  }

  export interface DataSource2 {
    id: number;
    username: string;
    display_name: string;
    create_time: Date;
    delete_time?: any;
    status: number;
    groups: Group2[];
  }

  export interface Meta2 {
    total: number;
    per_page: number;
    page: number;
  }

  export interface Data2 {
    page: Page2;
    layout: Layout2;
    dataSource: DataSource2[];
    meta: Meta2;
  }

  export interface AHOOKSUSEREQUESTDEFAULTKEY {
    loading: boolean;
    params: any[];
    data: Data2;
  }

  export interface Fetches {
    AHOOKS_USE_REQUEST_DEFAULT_KEY: AHOOKSUSEREQUESTDEFAULTKEY;
  }

  export interface RootObject {
    loading: boolean;
    data: Data;
    params: any[];
    fetches: Fetches;
  }
}
