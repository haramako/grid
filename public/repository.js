'use strict';
/*

             Cache
               |
  SV  ---> Repository  ---> View
                       emit  

      <---             <---
	                  methods

 */

function Repository(){
	this.tables = {};
}
EventEmitter.extend(Repository.prototype);

Repository.prototype.getTable = function(name){
	return this.tables[name];
};

Repository.prototype.createTable = function(name, schema){
	this.tables[name] = new Table(this, name, schema);
};

//
function Table(repository, name, schema){
	this.repository = repository;
	this.name = name;
	this.schema = schema;
	this.data = {};
};

Table.prototype.emit = function(type, ev){
	ev.table = this.name;
	this.repository.emit(type, ev);
};

Table.prototype.find = function(id){
	return this.data[id];
};

Table.prototype.remove = function(id){
	this.emit('remove', row);
	delete this.data[id];
};

Table.prototype.insert = function(row){
	if( this.data[row.id] ){
		throw "" + row.id + " already exists";
	}
	this.data[row.id] = row;
	this.emit('insert', {row: row});
};

Table.prototype.update = function(row){
	if( !this.data[row.id] ){
		throw "" + row.id + " does not exists";
	}
	this.emit('update', {row: row});
	this.data[row.id] = row;
};

Table.prototype.updateValue = function(id, key, val){
	var row = this.find(id);
	if( row ){
		if( row[key] != val ){
			row[key] = val;
			this.emit('update', {row: row, key:key, val:val});
		}
	}else{
		throw "invalid key " + key;
	}
};
