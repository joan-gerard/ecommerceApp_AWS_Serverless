// import seedDataGenerator from './generateProductJson';
import * as AWS from 'aws-sdk';

const saveToDynamo = async ({ data, tableName }: { data: any[]; tableName: string }) => {
  const env = 'dev';

  if (!env) {
    throw Error('missing environemnt parameter');
  }

  const profile = {
    dev: 'serverlessUser',
    int: 'int-serverlessUser',
    prod: 'prod-serverlessUser',
  }[env];

  if (!profile) {
    throw Error('incorrect environment parameter');
  }

  console.log({ data, tableName, profile });

  await batch({
    data,
    tableName,
    profile,
  });
};

const batch = async ({
  data,
  tableName,
  profile,
}: {
  data: any[];
  tableName: string;
  profile: string;
}) => {
  // AWS.config.credentials = new AWS.SharedIniFileCredentials({
  //   profile,
  // });
  const config = {
    region: 'eu-central-1',
    convertEmptyValues: true,
  };

  // console.log('batch', AWS.config.credentials);
  const documentClient = new AWS.DynamoDB.DocumentClient(config);
  console.log({ documentClient });

  // const newData = 
  const formattedRecords = data.map((record) => {
    return {
      PutRequest: {
        Item: record,
      },
    };
  });
  console.log({ formattedRecords });
  try {
    while (formattedRecords.length > 0) {
      const batch = formattedRecords.splice(0, 15);

      const params = {
        RequestItems: {
          [tableName]: batch,
        },
      };

      await documentClient.batchWrite(params).promise();
      console.log('batch written');
      console.log(`remaining items = ${formattedRecords.length}`);
    }

    console.log('all done');
  } catch (error) {
    console.log('error batch writing to AWS');
    console.log(error);
  }
};

export const deployToAWS = async (data) => {
  await saveToDynamo({
    data,
    tableName: `dev-ecom-app-product-table`,
  });
};
