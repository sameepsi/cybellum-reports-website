/**
* Module dependencies.
*/
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const yargs = require('yargs');
const rp = require('request-promise');
const querystring = require('querystring');

var port = process.env.PORT || 3000;


var app=express();
app.use(express.static(path.join(__dirname, 'public/HTML')));
/**
* Register all routes of app.
*/
app.use(bodyParser.json());

app.get('/api/web/folder', async (req,res) => {

  if(process.env.REPORT_SERVICE_URL){
    var uri = process.env.REPORT_SERVICE_URL + "/folder";
    if(Object.keys(req.query).length>0){
      uri =uri+"?"+ querystring.stringify(req.query);
    }

    var options = {
      uri,
      json: true
    }
    try{
      var response = await rp(options);
      res.status(200).send(response);
    }catch(e){

      res.status(500).send();
    }
  }
  else{
    res.status(500).send();
  }
}
);

app.get('/api/web/folder/:id/document', async (req,res) => {

  if(process.env.REPORT_SERVICE_URL){
    var uri = process.env.REPORT_SERVICE_URL + "/folder/"+req.params.id+"/document";
    if(Object.keys(req.query).length>0){
      uri =uri+"?"+ querystring.stringify(req.query);
    }

    var options = {
      uri,
      json: true
    }
    try{
      var response = await rp(options);
      res.status(200).send(response);
    }catch(e){

      res.status(500).send();
    }
  }
  else{
    res.status(500).send();
  }
}
);

app.post('/api/web/folder', async (req,res) => {

  if(process.env.REPORT_SERVICE_URL){
    var uri = process.env.REPORT_SERVICE_URL + "/folder";
    if(Object.keys(req.query).length>0){
      uri =uri+"?"+ querystring.stringify(req.query);
    }
    var options = {
      method:"POST",
      uri,
      body:req.body,
      json: true
    }
    try{
      var response = await rp(options);
      res.status(200).send(response);
    }catch(e){
      console.log(e)
      res.status(500).send();
    }
  }
  else{
    res.status(500).send();
  }
}
);

app.put('/api/web/document/:documentId', async (req,res) => {

  if(process.env.REPORT_SERVICE_URL){
    var uri = process.env.REPORT_SERVICE_URL + "/document/"+req.params.documentId;
    if(Object.keys(req.query).length>0){
      uri =uri+"?"+ querystring.stringify(req.query);
    }
    var options = {
      method:"PUT",
      uri,
      body:req.body,
      json: true
    }
    try{
      var response = await rp(options);
      res.status(200).send(response);
    }catch(e){
      console.log(e)
      res.status(500).send();
    }
  }
  else{
    res.status(500).send();
  }
}
);

app.post('/api/web/folder/:id/document', async (req,res) => {

  if(process.env.REPORT_SERVICE_URL){
    var uri = process.env.REPORT_SERVICE_URL + "/folder/"+req.params.id+"/document";

    var options = {
      method:"POST",
      uri,
      body:req.body,
      json: true
    }
    try{
      var response = await rp(options);
      console.log(response)

      res.status(200).send(response);
    }catch(e){
      console.log(e)
      res.status(500).send();
    }
  }
  else{
    res.status(500).send();
  }
}
);
app.delete('/api/web/folder/:id', async (req,res) => {

  if(process.env.REPORT_SERVICE_URL){
    var uri = process.env.REPORT_SERVICE_URL + "/folder/"+req.params.id;
    if(Object.keys(req.query).length>0){
      uri =uri+"?"+ querystring.stringify(req.query);
    }
    var options = {
      method:"DELETE",
      uri,
      json: true,
      body:req.body
    }
    try{
      var response = await rp(options);
      res.status(200).send(response);
    }catch(e){
      console.log(e)
      res.status(500).send();
    }
  }
  else{
    res.status(500).send();
  }
}
);


app.delete('/api/web/folder/:id/document', async (req,res) => {

  if(process.env.REPORT_SERVICE_URL){
    var uri = process.env.REPORT_SERVICE_URL + "/folder/"+req.params.id+"/document";
    if(Object.keys(req.query).length>0){
      uri =uri+"?"+ querystring.stringify(req.query);
    }
    var options = {
      method:"DELETE",
      uri,
      json: true,
      body:req.body
    }
    try{
      var response = await rp(options);
      res.status(200).send(response);
    }catch(e){
      console.log(e)
      res.status(500).send();
    }
  }
  else{
    res.status(500).send();
  }
}
);

app.get('/api/web/document/:id', async (req,res) => {

  if(process.env.REPORT_SERVICE_URL){
    var uri = process.env.REPORT_SERVICE_URL +"/document/"+req.params.id;
    if(Object.keys(req.query).length>0){
      uri =uri+"?"+ querystring.stringify(req.query);
    }

    var options = {
      uri,
      json: true
    }
    try{
      var response = await rp(options);
      res.status(200).send(response);
    }catch(e){
      console.log(e)
      res.status(500).send();
    }
  }
  else{
    res.status(500).send();
  }
}
);

app.get('/api/web/document/editableFields', async (req,res) => {

  if(process.env.REPORT_SERVICE_URL){
    var uri = process.env.REPORT_SERVICE_URL +"/document/editableFields";
    if(Object.keys(req.query).length>0){
      uri =uri+"?"+ querystring.stringify(req.query);
    }

    var options = {
      uri,
      json: true
    }
    try{
      var response = await rp(options);
      res.status(200).send(response);
    }catch(e){
      console.log(e)
      res.status(500).send();
    }
  }
  else{
    res.status(500).send();
  }
}
);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/public/HTML/index.html'));
});




/**
* Start Application
*/
app.listen(port,(err)=>{
  if(err){
    return console.log(`Failed to start server on port ${port}`);
  }
  console.log(`Started on port ${port}`);
})
