var ws;
(function (){
	window.onload = function(){
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
		};

		send_msg.onclick = function(){
			send_msg.value = ""; 
		};

		form.onsubmit = function(){
			ws.send(send_msg.value);
			send_msg.value = "";
			return false;
		};
	};
})();


$(function () {
    var data = [[1, 'Exxon Mobil', '339,938.0', '36,130.0'],
				[2, 'Wal-Mart Stores', '315,654.0', '11,231.0'],
				[3, 'Royal Dutch Shell', '306,731.0', '25,311.0'],
				[4, 'BP', '267,600.0', '22,341.0'],
				[5, 'General Motors', '192,604.0', '-10,567.0'],
				[6, 'Chevron', '189,481.0', '14,099.0'],
				[7, 'DaimlerChrysler', '186,106.3', '3,536.3'],
				[8, 'Toyota Motor', '185,805.0', '12,119.6'],
				[9, 'Ford Motor', '177,210.0', '2,024.0'],
				[10, 'ConocoPhillips', '166,683.0', '13,529.0'],
				[11, 'General Electric', '157,153.0', '16,353.0'],
				[12, 'Total', '152,360.7', '15,250.0'],
				[13, 'ING Group', '138,235.3', '8,958.9'],
				[14, 'Citigroup', '131,045.0', '24,589.0'],
				[15, 'AXA', '129,839.2', '5,186.5'],
				[16, 'Allianz', '121,406.0', '5,442.4'],
				[17, 'Volkswagen', '118,376.6', '1,391.7'],
				[18, 'Fortis', '112,351.4', '4,896.3'],
				[19, 'Crédit Agricole', '110,764.6', '7,434.3'],
				[20, 'American Intl. Group', '108,905.0', '10,477.0']];


    var obj = { width: 700, height: 400, title: "ParamQuery Grid Example",resizable:true,draggable:true };
    obj.colModel = [{ title: "id", width: 100, dataType: "integer", editable: false },
					{ title: "name", width: 200, dataType: "string" },
					{ title: "age", width: 150, dataType: "integer", align: "right" },
					{ title: "Profits ($ millions)", width: 150, dataType: "float", align: "right"}];
    obj.dataModel = { data: data };
	obj.cellSave = function(ev,ui){
		console.log(ui);
		console.log(ui.rowData);
		ws.send(JSON.stringify({
			type: "update",
			id: ui.rowData[0],
			col:ui.column.title,
			oldVal: ui.oldVal,
			newVal: ui.newVal
		}));
	};
    var grid = $("#grid_array").pqGrid(obj);

});

