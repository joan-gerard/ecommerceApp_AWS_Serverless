import { APIGatewayProxyEvent } from 'aws-lambda';
import Secrets from './secrets';

const apiKeyAuth = async (event: APIGatewayProxyEvent) => {
  if (!event.headers?.Authorization) {
    throw Error('Missing Authorization header');
  }

  const authToken = event.headers?.Authorization;

  const formattedPath = event.resource.replaceAll('{', '_').replaceAll('}', '_');

  const secretString = await Secrets.getSecret(`auth-${formattedPath}`);

  if (!secretString) {
    throw Error('API key not found for this path');
  }

  const secretObj = JSON.parse(secretString);

  if (Object.values(secretObj).includes(authToken)) {
    return;
  }

  throw Error('invalid API key');
};

const Authorization = {
  apiKeyAuth,
};

export default Authorization;
