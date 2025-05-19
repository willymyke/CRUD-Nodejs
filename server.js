const express=require('express')
const mysql=require('mysql')
const app=express()
const port=3000
//connection
const db =mysql.createConnection({
 host:'localhost',
 user:'root',
 passward:'',
 database:'db',

})
db.connect((err)=>{
    if(err) {
        console.log(`data not connected`)
    }
    else{
        console.log(`data connected`)
    }
})
//midleware
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.set('view engine','ejs')

// routes
app.get('/',(req,res)=>{
    res.render('insert')
})
//.....INSERT........
app.post('/insert',(req,res)=>{
    const { name, email, password} = req.body
    const sql =(`INSERT INTO students(name, email, password) VALUES(?,?,?)`)
    db.query(sql,[name, email,password] , (err,result)=>{
        if(err){
            console.log("data not inserted",err)
            return res.send("data not inserted")
        }else{
            console.log("data inserted successfully!!",result)
            return res.send("<script>alert ('data inserted successfully!!');location.replace('/select')</script>")
        }
    })
})
//...........selection.............
app.get('/select', (req,res)=>{
    const sql =("SELECT * FROM students")
    db.query(sql, (err,result)=>{
        if(err){
            console.log("data not selected",err)
            return res.send("data not selected")
        }else{
            let table=`
            <center>
            
           <center> <h1><u>LIST OF ALL STUDENTS</u> </h1></center>
           <table border="1" cellpadding="7">
            <tr>
                <th>name</th>
                <th>email</th>
                <th>password</th>
                <th colspan="2">Action</th>
            </tr>`
            result.forEach((students) => {
                table+=`
                <tr>
                    <td>${students.name}</td>
                    <td>${students.email}</td>
                    <td>${students.password}</td>
                    <td><a href="/update/${students.id}">Update</a></td>
                    <td><a href="/delete/${students.id}">Remove</a></td>
                </tr>`
                
                
            })
            table+=`</table>`
           res.send(table) 
            }
            
    })
})
//.........delete....................
app.get('/delete/:id', (req,res)=>{
    const id = req.params.id;
    const sql= 'DELETE FROM students WHERE id=?'
    db.query(sql, [id], (err,result)=>{
        if(err){
            console.log("Data can not deleted",err)
            return res.redirect("/select")
        }else{
            console.log("Data deleted successfully")
            return res.send("<script>alert('student Deleted successfully!');location.replace('/select') </script>")
            
            
        }
    })
})
//..............select to Update...........

app.get('/update/:id',(req,res)=>{
    const id = req.params.id
    const sql = 'SELECT * FROM students WHERE `id`=?'
    db.query(sql,[id],(err,result)=>{
        if (err) {
            console.log('not selecting user',err)

        }else{
           res.render('edit',{students:result[0]})
        }
    })  
})                      

//..........really update........   
app.post('/update/:id',(req,res)=>{                 
    const id = req.params.id
    const {name,email,password} = req.body
    const sql = 'UPDATE FROM studeuunts SET ``name`=?, `email`=?, `password`=? WHERE `id`=?'
    db.query(sql,[name,email,password,id],(err,result)=>{
        if (err) {
            console.log('students not updated...',err)
            
        }
        else{
            res.redirect('/select',result)
        }
    })
})















//server
app.get('/insert',(req,res)=>{
    res.send(`insert`)
})
app.listen(port,(req,res)=>{
    console.log(`the server running on ${port}`)
})