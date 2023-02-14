import { APIGatewayProxyEvent } from 'aws-lambda';

import { formatJSONResponse } from '@libs/APIResponses';
import Dynamo from '@libs/Dynamo';
import { ProductsRecord } from 'src/types/dynamo';

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const productTable = process.env.productTable;
    // const { userId } = event.pathParameters || {};

    const { group, category, subcategory } = event.queryStringParameters || {};

    if (!group) {
      return formatJSONResponse({
        statusCode: 400,
        body: {
          message: "missing 'group' query string parameter",
        },
      });
    }

    let sk = undefined;

    if (category) {
      sk = category;

      if (subcategory) {
        sk = `${category}#${subcategory}`;
      }
    }

    const productsResponse = await Dynamo.query<ProductsRecord>({
      tableName: productTable,
      index: 'index1',
      pkValue: group,
      skBeginsWith: sk,
      skKey: sk ? 'sk' : undefined,
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
