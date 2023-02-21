import { APIGatewayProxyEvent } from 'aws-lambda';

import { formatJSONResponse } from '@libs/APIResponses';
import Dynamo from '@libs/Dynamo';
import { OrderRecord } from 'src/types/dynamo';
import Authorization from '@libs/Authorization';

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    await Authorization.apiKeyAuth(event);
  } catch (error) {
    console.log(error);
    return formatJSONResponse({
      statusCode: 401,
      body: { message: 'API key auth failed' },
    });
  }

  try {
    console.log('authorized');

    const ordersTable = process.env.ordersTable;
    const orderId = event.pathParameters.orderId;

    const order = await Dynamo.get<OrderRecord>({
      tableName: ordersTable,
      pkValue: orderId,
    });

    if (!order || !order.id) {
      return formatJSONResponse({
        statusCode: 404,
        body: { message: 'Order cannot be found' },
      });
    }

    const updatedOrder: OrderRecord = {
      ...order,
      status: 'warehouse_packed',
      warehousePacked: Date.now(),
    };

    await Dynamo.write({
      data: updatedOrder,
      tableName: ordersTable,
    });

    return formatJSONResponse({
      body: { message: 'Order has been packed' },
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
