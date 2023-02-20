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
};

export default SecretsConfig;
