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

const functions: AWS['functions'] = {
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
    handler: 'src/functions/ebOrderPlacedCustomerNotification/index.handler',
    events: [
      {
        eventBridge: {
          eventBus: '${self:custom.eventBridgeBusName}',
          pattern: {
            source: ['order.placed'],
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
    handler: 'src/functions/ebOrderPlacedWarehouseNotification/index.handler',
    events: [
      {
        eventBridge: {
          eventBus: '${self:custom.eventBridgeBusName}',
          pattern: {
            source: ['order.placed'],
          },
        },
      },
    ],
    //@ts-expect-error
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['secretsmanager:GetSecretValue'],
        Resource: '*',
      },
    ],
  },
};

export default functions;
