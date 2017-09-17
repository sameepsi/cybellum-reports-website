(function($) {
  'use strict';
  //for overview

  fetchFoldersOverview();
}).apply(this, [jQuery]);

function initJsTree(){
  $('#overviewTree').jstree({
    'core' : {
      'check_callback' : true,
      'themes' : {
        'responsive': false
      }
    },
    'types' : {
      'default' : {
        'icon' : 'fa fa-folder'
      },
      'file' : {
        'icon' : 'fa fa-file'
      }
    },
    "ui": {
      "select_multiple_modifier": "on"
    },
    'plugins': ['types']
  });
}
function fetchFoldersOverview(){
  $('#overviewTree').jstree("destroy").empty();
  initJsTree();
  getFolders().then(function(folders){
    var data =[];

    Object.keys(folders).forEach(function(key){
      folderIds.push(key);
      if(!folders[key].parent){
        var rootFolder = {};
        data.push(rootFolder);
        var name = folders[key].name;
        if(folders[key]._id===6){
          name=name+":  "+folders[key].count+" documents"
        }
        rootFolder['text']=name;
        rootFolder['id']=folders[key]._id;
        rootFolder['type']='folder';
        rootFolder['state'] = {
          'opened':true
        }
        createFoldersOverview("#", rootFolder).then(function(res){
          folders[key].child.forEach(function(child){
            processChildFolderOverview(res.id, folders[child], folders);
          });
        }, function(err){
          console.log("failed to add node", err);
        });

      }
    });

  }, function(err){
    console.log("failed to fetch folders", err)
  })
}

function processChildFolderOverview(parent, folder, folders){
  var foldObject = {};
  foldObject['text']=folder.name+":  "+folder.count+" documents";
  foldObject['id']=folder._id;
  foldObject['type']='folder';
  foldObject['state'] = {
    'opened':true
  }
  createFoldersOverview(parent, foldObject).then(function(res){
    folder.child.forEach(function(child){
      processChildFolderOverview(res.id, folders[child], folders);
    });
  }, function(err){
    console.log("failed to add node", err);
  });


}
function createFoldersOverview(parent, data){
  return new Promise(function(resolve, reject){
    var jstree = $('#overviewTree').jstree(true);
    if(jstree){

      jstree.create_node(parent, data,"last", function(res,err){
        if(res){
          resolve(res);
        }
        else{
          reject();
        }
      }, false);
    };
  });
}


function showDashBoard(){

  $("#docList").addClass("hide");
  $("#dashboardData").removeClass("hide");
  $("#documentDetail").addClass("hide");

  $("#headerText").text("Overview");
  fetchFoldersOverview();

}
