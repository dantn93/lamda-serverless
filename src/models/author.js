'use strict';
const uuid = require('uuid');
var AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const getById = async (id) => {
  return new Promise((resolve, reject) => {
    dynamoDB.get({
      Key: { id },
      TableName: "authors"
    })
      .promise()
      .then(data => {
        resolve(data.Item);
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  getById,
  getAll: async (args) => {
    const params = {
      TableName: 'authors',
      // FilterExpression : 'Year = :this_year',
      // ExpressionAttributeValues : {':this_year' : 2015}
    };
    const results = await new Promise((resolve, reject) => {
      dynamoDB.scan(params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data.Items);
        }
      })
    })
    return results;
  },
  create: async (args) => {
    let item = {
      id: uuid.v1(),
      ...args
    };
    const result = await new Promise((resolve, reject) => {
      dynamoDB.put({
        Item: item,
        TableName: "authors"
      }, (err, data) => {
        console.log("ERROR: ", err)
        if (err) reject(err);
        resolve(null);
      })
    })
    const author = await getById(item.id);
    console.log("AUTHOR: ", author)
    return author;
  },
  update: async (args) => {
    let params = {
      TableName: 'authors',
      UpdateExpression: 'set',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
      Key: { id: args.authorId }
    };

    console.log("PARAMS UPDATE: ", params);
    Object.keys(args).forEach(key => {
      if (key === 'authorId') return;
      params.UpdateExpression += ` #${key} = :${key},`;
      params.ExpressionAttributeNames[`#${key}`] = key;
      params.ExpressionAttributeValues[`:${key}`] = args[key];
    });

    params.UpdateExpression = params.UpdateExpression.slice(0, -1);
    const result = await new Promise((resolve, reject) => {
      dynamoDB.update(params, function (err, data) {
        if (err) reject(err);
        else resolve(data);
      })
    });
    const author = await getById(args.authorId);
    return author;
  },
  delete: async (args) => {
    // check author exist
    let author = await getById(args.authorId);
    if (!author) {
      return { id: args.authorId };
    }

    var params = {
      TableName: 'authors',
      Key: {
        id: args.authorId
      }
    };

    const result = await new Promise((resolve, reject) => {
      dynamoDB.delete(params, function (err, data) {
        if (err) reject(err);
        else resolve(data);
      });
    })

    // check author is deleted again
    author = await getById(args.authorId);
    if (!author) {
      return { id: args.authorId };
    } else {
      return null;
    }
  }
}