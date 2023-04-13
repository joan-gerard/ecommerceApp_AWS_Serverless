import { APIGatewayProxyEvent } from 'aws-lambda';

import { formatJSONResponse } from '@libs/APIResponses';
import Dynamo from '@libs/Dynamo';
import { ProductsRecord } from 'src/types/dynamo';

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const ordersTable = process.env.ordersTable;

    const userId = event.pathParameters.userId;

    const ordersResponse = await Dynamo.query<ProductsRecord>({
      tableName: ordersTable,
      index: 'index1',
      pkValue: userId,
    });
    
    const ordersData = ordersResponse.map(({ pk, sk, ...rest }) => rest);

    return formatJSONResponse({
      body: ordersData,
    });
  } catch (error) {
    console.log('error', error);
    return formatJSONResponse({
      statusCode: 502,
      body: {
        message: error.message,
      },
    });
  }
};
