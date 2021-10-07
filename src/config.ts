export interface IConfig {
  REACT_APP_BACKEND_URL: string;
}

export interface IWindowWithConfig extends Window {
  __env__?: IConfig;
}

export default (window as IWindowWithConfig).__env__ as IConfig;
