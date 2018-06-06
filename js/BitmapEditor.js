document.addEventListener("DOMContentLoaded", function(event) { 
	Init();
});

function FeatureListClicked() {
	var features = document.getElementById("feature-list");
	features.className = features.className === "hidden" ? "" : "hidden";
}

var mouseDown = 0;
var prevMouse = 0;
document.onmousedown = function() { 
	if (prevMouse) {
		mouseDown = -prevMouse;
	} else {
		mouseDown = 1;
	}
}

document.onmouseup = function() {
	prevMouse = mouseDown;
	mouseDown = 0;
}

var grid = new Array(0);
var mask = new Array(0);

function Init() {
	grid = InitGrid();
    mask = InitMask();
	DisplayGrid();			
    DisplayMask();
}

function InitGrid() {
	var _grid = new Array(16);
	for (i=0; i<16; i++) {
		_grid[i] = new Array(16);
		for (j=0; j<16; j++) {
			_grid[i][j]=false;
		}
	}
	return _grid;
}

function RotateBitmapRight() {
	var _grid = InitGrid();

	for (i=0; i<16; i++) {
		for (j=0; j<16; j++) {
			_grid[j][15-i]=grid[i][j];
		}
	}
	
	grid = _grid;
	DisplayGrid();
}

function MirrorBitmap() {
	var _grid = InitGrid();

	for (i=0; i<16; i++) {
		for (j=0; j<16; j++) {
			_grid[i][15-j]=grid[i][j];
		}
	}

	grid = _grid;
	DisplayGrid();
}

function DisplayGrid() {
	var container = document.getElementById("bitmap-table");
	var cContainer = container.cloneNode(false);
	container.parentNode.replaceChild(cContainer ,container);
	container = document.getElementById("bitmap-table");
	var i, j;
	for (j = -1; j < 16; j++) {
		for (i = -1; i < 16; i++) {
			var iDiv = document.createElement("div");
			
			if (i == -1 && j == -1) {
				iDiv.id = "bitmap-corner-cell";
				iDiv.className = "bitmap-border-cell bitmap-corner-cell";
			} else if (i == -1 && j != -1) {
				iDiv.id = "bitmap-rownum-cell-" + (j + 1);
				iDiv.className = "bitmap-border-cell bitmap-rownum-cell-title-" + (j + 1);
				iDiv.innerHTML = j + 1;
			} else if (i != -1 && j == -1) {
				iDiv.id = "bitmap-colnum-cell-" + (i + 1);
				iDiv.className = "bitmap-border-cell bitmap-colnum-cell-title-" + (i + 1);
				iDiv.innerHTML = i + 1;
			} else {
				iDiv.id = (i * 16) + j;
				iDiv.className = "bitmap-cell";

				iDiv.onmousedown = OnCellClicked;
				iDiv.onmouseover = OnCellHover;

				if (grid[i][j]) {
					iDiv.style.backgroundColor = "black";
				} else {
					iDiv.style.backgroundColor = "white";
				}
			}

			container.appendChild(iDiv);
		}
	}

	container.onpointercancel = function() { mouseDown = 0; }

	//GenerateBitMap();
};

function copyCode() {
	var textArea = document.querySelector('#generatedCode');
	var extraTab = document.getElementById("extraTab").checked;
	var textAreaValue = textArea.value;


	if (extraTab) {
		textArea.value = '\t' + textArea.value.split('\n').join('\n\t');
	}

	textArea.select();

	try {
		var result = document.execCommand('copy');
		if (!result) {
			alert('Sorry, the code copy failed.');
		} else {
			console.log('Code was copied successfully');
		}

		textArea.value = "";
	} catch (err) {
		console.err('There was an error copying the code to the clipboard');
		console.err(err);
		alert('Sorry, the code copy failed.');
	}

	textArea.value = textAreaValue;
}

function OnCellHover(e) {
	var cell = e.target || e.srcElement;
    var _grid;
    if (e.target.classList.contains('bitmap-cell'))
    {
        _grid = grid;
        _size = 16;
    }
    else
    {
        _grid = mask;
        _size = 5;
    }
	if (mouseDown !== 0) {
		var i = cell.id / _size | 0;
		var j = cell.id - i * _size;
		if (mouseDown === 1) {
			_grid[i][j] = true;
			cell.style.backgroundColor = "black";
		} else if (mouseDown === -1) {
			_grid[i][j] = false;
			cell.style.backgroundColor = "white";
		}
	}
	// GenerateBitMap();
}

function OnCellClicked(e) {
	var cell = e.target || e.srcElement;
    var _grid;
    if (e.target.classList.contains('bitmap-cell'))
    {
        _grid = grid;
        _size = 16;
    }
    else
    {
        _grid = mask;
        _size = 5;
    }
	var i = cell.id / _size | 0;
	var j = cell.id - i * _size;

	_grid[i][j] = !_grid[i][j];
	if (_grid[i][j]) {
		cell.style.backgroundColor = "black";
	} else {
		cell.style.backgroundColor = "white";
	}
	// GenerateBitMap();
}

function NegativeBitmap() {
	var i, j;
	for (i = 0; i < 16; i++) {
		for (j = 0; j < 16; j++) {
			grid[i][j] = !grid[i][j];
		}
	}
	DisplayGrid();
}

function ShiftLeft() {
	var i,j;
	
	for (i = 0; i < 16; i++) {
		for (j = 0; j < 15; j++) {
			grid[i][j] = grid[i][j + 1];
		}
		
		grid[i][15] = false;
	}
	
	DisplayGrid();
}

function ShiftRight() {
	var i,j;
	
	for (i = 0; i < 16; i++) {
		for (j = 15; j > 0; j--) {
			grid[i][j] = grid[i][j - 1];
		}
		
		grid[i][0] = false;
	}
	
	DisplayGrid();
}

function ShiftUp() {
	var i,j;
	
	for (i = 0; i < 15; i++) {
		for (j = 0; j < 16; j++) {
			grid[i][j] = grid[i + 1][j];
		}	
	}
	
	for (j = 0; j < 16; j++) {
		grid[15][j] = false;
	}

	DisplayGrid();
}

function ShiftDown() {
	var i,j;
	
	for (i = 15; i > 0; i--) {
		for (j = 0; j < 16; j++) {
			grid[i][j] = grid[i - 1][j];
		}	
	}
	
	for (j = 0; j < 16; j++) {
		grid[0][j] = false;
	}

	DisplayGrid();
}

function GenerateBitMap() {
	var i, j;
	var value;

	var functionTypeSelect = document.getElementById('functionType');			
	methodType = functionTypeSelect.options[functionTypeSelect.selectedIndex].value;

	generateCode = document.getElementById('generatedCode');
	generateCode.value =	methodType + " void " +
							document.getElementById('functionName').value +
							"(int location) {\n"+(methodType === 'function' ? "\tvar int memAddress;\n" : "")+
							"\tlet memAddress = 16384 + location;\n";

	for (i=0; i<16; i++) {
		//get grid binary representation
		binary = "";
		for (j=0; j<16; j++) {
			if (grid[i][j])
				binary = "1" + binary;
			else
				binary = "0" + binary;
		}
	  
		isNegative = false;
		//if number is negative, get its  one's complement
		if (binary[0] == "1") {
			isNegative = true;
			oneComplement = "";
			for (k=0; k<16; k++) {
				if (binary[k] == "1")
					oneComplement = oneComplement + "0";
				else
					oneComplement = oneComplement + "1";
			}
			binary = oneComplement;				 
		}
		
		//calculate one's complement decimal value
		value = 0;
		for (k=0; k<16; k++) {
			value = value * 2;
			if (binary[k] == "1")
				value=value+1;
		}				

		//two's complement value if it is a negative value
		if (isNegative == true)
			value = -(value + 1)

		generateCode.value = generateCode.value + GenerateCodeLine(i, value);
	}

	generateCode.value = generateCode.value + "\treturn;\n}";
}

function GenerateCodeLine(row, value) {
	str = "\tdo Memory.poke(memAddress + " + row*32 + ", " + value + ");\n";
	return str;
}

/* mask */
function InitMask() {
	var _mask = new Array(5);
	for (i=0; i<5; i++) {
		_mask[i] = new Array(5);
		for (j=0; j<5; j++) {
			_mask[i][j]=false;
		}
	}
	return _mask;
}

function DisplayMask() {
	var container = document.getElementById("mask-table");
	var cContainer = container.cloneNode(false);
	container.parentNode.replaceChild(cContainer ,container);
	container = document.getElementById("mask-table");
	var i, j;
	for (j = -1; j < 5; j++) {
		for (i = -1; i < 5; i++) {
			var iDiv = document.createElement("div");
			
			if (i == -1 && j == -1) {
				iDiv.id = "mask-corner-cell";
				iDiv.className = "mask-border-cell bitmap-corner-cell";
			} else if (i == -1 && j != -1) {
				iDiv.id = "mask-rownum-cell-" + (j + 1);
				iDiv.className = "mask-border-cell bitmap-rownum-cell-title-" + (j + 1);
				iDiv.innerHTML = j + 1;
			} else if (i != -1 && j == -1) {
				iDiv.id = "mask-colnum-cell-" + (i + 1);
				iDiv.className = "mask-border-cell bitmap-colnum-cell-title-" + (i + 1);
				iDiv.innerHTML = i + 1;
			} else {
				iDiv.id = (i * 5) + j;
				iDiv.className = "mask-cell";

                iDiv.onmousedown = OnCellClicked;
				iDiv.onmouseover = OnCellHover;

				if (grid[i][j]) {
					iDiv.style.backgroundColor = "black";
				} else {
					iDiv.style.backgroundColor = "white";
				}
			}

			container.appendChild(iDiv);
		}
	}

	container.onpointercancel = function() { mouseDown = 0; }

};
