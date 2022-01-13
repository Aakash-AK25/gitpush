const express = require('express');
const prettier = require('prettier');
const uploadstorage = require('./routes/multer');
const app = express();
app.use(express.json());
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const fileeditor = require('./routes/fileeditor');
const path = require('path');

const crypto = require('crypto');


const pretter = require('./routes/prettier');

const repocl = require('./routes/repoclone');

const auth = require('./routes/auth');

const viewejs = require('./routes/viewejs');

const orgreg = require('./routes/orgcreation');

const admincn = require('./routes/adminuser');

const orguser = require('./routes/orguser');

const repoaasign = require('./routes/assignusertable');

app.use(express.static(path.join(__dirname, 'views')))
// const register = require('./routes/models');
const black = require('@unibeautify/beautifier-black');
const Path = path.join(__dirname, 'uploads');
const clone = require('git-clone');
const push = require('git-push');
const shell = require('shelljs');
const simplegit = require('simple-git');
const dirTree = require("directory-tree");
const git = simplegit();
app.set('view engine', 'ejs');
app.engine('jsx', require('express-react-views').createEngine());

const usermodel = require('./routes/usermodels')
const orgmodel = require('./routes/orgmodel')
const repo = require('./routes/repomodel');
const { appendFile } = require('fs');

const { validateToken } = require('./routes/authtoken');

const { getTokenFromHeaders } = require('./routes/authtoken');
const fs=require('fs');


require('dotenv').config();


app.get('/migrate', (req, res) => {
  user.create().then(() => {
    res.end('success')
  }).catch(error => {
    res.status(404).end()
  })
})

app.get('/usertable/:id', (req, res) => {
  usermodel.findAll({
    where: {
      orgid: req.params.id
    }
  }).then((usermodel) => {
    usermodel.forEach( 
      (user) => { 
         if (user.role=="2"){
           user.role='admin'
         }
         if(user.role=="3"){
           user.role="user"
         }
      }
    );
    console.log(usermodel)
    res.json({ 'status': 'pass', 'data': usermodel });
  });
})

app.use('/', auth);

app.use('/', orgreg);

app.use('/', admincn);
// app.get('/orgtable',validateToken,(req, res) => {
//   console.log(req.decoded)
//   // orgmodel.findAll().then((orgmodel) => {
//   //   res.json({ 'status': 'pass', 'data': orgmodel });
//   // });
// })

app.get('/repotable/:id', (req, res) => {
  a = repo.findOne({
    where: {
      orgid: req.params.id
    }
  }).then((orgmodel) => {
    res.json({ 'status': 'pass', 'data': a.dataValues });
  });
})
// app.post('/orgreg', (req, res) => {
//   var body = req.body;
//   orgmodel.create(body).then(() => {
//     res.send(body)
//   }).catch(error => {
//     res.status(404).send(error)
//   })
// })
app.get('/token', validateToken, (req, res) => {
  res.send({'data':req.decoded})
})

app.post('/userreg', (req, res) => {
  var a = usermodel.findOne({
    where: {
      email: req.body.email
    }
  }).then((a) => {
    if (a == null) {
      console.log('jii')
      console.log(req.body)
      req.body.password = crypto.createHash('sha256').update(req.body.password).digest('base64')
      if (!req.body.role) {
        req.body.role = '3'
      }
      if (!req.body.Is_Active) {
        req.body.Is_Active = '1'
      }
      var body = req.body;
      usermodel.create(body).then((body) => {
        res.send(body)
      }).catch(error => {
        res.status(404).send()
      })
    }
    else {
      res.send('email ready registered');
    }
  })
})



app.get('/filename', (req, res) => {
  fs.readdir(Path, function (err, files) {
    if (err) {
      res.send(err);
    }
    else {
      files.forEach(function (file) {
        console.log(file);
      })
      res.send(files)
    }
  })
})
app.use('/', uploadstorage);

app.use('/', fileeditor);

app.use('/', repocl);

app.use('/', pretter);

app.use('/', orguser);

app.use('/', repoaasign);

app.use('/', viewejs);
// app.get('/clone1', (req, res) => {
//   const path = 'uploads/git'
//   shell.exec('grunt');
// })
// app.get('/clone', (req, res) => {
//   clone('https://github.com/pankeshpatel/ml-web.git', 'uploads/git', 'git', res.send('success'))
// })
// app.get('/push', (req, res) => {
//   push(Path, '', function () {
//     console.log('Done!');
//   });
//   res.send('done')
// })
// app.post('/clone2', (req, res) => {

//   const USER = req.body.USER;
//   const PASS = req.body.PASS;
//   const REPO = req.body.REPO;
//   const remote = `https://${USER}:${PASS}@${REPO}`;

//   simplegit(Path).silent(true).clone(remote).then(() => fun()).catch((err) => fun1(err))
//   function fun() {
//     res.status(200).send({
//       "status": "ok",
//       "code": 200,
//       "message": "git clone successfully created"
//     })
//   }
//   function fun1(err) {
//     res.status(500).send({
//       "status": "fail",
//       "code": 500,
//       "message": err.message.fatal
//     });
//   }
// })
app.get('/newrepo', (req, res) => {

})
app.get('/mkdir/:foldername', (req, res) => {
  const folderName = req.params.foldername;
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName)
      res.send('success')
    }
  } catch (err) {
    console.error(err)
  }
})
app.get('/fullpath', (req, res) => {
  var a = fs.readdirSync(Path).map(fileName => {
    return fileName
  })
  res.send(a)
})
// app.get('/tree', (req, res) => {
//   const tree = dirTree('uploads/Skin-Disease-Classifier');
//   var str = JSON.stringify(tree);
//   str = str.replace(/\"name\":/g, "\"text\":");
//   str = str.replace(/\"path\":/g, "\"id\":");
//   res.send(JSON.parse(str))
// })
const options = {
  extensions: ['txt', 'jpg', 'pro', 'java', 'js', 'python', 'xml']
};

app.listen(4000, '0.0.0.0', () => {
  console.log('localhost');
});
