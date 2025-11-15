const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    const { category, brand, limit = '50', lastKey } = event.queryStringParameters || {};
    
    const scanParams = {
      TableName: process.env.TABLE_NAME,
      Limit: Math.min(parseInt(limit), 100),
    };

    if (lastKey) {
      scanParams.ExclusiveStartKey = JSON.parse(decodeURIComponent(lastKey));
    }

    let filterExpression = '';
    let expressionAttributeValues = {};

    if (category) {
      filterExpression = 'category = :category';
      expressionAttributeValues[':category'] = category;
    }

    if (brand) {
      if (filterExpression) {
        filterExpression += ' AND brand = :brand';
      } else {
        filterExpression = 'brand = :brand';
      }
      expressionAttributeValues[':brand'] = brand;
    }

    if (filterExpression) {
      scanParams.FilterExpression = filterExpression;
      scanParams.ExpressionAttributeValues = expressionAttributeValues;
    }

    const result = await docClient.send(new ScanCommand(scanParams));

    const response = {
      products: result.Items,
      count: result.Items.length,
    };

    if (result.LastEvaluatedKey) {
      response.lastKey = encodeURIComponent(JSON.stringify(result.LastEvaluatedKey));
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An internal server error occurred',
          timestamp: new Date().toISOString(),
        },
      }),
    };
  }
};
