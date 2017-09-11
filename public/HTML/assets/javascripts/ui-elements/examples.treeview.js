var folderIds = [];
var selectedFolder;
var selectedFolderToUpload;
var selectedFolderName;
var customFields;
var editableFields;
var selectedDocument;
var extraInfoList = {};
var extraInfoIndex = 0;
var limit = 20;
var currentPage = 1;
var totalPages = 1;
var totalDocs = 1;
var initialCurrentPage = 1;
var totalExtraFields = 0;
var editFolderId;
var editFolderName;

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

	$('.modal-root-folder').magnificPopup({
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
		'plugins': ['types']
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
		'plugins': ['types']
	});

	//for overview

	$('#overvTree').jstree({
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

			if($("span#"+id+"_span").length>0){
				$("span#"+id+"_span").remove();

			}
		}
	});
	$('#treeDragDrop').on("dehover_node.jstree", function (e, data) {
		if(data.node){
			var id = data.node.id;
			if(selectedFolder!==id){
				if($("span#"+id+"_span").length>0){
					$("span#"+id+"_span").remove();

				}
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
			var editHtml = '<a id ="'+id+'_edit"class="fa fa-edit modal-edit" onclick="editFolder(\''+data.node.text+'\',\''+ id+'\')" href="#editModal" style="padding-left:5px;"></a>'
			var span='<span id="'+id+'_span">'+pluHtml+minusHtml+editHtml+'</span>'

			if($("span#"+id+"_span").length===0){
				$("a#"+id+"_anchor").append(span);


				$('.modal-remove').magnificPopup({
					type: 'inline',
					preloader: false,
					modal: true
				});
				$('.modal-with-form').magnificPopup({
					type: 'inline',
					preloader: false,
					focus: '#name',
					modal: true
				});
				$('.modal-edit').magnificPopup({
					type: 'inline',
					preloader: false,
					focus: '#editName',
					modal: true,
					callbacks: {
						open: function() {
							$("#editName").val(editFolderName);

						}

					}

				});
			}
		}

		showDocList(id, selectedFolderName, initialCurrentPage, limit);

	});


	$('#treeDragDrop').on("hover_node.jstree", function (e, data) {
		var id = data.node.id;

		if(id!=="0" && selectedFolder!==id){

			var pluHtml = '<a id ="'+id+'_plus"class="fa fa-plus-circle modal-with-form" href="#modalForm"></a>'
			var minusHtml = '<a id ="'+id+'_minus"class="fa fa-minus-circle modal-remove" href="#removeModal"></a>'
			var editHtml = '<a id ="'+id+'_edit"class="fa fa-edit modal-edit" onclick="editFolder(\''+data.node.text+'\',\''+ id+'\')" href="#editModal" style="padding-left:5px;"></a>'
			var span='<span id="'+id+'_span">'+pluHtml+minusHtml+editHtml+'</span>'

			if($("span#"+id+"_span").length===0){
				$("a#"+id+"_anchor").append(span);


				$('.modal-remove').magnificPopup({
					type: 'inline',
					preloader: false,
					modal: true
				});
				$('.modal-with-form').magnificPopup({
					type: 'inline',
					preloader: false,
					focus: '#name',
					modal: true
				});
				$('.modal-edit').magnificPopup({
					type: 'inline',
					preloader: false,
					focus: '#editName',
					modal: true,
					callbacks: {
						open: function() {
							$("#editName").val(editFolderName);

						}

					}

				});
			}
		}
	});


	$('#basicTree').on("select_node.jstree", function (e, data) {
		var id = data.node.id;
		selectedFolderToUpload = id;


	});


	getEditableFields().then(function(response){
		editableFields = response;
	}).catch(function(error){
		console.log(error);
	});
	fetchFolders();

}).apply(this, [jQuery]);


function editFolder(name, folderId){
	editFolderName = name;
	editFolderId = folderId;
}
function editFolderClicked(){
	var newFolderName = $("#editName").val();
	if(!newFolderName || newFolderName.trim().length<=0){
		return alert("Please enter valid folder name");
	}
	if(editFolderId && newFolderName){
		editFolderApi(editFolderId, newFolderName).then(function(data){
			$("#treeDragDrop").jstree('rename_node', data._id , data.name );
			$("#basicTree").jstree('rename_node', data._id+"_basic" , data.name );
			if(editFolderId===selectedFolder){
				$("#folderName").text(data.name);

			}
		}).catch(function(err){
			console.log(err);
		});
	}
}
function addKey(index, key){
	if(extraInfoList[key]){
		$("#extra_info_key_"+index).val('');
		return alert("key already exists!!");
	}
	if(!key || key.trim().length<=0){
		return alert("Please enter valid key!!");
	}
	extraInfoList[key]='';
	window.event.srcElement.setAttribute("readonly","true");
}

function deleteExtraInfoRow(index){
	var key = $("#extra_info_key_"+index).val();
	if(key){
		delete extraInfoList[key];
	}
	$("#extra_info_"+index).remove();
	totalExtraFields = totalExtraFields - 1;
}
function valueChanged(index, value){
	var key = $("#extra_info_key_"+index).val();
	if(!key || key.trim().length<=0){
		$("#extra_info_value_"+index).val('');
		return alert("Please provide key before value");
	}
	if(!value || value.trim().length<=0){
		extraInfoList[key] = value;
		return alert("Please provide some valid values!!");
	}

	extraInfoList[key] = value;
}
function checkIfAnyKeyEmpty(){
	var count = 0;
	for(let key of Object.keys(extraInfoList)){
		count++;
		if(!extraInfoList[key] || extraInfoList[key].trim().length<=0){
			alert("Please provide value for "+key+" before adding new field");
			return false;
		}
	}
	if(totalExtraFields>count){
		alert("Please complete previously added fields before adding  new one");
		return false;
	}
	return true;
}
function addExtraInfoRow(){
	var check = checkIfAnyKeyEmpty();
	if(!check){
		return;
	}
	var html = '<div class="row" id="extra_info_'+extraInfoIndex+'">'+
	'<div class="col-md-2 col-md-offset-3">'+
	'<div class="form-group">'+
	'<label class="control-label">Key</label>'+
	'<input type="text" class="form-control input-sm" id="extra_info_key_'+extraInfoIndex+'" onchange="addKey('+extraInfoIndex+',this.value)">'+
	'</div>'+
	'</div>'+
	'<div class="col-md-2 col-md-offset-1">'+
	'<div class="form-group">'+
	'												<label class="control-label">Value</label>'+
	'<input type="text" class="form-control input-sm" id="extra_info_value_'+extraInfoIndex+'" onchange="valueChanged('+extraInfoIndex+',this.value)">'+
	'</div>'+
	'</div>'+
	'<div class="col-md-2 col-md-offset-1" style="margin-top:30px">'+
	'<div class="form-group">'+
	'<a class="item-action fa fa-minus " title="Add extra info" id="addExtraInfo" onclick="deleteExtraInfoRow('+extraInfoIndex+')"></a>'+
	'</div>'+
	'</div>'+

	'</div>'
	extraInfoIndex++;
	totalExtraFields++;
	$("#extraInfo").append(html);
}

function addExtraInfo(key, value){
	var html = '<div class="row" id="extra_info_'+extraInfoIndex+'">'+
	'<div class="col-md-2 col-md-offset-3">'+
	'<div class="form-group">'+
	'<input type="text" value="'+key+'" readonly="true" class="form-control input-sm" id="extra_info_key_'+extraInfoIndex+'" onchange="addKey('+extraInfoIndex+',this.value)">'+
	'</div>'+
	'</div>'+
	'<div class="col-md-2 col-md-offset-1">'+
	'<div class="form-group">'+
	'<input type="text" value="'+value+'" class="form-control input-sm" id="extra_info_value_'+extraInfoIndex+'" onchange="valueChanged('+extraInfoIndex+',this.value)">'+
	'</div>'+
	'</div>'+
	'<div class="col-md-2 col-md-offset-1">'+
	'<div class="form-group">'+
	'<a class="item-action fa fa-minus " title="Add extra info" id="addExtraInfo" onclick="deleteExtraInfoRow('+extraInfoIndex+')"></a>'+
	'</div>'+
	'</div>'+

	'</div>'
	extraInfoIndex++;
	totalExtraFields++;
	$("#extraInfo").append(html);
}
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

function addRootFolderClicked(){
	var name = $("#rootName").val();
	addFolder(name).then(function(res){
		var foldObject = {};
		foldObject['text']=res.name;
		foldObject['id']=res._id;
		foldObject['type']='folder';
		createFolders("#", foldObject).then(function(res){
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


function showDocList(folderId, folderName, page, limitToSend){
	$("#docList").removeClass("hide");
	$("#dashboardData").addClass("hide");
	$("#documentDetail").addClass("hide");

	$("#folderName").text(folderName);
	$("#headerText").text("Documents");
	$("#documentList").empty();
	$("#pagination").empty();
	$("#pageDesc").text("");
	getDocumentsInsideFolder(folderId, limitToSend, page).then(function(data){
		currentPage = data.page;
		limit = data.limit;
		totalDocs = data.total;
		totalPages = data.pages;
		renderDocumentList(data);


	}, function(err){
		console.log(err);
	})

}

function renderDocumentList(documents){

	if(documents.docs.length>0){
		var currentLastDoc = (currentPage*limit)<totalDocs?(currentPage*limit):totalDocs;
		$("#pageDesc").text('Showing '+((currentPage-1)*limit +1)+' to '+(currentLastDoc)+' of '+totalDocs);
		var hClass = "prev"
		if(currentPage===1){
			hClass+=" disabled"
		}
		var html = '<li class="'+hClass+'"><a href="#" onclick="gotoFirstPage()" title="first page" disabled><span class="fa fa-chevron-left">'+
		'<span class="fa fa-chevron-left"></span></a></li>'
		$("#pagination").append(html);
		hClass="prev";
		if(currentPage===1){
			hClass+=" disabled"
		}
		html='<li class="'+hClass+'"><a href="#" onclick="gotoPreviousPage()" title="previous page" disabled><span class="fa fa-chevron-left"></span></a></li>'
		$("#pagination").append(html);
		var rem = currentPage % 5;
		var i = 1;
		var final = 1;
		if(rem==0){
			i = currentPage-4;
			final = currentPage;
		}
		else if(rem===1){
			i = currentPage;
			final = currentPage+4>=totalPages?totalPages:currentPage+4;
		}
		else if(rem===2){
			i = currentPage -1;
			final = currentPage+3>=totalPages?totalPages:currentPage+3;
		}
		else if(rem===3){
			i = currentPage - 2;
			final = currentPage+2>=totalPages?totalPages:currentPage+2;
		}
		else if(rem===4){
			i = currentPage - 3;
			final = currentPage+1>=totalPages?totalPages:currentPage+1;
		}
		for(;i<=final;i++){
			var liClass = "";
			if(i===currentPage){
				liClass="active";
			}

			var html = '<li class="'+liClass+'"><a href="#" onclick = gotoPage('+i+')>'+i+'</a></li>'
			$("#pagination").append(html);
		}
		hClass="next";
		if(currentPage===totalPages){
			hClass+=" disabled"
		}
		html='<li class="'+hClass+'"><a href="#" onclick="gotoNextPage()" disabled title="next page"><span class="fa fa-chevron-right"></span></a></li>'
		$("#pagination").append(html);
		hClass="next";
		if(currentPage===totalPages){
			hClass+=" disabled"
		}
		html='<li class="'+hClass+'"><a href="#" onclick="gotoLastPage()" disabled title="last page"><span class="fa fa-chevron-right"><span class="fa fa-chevron-right"></span></a></li>'
		$("#pagination").append(html);

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

function renderDocument(document){
	var filePath = document.original_path;
	var fileName = filePath.substring(filePath.lastIndexOf("\\")+1, filePath.length);
	$("#docName").text(fileName);
	$("#originalPath").val(filePath);
	$("#access_size").val(document.instruction_descriptor.access_size);
	$("#rep_counter").val(document.instruction_descriptor.rep_counter);
	$("#direction").val(document.instruction_descriptor.direction);
	$("#is_write").val(document.instruction_descriptor.is_write);
	$("#is_repeat").val(document.instruction_descriptor.is_repeat);
	$("#loading_address").val(document.runtime_information.loading_address?document.runtime_information.loading_address.toString(16):"");
	$("#process_id").val(document.runtime_information.process_id?document.runtime_information.process_id.toString(16):"");
	$("#thread_id").val(document.runtime_information.thread_id?document.runtime_information.thread_id.toString(16):"");
	renderStackTraces(document.stacktrace);
	renderCustomFields(document.extra_info);

}
function renderCustomFields(extraInfo){

	if(extraInfo && extraInfo.data){
		$("#extraInfo").empty();
		extraInfoList = {};
		extraInfoIndex = 0;
		totalExtraFields = 0;
		Object.keys(extraInfo.data).forEach(function(key){
			extraInfoList[key] = extraInfo.data[key];
			addExtraInfo(key, extraInfo.data[key]);
		});

	}


}
function commentModified(index, value){
	if(commentList[index]){
		commentList[index] = value;
	}
}
function commentAdded(index, value){
	commentList[index] = value;
}
function renderComments(customFields){
	$("#commentList").empty();
	if(customFields && customFields.comments){
		commentIndex = 0;
		commentList = {};
		for(let comment of customFields.comments){
			commentList[index] = comment;
			var html = '<div class="col-md-6">'+
			'<input type="text" class="form-control" id="comment_'+commentIndex+'" onchange="commentModified('+commentIndex+',this.value)" value="'+comment+'">'+
			'</div>'
			$("#commentList").append(html);
			commentIndex++;
		}

	}
	var html = '<div class="col-md-6">'+
	'<input type="text" class="form-control" id="comment_'+commentIndex+'" onchange="commentAdded('+commentIndex+',this.value)">'+
	'</div>'
	$("#commentList").append(html);
	commentIndex++;
}
function renderStackTraces(stacktraces){
	var index = 1;
	$("#stackTraceInfo").empty();
	stacktraces.forEach(function(stacktrace){
		var html = renderStackTrace(index, stacktrace.rva_on_original, stacktrace.rva, stacktrace.function, stacktrace.module, stacktrace.repository.original, stacktrace.repository.mined)
		index++;
		$("#stackTraceInfo").append(html);
	});
}
function rvaOnOriginalChanged(index, value){
	if(selectedDocument){
		selectedDocument.stacktrace[index].rva_on_original = value;
	}
}
function rvaChanged(index, value){
	if(selectedDocument){
		selectedDocument.stacktrace[index].rva = value?parseInt(value, 16):"";
	}
}
function moduleChanged(index, value){
	if(selectedDocument){
		selectedDocument.stacktrace[index].module = value;
	}
}
function functionChanged(index, value){
	if(selectedDocument){
		selectedDocument.stacktrace[index].function = value;
	}
}
function originalChanged(index, value){
	if(selectedDocument){
		selectedDocument.stacktrace[index].repository.original = value;
	}
}
function minedChanged(index, value){
	if(selectedDocument){
		selectedDocument.stacktrace[index].repository.mined = value;
	}
}
function enableStackTraceRow(index){
	if(index>=0){
		$("#rva_on_original_"+index).attr("readonly", false);
		$("#rva_"+index).attr("readonly", false);
		$("#module_"+index).attr("readonly", false);
		$("#function_"+index).attr("readonly", false);
		$("#original_"+index).attr("readonly", false);
		$("#mined_"+index).attr("readonly", false);
	}
}
function renderStackTrace(index, rva_on_original, rva, func, mod, original, mined){
	var rvaVal = rva?rva.toString(16):"";
	var html = '<div class="row">'+
	'<label class="col-md-3 control-label" for="inputDisabled">'+index+'</label>'+
	'<button class="col-md-1 col-md-offset-7 btn btn-default btn-sm" onClick="enableStackTraceRow('+index+')" type="submit">Edit</button></div>'+
	'<div class="row">'+
	'<div class = "col-md-9 col-md-offset-3">'+
	'<div class="row">'+
	'<div class="col-md-3">'+
	'<div class="form-group">'+
	'<label class="control-label">rva_on_original</label>'+
	'<input type="text" name="rva_on_original" readonly="true" id="rva_on_original_'+index+'" class="form-control input-sm" value="'+rva_on_original+'" onchange="rvaOnOriginalChanged('+(index-1)+',this.value)">'+
	'</div>'+
	'</div>'+
	'<div class="col-md-3">'+
	'<div class="form-group">'+
	'<label class="control-label">rva</label>'+
	'<input type="text" name="rva" id="rva_'+index+'" readonly="true" class="form-control input-sm" value="'+rvaVal+'" onchange="rvaChanged('+(index-1)+',this.value)">'+
	'</div>'+
	'</div>'+
	'<div class="col-md-4">'+
	'<div class="form-group">'+
	'<label class="control-label">module</label>'+
	'<input type="text" name="module" id="module_'+index+'" readonly="true" class="form-control input-sm" value="'+mod+'" onchange="moduleChanged('+(index-1)+',this.value)">'+
	'</div>'+
	'</div>'+
	'</div>'+
	'<div class="row">'+
	'<div class="col-md-11">'+
	'<div class="form-group">'+
	'<label class="control-label">function</label>'+
	'<input type="text" name="function" id="function_'+index+'" readonly="true" class="form-control input-sm" value="'+func+'" onchange="functionChanged('+(index-1)+',this.value)">'+
	'</div>'+
	'</div>'+
	'</div>'+
	'<div class="row">'+

	'<div class="col-md-5">'+
	'<div class="form-group">'+
	'<label class="control-label">Original Repository</label>'+
	'<input type="text" name="original" id="original_'+index+'" readonly="true" class="form-control input-sm" value="'+original+'" onchange="originalChanged('+(index-1)+',this.value)">'+
	'</div>'+
	'</div>'+
	'<div class="col-md-5 col-md-offset-1">'+
	'<div class="form-group">'+
	'<label class="control-label">Mined Repository</label>'+
	'<input type="text" name="mined" id="mined_'+index+'" readonly="true" class="form-control input-sm" value="'+mined+'" onchange="minedChanged('+(index-1)+',this.value)">'+
	'</div>'+
	'</div>'+

	'</div>'+
	'<hr>'+
	'</div>'+
	'</div>'+

	'</div>'
	return html;
}
function openDocument(docId){
	$("#docList").addClass("hide");
	$("#documentDetail").removeClass("hide");
	$("#headerText").text("Document");
	getDocument(docId).then(function(res){
		selectedDocument = res;
		renderDocument(res);
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
			showDocList(selectedFolder, selectedFolderName, currentPage, limit);
		}).catch(function(e){
			if(e.status===200){
				showDocList(selectedFolder, selectedFolderName, currentPage, limit);

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
	$('#basicTree').jstree(true).delete_node(selectedFolder+"_basic");
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
		showDocList(selectedFolder, selectedFolderName, currentPage, limit);
	}, function (error){
		showDocList(selectedFolder, selectedFolderName, currentPage, limit);

		console.log(error);
	})
}

function originalPathChanged(value){
	if(selectedDocument){
		selectedDocument.original_path = value;
	}
}

function updateDocument(){
	window.event.stopPropagation();

	if(selectedDocument){

		if(!selectedDocument.extra_info){
			selectedDocument.extra_info={};
		}
		for(let key of Object.keys(extraInfoList)){
			if(!extraInfoList[key] || extraInfoList[key].trim().length<=0){
				return alert("Please provide value for key "+ key);
			}
		}
		selectedDocument.extra_info.data = extraInfoList;
		var data = {
			original_path: selectedDocument.original_path,
			stacktrace: selectedDocument.stacktrace,
			extra_info:selectedDocument.extra_info,
		}
		updateDocApi(selectedDocument._id, data).then(function(response){
			console.log(response);
		}, function(err){
			console.log(err);
		});
	}
}

function gotoFirstPage(){
	if(currentPage===1){
		return;
	}
	showDocList(selectedFolder, selectedFolderName, 1, limit);
}
function gotoPreviousPage(){
	if(currentPage===1){
		return;
	}
	showDocList(selectedFolder, selectedFolderName, currentPage-1, limit);

}

function gotoNextPage(){
	if(currentPage===totalPages){
		return;
	}
	showDocList(selectedFolder, selectedFolderName, currentPage+1, limit);

}
function gotoPage(page){
	showDocList(selectedFolder, selectedFolderName, page, limit);

}
function gotoLastPage(){
	if(currentPage===totalPages){
		return;
	}
	showDocList(selectedFolder, selectedFolderName, totalPages, limit);

}
