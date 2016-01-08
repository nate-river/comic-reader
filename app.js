var fs   = require('fs');
var exec = require('child_process').exec;
// -----------------批量重命名

var files = fs.readdirSync('./comic/');
for ( var i = 0;  i < files.length;  i++){
  if(files[i] !== '.DS_Store'){
    var newName = './comic/' + files[i].match(/\d+/)[0];
    fs.renameSync('./comic/'+files[i], newName);
  }
}
var r = [];
var f = [];
var walk = function(path){
  var files  = fs.readdirSync(path);
  for( var i = 0; i< files.length; i++ ){
    if( files[i] !== '.DS_Store' ){
      var newpath = path + files[i];
      if ( fs.statSync(newpath).isFile() ){
        r.push( {name:files[i],path:newpath});
      }else if(fs.statSync(newpath).isDirectory() ){
        walk( newpath+'/' ) ;
      }
    }
  }
};
walk('./comic/');
var dic = {},aindex = -1;
for ( var i = 0;  i < r.length;  i++){
  var title = r[i].path.match(/\d+/)[0];
  if( !dic[title] ){
    f.push( { title:title,contents:[] });
    dic[title] = true;
    aindex += 1;
  }else{
    f[aindex].contents.push(r[i].path);
  }
}
setTimeout(function(){
  var js =  'var database=' + JSON.stringify(f) + ';';
  fs.writeFile('./js/database.js', js, function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
  });
},2000);
