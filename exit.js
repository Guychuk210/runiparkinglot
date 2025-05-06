const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const params = event.queryStringParameters; //Get the params from the url
  const ticketId = params?.ticketId;

  if (!ticketId) {
    //validation
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing ticketId" }),
    };
  }

  //get the ticket
  const result = await dynamo
    .get({
      TableName: "Tickets",
      Key: { ticketId },
    })
    .promise();

  const ticket = result.Item;

  if (!ticket) {
    //validation
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Ticket not found" }),
    };
  }

  //check if already exited
  if (ticket.exitTime) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Ticket already marked as exited" }),
    };
  }

  //calculate fee
  const now = new Date();
  const entryTime = new Date(ticket.entryTime);
  const minutes = (now - entryTime) / 60000;
  const charge = Math.ceil(minutes / 15) * (10 / 4);

  //update DynamoDB with exitTime
  await dynamo
    .update({
      TableName: "Tickets",
      Key: { ticketId },
      UpdateExpression: "set exitTime = :exitTime",
      ExpressionAttributeValues: {
        ":exitTime": now.toISOString(),
      },
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      plate: ticket.plate,
      parkingLot: ticket.parkingLot,
      durationMinutes: Math.ceil(minutes),
      charge: charge.toFixed(2),
    }),
  };
};
