const express = require('express');
const compression = require('compression');
const formidable = require("formidable");
const path = require('path');
const PORT = 3000;
const HOST = "localhost";

//By default, routing is case insensitive
//In routes, / at end doesn't matter unless we add app.set('strict routing', true)
const app = express();


app.use(compression());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.end("Starter path");
});

app.get('/author/:name/book/:bookName', (req, res) => {
  console.log(`author: ${req.params.name}`);
  console.log(`book: ${req.params.bookName}`);
  res.end('');
});

app.all('/formSubmit', (req, res, next) => {
  if (req.method === "GET" || req.method === "POST") {
    const form = new formidable.IncomingForm({
      uploadDir: path.join(__dirname, 'static', 'uploads'),
      keepExtensions: true
    });
    form.parse(req, (err, data, files) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      if (files && files.image && files.image.length > 0) {
        data.filename = files.image[0].originalFilename;
        data.filetype = files.image[0].mimetype;
        data.filesize = Math.ceil(files.image[0].size / 1024) + ' KB';
        data.uploadto = files.image[0].filepath;
        data.imageurl = 'uploads/' + path.parse(files.image[0].filepath).base;
        console.log(data.imageurl);
        return res.render("index", { data });
      }
      else return res.render("index", { data });
    });
  } else next();
});

app.use(express.static(path.join(__dirname, "static")));

app.use((req, res) => {
  res.status(404).send('Not found');
});

app.listen(PORT, HOST, () => {
  console.log("Server listening on port " + PORT);
})