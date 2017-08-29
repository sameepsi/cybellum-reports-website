var folderIds = [];
var selectedFolder;
var selectedFolderToUpload;
var selectedFolderName;
(function($) {

	'use strict';

	$('.modal-basic').magnificPopup({
		type: 'inline',
		preloader: false,
		modal: true
	});
	$('.modal-delete-file').magnificPopup({
		type: 'inline',
		preloader: false,
		modal: true
	});



	$('#treeDragDrop').jstree({
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
		'plugins': ['types', 'dnd']
	});


	$('#basicTree').jstree({
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
		'plugins': ['types', 'dnd']
	});

	$(document).on('click', '.modal-dismiss', function (e) {
		e.preventDefault();
		$.magnificPopup.close();
	});
	$('#treeDragDrop').on("deselect_all.jstree", function (e, data) {
		if(data.node.length>0){
			var id = data.node[0];

			if($("a#"+id+"_plus").length>0){
				$("a#"+id+"_plus").remove();
				$("a#"+id+"_minus").remove();


			}
		}
	});
	$('#treeDragDrop').on("select_node.jstree", function (e, data) {
		var id = data.node.id;
		var folderName = data.node.text;
		selectedFolderName = folderName;
		selectedFolder = id;
		if(id!=="0"){
			var pluHtml = '<a id ="'+id+'_plus"class="fa fa-plus-circle modal-with-form" href="#modalForm"></a>'
			var minusHtml = '<a id ="'+id+'_minus"class="fa fa-minus-circle modal-remove" href="#removeModal"></a>'

			if($("a#"+id+"_plus").length===0){
				$("a#"+id+"_anchor").append(pluHtml);
				$("a#"+id+"_anchor").append(minusHtml);
				$('.modal-remove').magnificPopup({
					type: 'inline',
					preloader: false,
					modal: true
				});
				$('.modal-with-form').magnificPopup({
					type: 'inline',
					preloader: false,
					focus: '#name',
					modal: true,

					// When elemened is focused, some mobile browsers in some cases zoom in
					// It looks not nice, so we disable it:
					callbacks: {
						beforeOpen: function() {
							if($(window).width() < 700) {
								this.st.focus = false;
							} else {
								this.st.focus = '#name';
							}
						}
					}
				});
			}
		}
		showDocList(id, selectedFolderName);

	});


	$('#basicTree').on("select_node.jstree", function (e, data) {
		var id = data.node.id;
		selectedFolderToUpload = id;


	});


	fetchFolders();

}).apply(this, [jQuery]);

function addFolderClicked(){
	var name = $("#name").val();
	addFolder(name, selectedFolder).then(function(res){
		var foldObject = {};
		foldObject['text']=res.name;
		foldObject['id']=res._id;
		foldObject['type']='folder';
		createFolders(res.parent, foldObject).then(function(res){
			console.log("Folder Added successfully");
		}, function(error){
			console.log(err);
		})
	}, function(err){
		console.log(err);
	})
}


function fetchFolders(){
	getFolders().then(function(folders){
		var data =[];
		var defaultFolder={};
		defaultFolder['text']="Default"
		defaultFolder['id']="0";
		defaultFolder['type']='folder';
		createFolders("#", defaultFolder);
		Object.keys(folders).forEach(function(key){
			folderIds.push(key);
			if(!folders[key].parent){
				var rootFolder = {};
				data.push(rootFolder);
				rootFolder['text']=folders[key].name;
				rootFolder['id']=folders[key]._id;
				rootFolder['type']='folder';
				createFolders("#", rootFolder).then(function(res){
					folders[key].child.forEach(function(child){
						processChildFolder(res.id, folders[child], folders);
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

function processChildFolder(parent, folder, folders){
	var foldObject = {};
	foldObject['text']=folder.name;
	foldObject['id']=folder._id;
	foldObject['type']='folder';
	createFolders(parent, foldObject).then(function(res){
		folder.child.forEach(function(child){
			processChildFolder(res.id, folders[child], folders);
		});
	}, function(err){
		console.log("failed to add node", err);
	});


}
function createFolders(parent, data){
	return new Promise(function(resolve, reject){
		var jstree = $('#treeDragDrop').jstree(true);
		var basicTree = $('#basicTree').jstree(true);
		if(jstree){

			jstree.create_node(parent, data,"last", function(res,err){
				if(res){
					resolve(res);
				}
				else{
					reject();
				}
			}, false);
			if(data){
				data.id=data.id+"_basic";

			}
			if(parent && parent!=="#"){
				parent=parent+"_basic";
			}
			basicTree.create_node(parent, data,"last", function(res,err){
				if(res){
					resolve(res);
				}
				else{
					reject();
				}
			}, false)
		}
		else{
			reject();
		}
	});

}

function showDashBoard(){
	$("#docList").addClass("hide");
	$("#dashboardData").removeClass("hide");
	$("#documentDetail").addClass("hide");

	$("#headerText").text("Dashboard");

}

function showDocList(folderId, folderName){
	$("#docList").removeClass("hide");
	$("#dashboardData").addClass("hide");
	$("#documentDetail").addClass("hide");

	$("#folderName").text(folderName);
	$("#headerText").text("Documents");

	getDocumentsInsideFolder(folderId).then(function(data){
		renderDocumentList(data);
		console.log(data);
	}, function(err){
		console.log(err);
	})

}

function renderDocumentList(documents){
	$("#documentList").empty();
	if(documents.docs.length>0){
		documents.docs.forEach(function(document){
			$("#documentList").append(addDocumentInList(document));
		});

	}
}

function addDocumentInList(document){
	var filePath = document.original_path;
	var fileName = filePath.substring(filePath.lastIndexOf("\\")+1, filePath.length);
	var targetAddress = document.target_address;
	var html = '<li class="unread"><div class="checkbox-custom checkbox-text-primary ib"><input type="checkbox" name="test" val='+document._id+' id="'+document._id+'_document"><label for="mail1"></label></div><a href="#" onClick="openDocument(\''+document._id+'\')";"><div class="col-sender"><p class="m-none ib">'+fileName+'</p></div><div class="col-mail"><p class="m-none mail-content"><span class="subject">'+filePath+'</span></p><p class="m-none mail-date">'+targetAddress+'</p></div></a></li>'
	return html;
}
function openDocument(docId){
	$("#docList").addClass("hide");
	$("#documentDetail").removeClass("hide");
	$("#headerText").text("Document");
	getDocument(docId).then(function(res){
		console.log(res);
	}).catch(function(err){
		console.log(err);
	});
}
function moveDocsToFolder(){
	var selectedDocsId = [];
	$.each($("input[name='test']:checked"), function() {
		selectedDocsId.push($(this).attr("val"));

	});
	if(selectedDocsId.length===0){
		return alert("Please selected documents to move.");
	}
	if(selectedFolderToUpload){
		var folderId = selectedFolderToUpload.substring(0,selectedFolderToUpload.lastIndexOf("_"))
		if(folderId === selectedFolder){
			return alert("Cannot move files into same folder");
		}
		if(folderId === "0"){
			return deleteFilesFromFolder();
		}
		moveDocsToFolderApi(folderId, selectedDocsId).then(function(data){
			showDocList(selectedFolder, selectedFolderName);
		}).catch(function(e){
			if(e.status===200){
				showDocList(selectedFolder, selectedFolderName);

			}
		});
	}
}

function setSelectedFolderInModal(){
	selectedFolderToUpload = selectedFolder ;
	var basicTree = $("#basicTree").jstree(true);
	basicTree.deselect_all();
	basicTree.select_node(selectedFolder+"_basic");

}

function selectDefaultFolder(){
	$('#treeDragDrop').jstree(true).select_node("0");
	selectedFolder = "0";
	selectedFolderName = "Default";
}

function deleteFolderFromView() {
	$('#basicTree').jstree(true).delete_node(selectedFolder);
	$('#treeDragDrop').jstree(true).delete_node(selectedFolder);
	selectedFolder = undefined;
	selectedFolderName = undefined;
}
function deleteFolder(){
	deleteFolderApi(selectedFolder).then(function(res){
			deleteFolderFromView();
		selectDefaultFolder();
	}, function(err){
		console.log(err);
	})
}

function deleteFilesFromFolder(){
	var selectedDocsId = [];
	if(selectedFolder=="0"){
		return alert("You cannot delete files from Default Folder");
	}
	$.each($("input[name='test']:checked"), function() {
		selectedDocsId.push($(this).attr("val"));
	});
	if(selectedDocsId.length===0){
		return alert("Please selected documents to delete.");
	}
	deleteDocsApi(selectedFolder, selectedDocsId).then(function(data){
		showDocList(selectedFolder, selectedFolderName);
	}, function (error){
		showDocList(selectedFolder, selectedFolderName);

		console.log(error);
	})
}
