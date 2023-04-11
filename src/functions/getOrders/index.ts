import { APIGatewayProxyEvent } from 'aws-lambda';

import { formatJSONResponse } from '@libs/APIResponses';
import Dynamo from '@libs/Dynamo';
import { ProductsRecord } from 'src/types/dynamo';

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const ordersTable = process.env.ordersTable;
    // const { userId } = event.pathParameters || {};

    const { userId } = event.queryStringParameters || {};

    // if (!group) {
    //   return formatJSONResponse({
    //     statusCode: 400,
    //     body: {
    //       message: "missing 'group' query string parameter",
    //     },
    //   });
    // }

    const productsResponse = await Dynamo.query<ProductsRecord>({
      tableName: ordersTable,
      index: 'index1',
      pkValue: userId,
      // skBeginsWith: sk,
      // skKey: sk ? 'sk' : undefined,
    });

    const productsData = productsResponse.map(({ pk, sk, ...rest }) => rest);

    return formatJSONResponse({
      body: productsData,
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
