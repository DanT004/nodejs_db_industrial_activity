const express = require('express');
const app = express();
const chalk = require('chalk');
const config = require('./config');
const Student = require('./models/Student');

app.use(express.urlencoded({extended: false}));


app.use(contentLogger);
let total_GET_requests = 0;
let total_POST_requests = 0;
let total_PATCH_requests = 0;
let total_DELETE_requests = 0;

function contentLogger(req, res, next){
    
    if (req.method === "GET"){
        total_GET_requests++
        console.log(chalk.green('Method: GET'));
        console.log(chalk.yellow('Total Request: ' + chalk.blue('GET: ' + total_GET_requests) + ' POST: ' + total_POST_requests + ' PATCH: ' + total_PATCH_requests + ' DELETE: ' + total_DELETE_requests));
    }
    else if (req.method === "POST"){
        total_POST_requests++
        console.log(chalk.green('Method: POST'));
        console.log(chalk.yellow('Total Request: ' +  'GET: ' + total_GET_requests + chalk.blue(' POST: ' + total_POST_requests) + ' PATCH: ' + total_PATCH_requests + ' DELETE: ' + total_DELETE_requests));
    }
    else if (req.method === "PATCH"){
        total_PATCH_requests++
        console.log(chalk.green('Method: PATCH'));
        console.log(chalk.yellow('Total Request: ' +  'GET: ' + total_GET_requests + ' POST: ' + total_POST_requests + chalk.blue(' PATCH: ' + total_PATCH_requests) + ' DELETE: ' + total_DELETE_requests));
    }
    else if (req.method === "DELETE"){
        total_DELETE_requests++
        console.log(chalk.red('Method: DELETE'));
        console.log(chalk.yellow('Total Request: ' +  'GET: ' + total_GET_requests + ' POST: ' + total_POST_requests + ' PATCH: ' + total_PATCH_requests + chalk.blue(' DELETE: ' + total_DELETE_requests)));
    }
    next();
};




config.authenticate()
.then(function(){
    console.log('Database id connected');
})
.catch(function(err){
    console.log(err);
});


app.get('/students', function(req, res){
    let data = {
        where: {},
    }
    
    if(req.query.id !== undefined){
        data.where.id = req.query.id;
    }

    if(req.query.section !== undefined){
        data.where.section = req.query.section;
    }

    Student.findAll(data)
    .then(function(results){
        res.send(results);
    })
    .catch(function(err){
        res.send(err);
    });
}, contentLogger);


app.post('/students', function(req, res){
    Student.create(req.body)
    .then(function(result){
        res.status(200).send(result);
    })
    .catch(function(err){
        res.status(500).send(err);
    });
}, contentLogger)


app.patch('/students/:student_id', function(req, res){
    let student_id = parseInt(req.params.student_id);

    Student.findByPk(student_id)
    .then(function(result){
        if(result){
            result.name = req.body.name,
            result.section = req.body.section,
            result.gpa = req.body.gpa,
            result.nationality = req.body.nationality;

            result.save()
            .then(function(){
                res.status(200).send(result);
            })
            .catch(function(err){
                res.status(500).send(err);
            });
        }else{
            res.status(404).send('Student record was not found');
        }
    })
    .catch(function(err){
        res.status(500).send(err);
    });
}, contentLogger);


app.delete('/students/:student_id', function(req, res){
    let student_id = parseInt(req.params.student_id);

    Student.findByPk(student_id)
    .then(function(result){
        if(result){

            result.destroy()
            .then(function(){
                res.status(200).send(result);
            })
            .catch(function(err){
                res.status(500).send(err);
            });
        }else{
            res.status(404).send('Student record was not found');
        }
    })
    .catch(function(err){
        res.status(500).send(err);
    });
}, contentLogger);


app.listen(3000, function(){
    console.log('Server running on port 3000...');
});