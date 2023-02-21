import type { AWS } from '@serverless/typescript';

const SecretsConfig: AWS['resources']['Resources'] = {
  warehouseApiKey: {
    Type: 'AWS::SecretsManager::Secret',
    Properties: {
      Description: 'API key needed to call the warehouse',
      Name: 'warehouseApiKey',
      SecretString: '${env:warehouseApiKey}',
    },
  },
  orderpackedApiKeys: {
    Type: 'AWS::SecretsManager::Secret',
    Properties: {
      Description: 'API key passed by the warehouse',
      Name: 'auth-/orderpacked/_orderId_',
      SecretString: '${env:orderpackedApiKeys}',
    },
  },
  deliveryApiKeys: {
    Type: 'AWS::SecretsManager::Secret',
    Properties: {
      Description: 'API key passed by the delivery service',
      Name: 'auth-/orderpicked/_orderId_',
      SecretString: '${env:deliveryApiKeys}',
    },
  },
};

export default SecretsConfig;
