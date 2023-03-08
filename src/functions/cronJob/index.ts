import { isEqual, uniq } from 'lodash';

import { client } from '../../../SanityData/SanityClient';
import formatData from '../../../SanityData/formatData';
import { deployToAWS } from '../../../SanityData/deployToAWS';
import Dynamo from '@libs/Dynamo';
import { ProductsRecord } from 'src/types/dynamo';

// export const handler = (event: any, context: any, callback) => {
//   console.log('Hello, Welcome to Hevo');
//   callback(null);
// };

export const handler = async () => {
  console.log('CRON JOB START');

  const productsQuery = '*[_type == "product"]';
  const sanityProducts: any[] = await client.fetch(productsQuery);
  console.log({ sanityProducts });

  // FORMAT DATA
  const sanityResults = formatData(sanityProducts);

  // GET EXISTING DATA
  const productTable = process.env.productTable;
  const existingDynamoData: ProductsRecord[] = await Dynamo.scan({
    tableName: productTable,
  });

  console.log({ sanityResults, existingDynamoData });

  // Compare data and get differences
  const selectedRows = sanityResults.filter(function (cv) {
    return !existingDynamoData.find(function (e) {
      return e.id == cv.id;
    });
  });

  console.log(selectedRows);
  // DEPLOY TO AWS
  await deployToAWS(selectedRows);

  console.log('CRON JOB ENDED');
};
