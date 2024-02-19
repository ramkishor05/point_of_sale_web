let APP_HOST_SERVER = null;
if (process.env.APP_HOST_SERVER) {
  APP_HOST_SERVER = process.env.APP_HOST_SERVER;
} else {
  APP_HOST_SERVER = "https://8e10-121-243-75-227.ngrok-free.app";
}

const config = {
    // basename: only at build time to set, and don't add '/' at end off BASENAME for breadcrumbs, also don't put only '/' use blank('') instead,
    // like '/berry-material-react/react/default'
    basename: '',
    fontFamily: `'Roboto', sans-serif`,
    borderRadius: 12,
    APP_HOST_SERVER: APP_HOST_SERVER,
    ITEM_SERVER_HOST: APP_HOST_SERVER+'/item',
    AUTH_SERVER_HOST: APP_HOST_SERVER+'/auth',
    CRM_SERVER_HOST: APP_HOST_SERVER+'/crm',
    ORDERING_SERVER_HOST: APP_HOST_SERVER+'/ordering',
    PAYMENT_SERVER_HOST: APP_HOST_SERVER+'/payment'
};

export default config;
