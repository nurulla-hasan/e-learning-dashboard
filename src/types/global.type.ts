/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IMenuItem {
  name: string;
  icon: any;
  href?: string;
  submenu?: IMenuItem[];
}


export interface IParam {
  name: string;
  value: string;
}

export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}


export interface IApiError {
  error: {
    status: number;
    data: {
      message: string;
    }
  }
}




