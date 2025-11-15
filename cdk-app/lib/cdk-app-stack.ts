import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as path from 'path';

export class ProductApiStack163324 extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table
    const productTable = new dynamodb.Table(this, 'ProductTable163324', {
      tableName: 'ProductSpecifications163324',
      partitionKey: { name: 'product_id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 5,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Enable auto scaling
    productTable.autoScaleReadCapacity({
      minCapacity: 1,
      maxCapacity: 10,
    });

    productTable.autoScaleWriteCapacity({
      minCapacity: 1,
      maxCapacity: 10,
    });

    // Lambda Functions
    const getProductsFunction = new lambda.Function(this, 'GetProductsFunction163324', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'getProducts.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../src')),
      environment: {
        TABLE_NAME: productTable.tableName,
      },
      timeout: cdk.Duration.seconds(30),
    });

    const getProductByIdFunction = new lambda.Function(this, 'GetProductByIdFunction163324', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'getProductById.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../src')),
      environment: {
        TABLE_NAME: productTable.tableName,
      },
      timeout: cdk.Duration.seconds(30),
    });

    const initSampleDataFunction = new lambda.Function(this, 'InitSampleDataFunction163324', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'initSampleData.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../src')),
      environment: {
        TABLE_NAME: productTable.tableName,
      },
      timeout: cdk.Duration.seconds(60),
    });

    // Grant DynamoDB permissions
    productTable.grantReadData(getProductsFunction);
    productTable.grantReadData(getProductByIdFunction);
    productTable.grantWriteData(initSampleDataFunction);

    // API Gateway
    const api = new apigateway.RestApi(this, 'ProductApi163324', {
      restApiName: 'Product Specifications API 163324',
      description: 'API for accessing product specifications',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
      },
    });

    // API Resources
    const productsResource = api.root.addResource('api').addResource('products');
    const productByIdResource = productsResource.addResource('{product_id}');

    // API Methods
    productsResource.addMethod('GET', new apigateway.LambdaIntegration(getProductsFunction));
    productByIdResource.addMethod('GET', new apigateway.LambdaIntegration(getProductByIdFunction));

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL',
    });

    new cdk.CfnOutput(this, 'TableName', {
      value: productTable.tableName,
      description: 'DynamoDB Table Name',
    });

    new cdk.CfnOutput(this, 'InitFunctionName', {
      value: initSampleDataFunction.functionName,
      description: 'Sample Data Initialization Function Name',
    });
  }
}
