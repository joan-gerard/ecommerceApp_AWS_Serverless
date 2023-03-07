import { client } from '../../../SanityData/SanityClient';
import formatData from '../../../SanityData/formatData';
import { deployToAWS } from '../../../SanityData/deployToAWS';
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
  

  // DEPLOY TO AWS
  deployToAWS(sanityResults);

  console.log('CRON JOB ENDED');
};
