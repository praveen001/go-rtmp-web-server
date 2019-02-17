// export const BaseUrl = 'http://localhost:5000';
// export const SocketUrl = 'ws://localhost:5000/ws/connect?token=';
declare var process;
const env = process.env.MODE;

const config = {
  development: {
    baseUrl: `${process.env.API_ENDPOINT}/v1/api`,
    SocketUrl: `${process.env.WS_ENDPOINT}/v1/api`
  },
  production: {
    baseUrl: `${process.env.API_ENDPOINT}/v1/api`,
    SocketUrl: `${process.env.WS_ENDPOINT}/v1/api`
  }
};

export const BaseUrl = config[env].baseUrl;
export const SocketUrl = config[env].SocketUrl;
