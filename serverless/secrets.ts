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
      Description: 'API key pased by the warehouse',
      Name: 'auth-/orderpacked/_orderId_',
      SecretString: '${env:orderpackedApiKeys}',
    },
  },
};

export default SecretsConfig;
