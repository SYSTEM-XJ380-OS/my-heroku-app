const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 3000; // Heroku 会动态分配端口

// 中间件，用于解析 JSON 请求体
app.use(express.json());

// 创建 MySQL 数据库连接
// 关键：使用 Heroku 提供的环境变量，本地开发时则回退到本地配置
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'your_local_password',
  database: process.env.DB_NAME || 'my_database'
});

// 连接到数据库
connection.connect((err) => {
  if (err) {
    console.error('数据库连接失败: ' + err.stack);
    return;
  }
  console.log('成功连接到数据库，ID: ' + connection.threadId);
});

// 定义一个简单的路由
app.get('/', (req, res) => {
  res.send('Hello World from Heroku!');
});

// 定义一个从数据库获取数据的路由
app.get('/api/users/all', (req, res) => {
  connection.query('SELECT * FROM users', (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(results);
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`应用正在运行: http://localhost:${port}`);
});