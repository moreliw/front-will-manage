const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

// Use Railway's PORT environment variable
const port = process.env.PORT || 4200;

const allowCors = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials, X-Access-Token, X-Key"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, DELETE, OPTIONS, PATCH"
  );

  res.header("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
};

app.use(allowCors);
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/dist/front-will-manage')));

// Handle all routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '/dist/front-will-manage/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(
    `Public URL: ${
      process.env.RAILWAY_PUBLIC_DOMAIN || "http://localhost:" + port
    }`
  );
});
