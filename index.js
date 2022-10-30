const express = require('express');
const app = express();
const config = require('./config');
const Student = require('./models/Student');

app.use(express.urlencoded({extended: false}));


app.use(contentLogger);
let totalRequests = 0;

function contentLogger(req, res, next){
    
    if (req.method === "GET"){
        totalRequests++
        console.log('Method: GET')
        console.log('Total Request: ' + totalRequests);
    }
    else if (req.method === "POST"){
        totalRequests++
        console.log('Method: POST')
        console.log('Total Request: ' +  totalRequests);
    }
    else if (req.method === "PATCH"){
        totalRequests++
        console.log('Method: PATCH')
        console.log('Total Request: ' +  totalRequests);
    }
    else if (req.method === "DELETE"){
        totalRequests++
        console.log('Method: DELETE')
        console.log('Total Request: ' +  totalRequests);
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
    }, contentLogger)
    .catch(function(err){
        res.send(err);
    });
});


app.post('/students', function(req, res){
    Student.create(req.body)
    .then(function(result){
        res.status(200).send(result);
    }, contentLogger)
    .catch(function(err){
        res.status(500).send(err);
    });
})


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
    }, contentLogger)
    .catch(function(err){
        res.status(500).send(err);
    });
});


app.delete('/students/:student_id', function(req, res){
    let student_id = parseInt(req.params.student_id);

    Student.findByPk(student_id)
    .then(function(result){
        if(result){

            result.destroy()
            .then(function(){
                res.status(200).send(result);
            }, contentLogger)
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
});


app.listen(3000, function(){
    console.log('Server running on port 3000...');
});