function getFolders(){
	return $.get("/api/web/folder");
}

function getDocument(id){
	return $.get("/api/web/document/"+id);
}

function addFolder(name, parent){
	var data ={
		name:name,
		parent:parent
	}
	return $.ajax({
		type: "POST",
		url: "/api/web/folder",
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		dataType: "json"
	});

}


function addFolder(name, parent){
	var data ={
		name:name,
		parent:parent
	}
	return $.ajax({
		type: "POST",
		url: "/api/web/folder",
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		dataType: "json"
	});

}

function updateDocApi(docId, data){

	return $.ajax({
		type: "PUT",
		url: "/api/web/document/"+docId,
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		dataType: "json"
	});

}

function getDocumentsInsideFolder(folderId, limit, page){
	return $.get("/api/web/folder/"+folderId+"/document?limit="+limit+"&page="+page);
}

function moveDocsToFolderApi(folderId, docIds){
	var data ={
		documents:docIds
	}
	return $.ajax({
		type: "POST",
		url: "/api/web/folder/"+folderId+"/document",
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		dataType: "json"
	});

}

function deleteFolderApi(id){
	return $.ajax({
		url: '/api/web/folder/'+id,
		type: 'DELETE'
	});

}

function deleteDocsApi(folderId, docIds){
	var data ={
		documents:docIds
	}
	return $.ajax({
		url: '/api/web/folder/'+folderId+"/document",
		type: 'DELETE',
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		dataType: "json"
	});
}

function editFolderApi(folderId, name){
	var data = {
		name:name
	}
	return $.ajax({
		type: "PUT",
		url: "/api/web/folder/"+folderId,
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		dataType: "json"
	});
}

function getEditableFields(){
	return $.get("/api/web/document/editableFields");
}
