# E-Commerce App - AWS Serverless

An e-commerce backend with an event-driven architecture using AWS EventBridge

### The Endpoints

```

```

### Project structure
```
.
├── ecomsanity                  # Connects Sanity to backend - contains config and schemas
├── SanityData                  # Folder holding extra serverless configuration
│   ├── deployToAWS             # DynamoDB table configuration 
│   ├── formatData              # Formats data to match DynamoDB schemas 
│   └── SanityClient            # Sanity Client configuration 
├── serverless                  # Folder holding extra serverless configuration
│   ├── dynamoResources         # DynamoDB table configuration 
│   └── functions               # config pointing to handlers path and http method 
├── src
│   ├── functions               # Folder containing lambda fn 
│   │   ├── ABC
│   │   │   └── index.ts        # lambda querying on a dynamodb table
│   │   ├── DEF
│   │   │   └── index.ts        # lambda making use of SES and SNS clients for notifications
│   │   └── GHI
│   │       └── index.ts        # lambda adding to dynamodb table
│   │
│   └── libs                    
│       ├── dynamo.ts           # DynamoDB 'write', 'get' and 'query' functions
│       └── apiGateway.ts       # API Gateway specific helpers
│
├── package.json
├── serverless.ts               # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
├── webpack.config.js           # Webpack configuration
└── tsconfig.paths.json         # Typescript paths
```