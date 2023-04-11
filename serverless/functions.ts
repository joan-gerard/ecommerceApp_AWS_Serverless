import { AWS } from '@serverless/typescript';

const corsSettings = {
  headers: [
    // Specify allowed headers
    'Content-Type',
    'X-Amz-Date',
    'Authorization',
    'X-Api-Key',
    'X-Amz-Security-Token',
    'X-Amz-User-Agent',
  ],
  allowCredentials: false,
};

interface Authorizer {
  name: string;
  type: string;
  arn: {
    'Fn::GetAtt': string[];
  };
}
const authorizer: Authorizer = {
  name: 'authorizer',
  type: 'COGNITO_USER_POOLS',
  arn: { 'Fn::GetAtt': ['CognitoUserPool', 'Arn'] },
};

const iamGetSecret = {
  Effect: 'Allow',
  Action: ['secretsmanager:GetSecretValue'],
  Resource: '*',
};

const functions: AWS['functions'] = {
  cronJob: {
    handler: 'src/functions/cronJob/index.handler',
    events: [
      {
        schedule: {
          rate: ['cron(*/3 * * * ? *)'],
          enabled: false,
        },
      },
    ],
  },
  getProducts: {
    handler: 'src/functions/getProducts/index.handler',
    events: [
      {
        http: {
          method: 'get',
          path: 'products',
          cors: corsSettings,
        },
      },
    ],
  },
  getProduct: {
    handler: 'src/functions/getProduct/index.handler',
    events: [
      {
        http: {
          method: 'get',
          path: 'product/{productId}',
          cors: corsSettings,
        },
      },
    ],
  },
  createOrder: {
    handler: 'src/functions/createOrder/index.handler',
    events: [
      {
        http: {
          method: 'post',
          path: 'orders',
          cors: corsSettings,
          authorizer,
        },
      },
    ],
  },
  getOrder: {
    handler: 'src/functions/getOrder/index.handler',
    events: [
      {
        http: {
          method: 'get',
          path: 'order/{paymentSessionId}',
          cors: corsSettings,
        },
      },
    ],
  },
  streamHandler: {
    handler: 'src/functions/streamHandler/index.handler',
    events: [
      {
        stream: {
          type: 'dynamodb',
          arn: {
            'Fn::GetAtt': ['OrdersTable', 'StreamArn'],
          },
        },
      },
    ],
    //@ts-expect-error
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['events:PutEvents'],
        Resource:
          'arn:aws:events:${self:provider.region}:${aws:accountId}:event-bus/${self:custom.eventBridgeBusName}',
      },
    ],
  },
  ebOrderPlacedCustomerNotification: {
    handler: 'src/functions/ebEvents/ebOrderPlacedCustomerNotification/index.handler',
    events: [
      {
        eventBridge: {
          eventBus: '${self:custom.eventBridgeBusName}',
          pattern: {
            source: ['order.order_placed'],
          },
        },
      },
    ],
    //@ts-expect-error
    iamRoleStatementsInherit: true,
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['ses:sendEmail'],
        Resource: '*',
      },
    ],
  },
  ebOrderPlacedWarehouseNotification: {
    handler: 'src/functions/ebEvents/ebOrderPlacedWarehouseNotification/index.handler',
    events: [
      {
        eventBridge: {
          eventBus: '${self:custom.eventBridgeBusName}',
          pattern: {
            source: ['order.order_placed'],
          },
        },
      },
    ],
    //@ts-expect-error
    iamRoleStatements: [iamGetSecret],
  },
  warehousePackingComplete: {
    handler: 'src/functions/warehousePackingComplete/index.handler',
    events: [
      {
        http: {
          method: 'post',
          path: 'orderpacked/{orderId}',
          cors: corsSettings,
        },
      },
    ],
    //@ts-expect-error
    iamRoleStatementsInherit: true,
    iamRoleStatements: [iamGetSecret],
  },
  ebOrderPackedCustomerNotification: {
    handler: 'src/functions/ebEvents/ebOrderPackedCustomerNotification/index.handler',
    events: [
      {
        eventBridge: {
          eventBus: '${self:custom.eventBridgeBusName}',
          pattern: {
            source: ['order.warehouse_packed'],
          },
        },
      },
    ],
    //@ts-expect-error
    iamRoleStatementsInherit: true,
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['ses:sendEmail'],
        Resource: '*',
      },
    ],
  },
  ebOrderPackedDeliveryNotification: {
    handler: 'src/functions/ebEvents/ebOrderPackedDeliveryNotification/index.handler',
    events: [
      {
        eventBridge: {
          eventBus: '${self:custom.eventBridgeBusName}',
          pattern: {
            source: ['order.warehouse_packed'],
          },
        },
      },
    ],
    // iamRoleStatements: [iamGetSecret],
  },
  deliveryOrderPicked: {
    handler: 'src/functions/deliveryOrderPicked/index.handler',
    events: [
      {
        http: {
          method: 'post',
          path: 'orderpicked/{orderId}',
          cors: corsSettings,
        },
      },
    ],
    //@ts-expect-error
    iamRoleStatementsInherit: true,
    iamRoleStatements: [iamGetSecret],
  },
  ebOrderPickedCustomerNotification: {
    handler: 'src/functions/ebEvents/ebOrderPickedCustomerNotification/index.handler',
    events: [
      {
        eventBridge: {
          eventBus: '${self:custom.eventBridgeBusName}',
          pattern: {
            source: ['order.being_delivered'],
          },
        },
      },
    ],
    //@ts-expect-error
    iamRoleStatementsInherit: true,
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['ses:sendEmail'],
        Resource: '*',
      },
    ],
  },
};

export default functions;
