var ws;

class Hoge {
	constructor(){
	}
	hoge(){
		console.log('hoge');
	}
}

var a = new Hoge();
a.hoge();

$(function () {
	var msgbox = document.getElementById("msgs");
	var form = document.getElementById("form");
	var send_msg = document.getElementById("send_msg");
	ws = new WebSocket('ws://' + window.location.host + "/websocket");

	ws.onopen = function() { 
		console.log("connection opened");
	};
	ws.onclose = function() { 
		console.log("connection closed");
	};
	ws.onmessage = function(m) {
		var li = document.createElement("li");
		li.textContent = m.data;
		msgbox.insertBefore(li, msgbox.firstChild);
		var msg = JSON.parse(m.data);
		console.log(msg);
	};

	/*
	  send_msg.onclick = function(){
	  send_msg.value = ""; 
	  };

	  form.onsubmit = function(){
	  ws.send(send_msg.value);
	  send_msg.value = "";
	  return false;
	  };
	*/

	var table;

    var obj = { width: 700, height: 400, title: "ParamQuery Grid Example",resizable:true,draggable:true };
    obj.colModel = [{ dataIndx: 'id', title: "id", width: 100, dataType: "integer", editable: false },
					{ dataIndx: 'name', title: "name", width: 200, dataType: "string" },
					{ dataIndx: 'age', title: "age", width: 150, dataType: "integer", align: "right" }];
    obj.dataModel = { data: [] };
	obj.cellSave = function(ev,ui){
		console.log(ui);
		console.log(ui.rowData);
		table.updateValue(0+ui.rowData.id, ui.column.dataIndx, ui.newVal);
		ws.send(JSON.stringify({
			type: "update",
			id: ui.rowData[0],
			col:ui.column.title,
			oldVal: ui.oldVal,
			newVal: ui.newVal
		}));
	};
    var grid = $("#grid_array").pqGrid(obj);

	var rep = new Repository();
	rep.createTable('people', {});
	rep.on('update', function(sender, ev){
		console.log('update', ev);
	});
	rep.on('insert', function(sender, ev){
		console.log('insert', ev);
		grid.pqGrid('addRow', {rowData: ev.row});
	});

	table = rep.getTable('people'); 
	var t = rep.getTable('people');
	t.insert({id: 1, name: 'hoge', age: 30});
	t.insert({id: 2, name: 'fuga', age: 20});
	t.updateValue(1, 'name', 'hoge2');
	console.log(rep);
	console.table(t.data);
	
});

