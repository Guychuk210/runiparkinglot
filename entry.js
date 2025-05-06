const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const params = event.queryStringParameters;
  const plate = params?.plate;
  const parkingLot = params?.parkingLot;
  const ticketId = uuidv4();
  const entryTime = new Date().toISOString();

  const item = {
    ticketId,
    plate,
    parkingLot,
    entryTime
  };

  await dynamo.put({
    TableName: 'Tickets',
    Item: item
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({ ticketId })
  };
};
