import { APIGatewayProxyEvent } from 'aws-lambda';

import { formatJSONResponse } from '@libs/APIResponses';
import Dynamo from '@libs/Dynamo';
import { ProductsRecord } from 'src/types/dynamo';

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const productTable = process.env.productTable;
    const productId = event.pathParameters.productId;

    const productData = await Dynamo.get<ProductsRecord>({
      pkValue: productId,
      tableName: productTable,
    });

    const { pk, sk, ...responseData } = productData;

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
