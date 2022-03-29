'use strict';
const uuid = require('uuid');
var AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const getById = async (id) => {
  return new Promise((resolve, reject) => {
    dynamoDB.get({
      Key: { id },
      TableName: "books"
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
      TableName: "books"
    };
    const results = await new Promise((resolve, reject) => {
      dynamoDB.scan(params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          console.log("BOOK LIST: ", data)
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
        TableName: "books"
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
    console.log("UPDATE BOOK ARGS: ", args)
    let params = {
      TableName: "books",
      UpdateExpression: 'set',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
      Key: { id: args.bookId }
    };

    Object.keys(args).forEach(key => {
      if (key === 'bookId') return;
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
    const book = await getById(args.bookId);
    return book;
  },
  delete: async (args) => {
    // check author exist
    let book = await getById(args.bookId);
    if (!book) {
      return { id: args.bookId };
    }

    var params = {
      TableName: 'books',
      Key: {
        id: args.bookId
      }
    };

    const result = await new Promise((resolve, reject) => {
      dynamoDB.delete(params, function (err, data) {
        if (err) reject(err);
        else resolve(data);
      });
    })

    // check book is deleted again
    book = await getById(args.bookId);
    if (!book) {
      return { id: args.bookId };
    } else {
      return null;
    }
  },
  getAllBookByAuthorId: async (id) => {
    const params = {
      TableName: "books",
      FilterExpression: 'authorId = :authorId',
      ExpressionAttributeValues: { ':authorId': id }
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
  }
}