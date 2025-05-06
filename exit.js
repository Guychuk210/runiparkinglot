const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const params = event.queryStringParameters;
  const ticketId = params?.ticketId;

  if (!ticketId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing ticketId' }),
    };
  }

  const result = await dynamo.get({
    TableName: 'Tickets',
    Key: { ticketId }
  }).promise();

  const ticket = result.Item;

  if (!ticket) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Ticket not found' }),
    };
  }

  const now = new Date();
  const entryTime = new Date(ticket.entryTime);
  const minutes = (now - entryTime) / 60000;
  const charge = Math.ceil(minutes / 15) * (10 / 4);

  return {
    statusCode: 200,
    body: JSON.stringify({
      plate: ticket.plate,
      parkingLot: ticket.parkingLot,
      durationMinutes: Math.ceil(minutes),
      charge: charge.toFixed(2)
    }),
  };
};
