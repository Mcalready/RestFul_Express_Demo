const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const assert = require('assert');
const app = express()
//数据库地址
const DBUrl = 'mongodb://localhost:27017/restful';
//bodyparser设置
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
//服务端口
const port = process.env.PORT || 4001

const router = express.Router()

const myDB = [{ 
  "name"     : "gui.zhang",
  "age"      : "18",
  "sex"      : "male",
  "describe" : "monkey or programmer or a man"
},{
  "name"     : "gui.zhang.mom",
  "age"      : "47",
  "sex"      : "female",
  "describe" : "my mom"
},{
  "name"     : "gui.zhang.father",
  "age"      : "48",
  "sex"      : "male",
  "describe" : "my father"
}]
//插入数据操作
const insertDocument = (db, callback) => {
  const dbo = db.db("userForRest");
  dbo.collection('userInfo').insertMany(myDB, (err, res) => {
   if (err) throw err;
   console.log("成功插入数据" + res);
   callback();
 });
};
//执行插入数据操作
MongoClient.connect(DBUrl, (err, db) =>  {
  if (err) throw err;
  insertDocument(db, () => {
    db.close();
  });
});

// http://localhost:8989/api/userinfo GET请求
router.get('/userinfo', (req, res) => {
    const findUserinfo = (db, callback) => {
      let   userInfo; 
      const dbo = db.db("userForRest");
      const findName = req.query.name;
      if (!findName) {
        userInfo = dbo.collection('userInfo').find(); 
      } else {
        userInfo = dbo.collection('userInfo').find({name: findName}); 
      }
      userInfo.toArray((err, doc) => {
        if (err) throw err;
        if (doc.length > 0) {
          res.json(doc)
        } else {
          res.status(404).send(`没有找到关于${findName}的信息`)
          callback();     
        }
      })
    };
    //执行查询操作
    MongoClient.connect(DBUrl, (err, db) => {
      if (err) throw err;
      findUserinfo(db, () => {
          db.close();
      });
    });
});

app.use('/restful', router);

app.listen(port)

