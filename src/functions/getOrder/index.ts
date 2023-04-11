import { APIGatewayProxyEvent } from 'aws-lambda';

import { formatJSONResponse } from '@libs/APIResponses';
import Dynamo from '@libs/Dynamo';
import { OrderRecord } from 'src/types/dynamo';

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const ordersTable = process.env.ordersTable;
    const paymentSessionId = event.pathParameters.paymentSessionId;

    console.log({ ordersTable, paymentSessionId });

    const orderData = await Dynamo.get<OrderRecord>({
      pkValue: paymentSessionId,
      tableName: ordersTable,
    });

    console.log({ orderData });

    if (!orderData) {
      return formatJSONResponse({
        statusCode: 404,
        body: {
          message: 'order does not exist',
        },
      });
    }

    const { pk, sk, ...responseData } = orderData;

    return formatJSONResponse({
      body: responseData,
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
