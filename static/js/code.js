
//-----------------------------------------------------------------------------------------------------------------------------------
//------------------initial population of dropdowns ------------------------------
fx_populate_dropdown ();


//-----------------------------------------------------------------------------------------------------------------------------------

function fx_restyle_need () {
$e_restyle = document.getElementById('id_row1_div2').querySelector('.plotly')  


if ($e_restyle == null) {  v_restyle='not needed'; }
else {   v_restyle='needed'; }

console.log(v_restyle);

};

//-----------------------------------------------------------------------------------------------------------------------------------
//-------------------- fx_dropdown function to display dropdowns
function fx_dropdown(v_list_of_dict1,v_dom_id  , v_default_value) {
  console.log(v_default_value);
  document.getElementById(v_dom_id).length = 0 ;
  var x = document.createElement("option");
  x.setAttribute("value", v_default_value);
  x.setAttribute("selected", true);
  var t = document.createTextNode(v_default_value);
  x.appendChild(t);
  document.getElementById(v_dom_id).appendChild(x);

  var f1 = function(s) { 
    var x = document.createElement("option");
    x.setAttribute("value", s['dropdown_value']);
    var t = document.createTextNode(s['dropdown_display']);
    x.appendChild(t);
    document.getElementById(v_dom_id).appendChild(x);
  };

  v_list_of_dict1.forEach(f1);

};

//-----------------------------------------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------------------------------------
//-------------------- fx_populate_dropdown ---dynamic data calculation for dropdowns

// function fx_populate_dropdown1 ()  {

  // v_sample_value = document.getElementById("id_sample").value
// console.log('xxxx')
  // v_list_of_dict = [
                 // {'dropdown_value' : 'BB_1940' , 'dropdown_display' : 'BB_1940' },
				 // {'dropdown_value' : 'nish_941' , 'dropdown_display' : 'nish_941' },
				 // {'dropdown_value' : 'BB_943' , 'dropdown_display' : 'BB_943' },
				 // {'dropdown_value' : 'BB_944' , 'dropdown_display' : 'BB_944' },
				 // {'dropdown_value' : 'BB_947' , 'dropdown_display' : 'BB_947' }
                    // ];

  // fx_dropdown (v_list_of_dict , 'id_sample' , v_sample_value);

// };


//------------redoing -------- fx_populate_dropdown ---dynamic data calculation for dropdowns


function fx_populate_dropdown() {
	url = 'http://127.0.0.1:5000/names'
	
  Plotly.d3.json(url, function(error, response) {

    // Grab values from the response json object to build the plots
    var list1 = response;
      v_sample_value = document.getElementById("id_sample").value
	v_list_of_dict = list1.map(i => {
      return({'dropdown_value' : i , 'dropdown_display' : i });
    });

      fx_dropdown (v_list_of_dict , 'id_sample' , v_sample_value);
  }
  );
}





//-----------------------------------------------------------------------------------------------------------------------------------
//-------------------- fx_reset_dropdown ---reseting dropdowns to original value in the end

function fx_reset_dropdown () {

fx_populate_dropdown ();
  
};



//-----------------------------------------------------------------------------------------------------------------------------------
// ------------background hide and display TRIGGER

function fx_backgroud(v_action) {
  $e_id_bg_image= document.getElementById('id_bg_image');
  $e_id_all_plots_container= document.getElementById('id_all_plots_container');
  $e_id_info_message= document.getElementById('id_info_message');
  
  if  (v_action == 'show')  {
    $e_id_bg_image.classList.remove("d-none");
	//$e_id_info_message.classList.remove("d-none");
    $e_id_all_plots_container.classList.add("d-none");
  }
  else if (v_action == 'hide') {
    $e_id_bg_image.classList.add("d-none");
	$e_id_info_message.classList.add("d-none");
    $e_id_all_plots_container.classList.remove("d-none");
  };
};



//-----------------------------------------------------------------------------------------------------------------------------------
//-----------------plot action----------------------

$e_search= document.getElementById('id_sample');
$e_search.addEventListener("change", fx_plots);

function fx_plots(event) {
	
	//--------------------Determine restyling need---------------------------------------------------------------------------------------------------------------

fx_restyle_need ();

// $e_restyle = document.getElementById('id_row1_div2').querySelector('.plotly')  

// if ($e_restyle == null) { var v_restyle='not needed'; }
// else {  var v_restyle='needed'; }


	//-----------------------
  event.preventDefault();
  
  var $e_selection_text= document.getElementById("id_selection_text");
  $e_selection_text.innerHTML = '';
  fx_backgroud('hide');
  
  v_sample_value = document.getElementById("id_sample").value

  
  
// ----------------------table call 



url = 'http://127.0.0.1:5000/metadata/'+v_sample_value
	
Plotly.d3.json(url, function(error, response) {var d1 = response;
console.log(d1)

// d1 ={
        // 'AGE': 24,
        // 'BBTYPE': "I",
        // 'ETHNICITY': "Caucasian",
        // 'GENDER': "F",
        // 'LOCATION': "Beaufort/NC",
        // 'SAMPLEID': 940
    // }

k =  Object.keys(d1)
//["AGE", "BBTYPE", "ETHNICITY", "GENDER", "LOCATION", "SAMPLEID"]



v_plot1_list_of_dict  = k.map (i => {return ( {'Sample MetaData' : i +': ' + d1[i]  } )  } )


	
//v_plot1_list_of_dict = [ {'Sample MetaData' : k + ': '+ str(v) } for k,v in d1.items()]

// v_plot1_list_of_dict =[{'Sample MetaData': 'AGE: 24'},
 // {'Sample MetaData': 'BBTYPE: I'},
 // {'Sample MetaData': 'ETHNICITY: Caucasian'},
 // {'Sample MetaData': 'GENDER: F'},
 // {'Sample MetaData': 'LOCATION: Beaufort/NC'},
 // {'Sample MetaData': 'SAMPLEID: 940'}]

 fx_table( v_plot1_list_of_dict, 'id_row1_div1');
 
 
 }    );

 //------------------bubble-------------------
  
  url = 'http://127.0.0.1:5000/samples/'+v_sample_value
	
Plotly.d3.json(url, function(error, response) {
	

v_plot1_list_of_dict  = response

 fx_bubble( v_plot1_list_of_dict, 'id_row2_div1');
 
 
 }    );
 
    
 //------------------pie-------------------
  
  url = 'http://127.0.0.1:5000/samples/'+v_sample_value



Plotly.d3.json(url, function(error, response) {
	

v_plot1_list_of_dict  = response

  fx_pie( v_plot1_list_of_dict, 'id_row1_div2');
 
 
 }    );
 
    
		
	
  //------------------------gauge------------- 
  url = 'http://127.0.0.1:5000/wfreq/'+v_sample_value
	
Plotly.d3.json(url, function(error, response) {
	

v_int_value  = response

fx_gauge( v_int_value, 'id_row1_div3');
 
 
 }    );
 
  
  
  
//-----------------------------------
  
  if (v_sample_value != 'select sample') {
  fx_backgroud('hide');
  }
  else {
    fx_backgroud('show');
  }
  ;
  
 v_selection_text = 'Use interactive charts below to explore the dataset.  '
 //if (v_sample_value.replace('select sample','') != '')  { v_selection_text = v_selection_text + 'sample = ' + v_sample_value.replace('select sample','')+ '   '; }


  var $e_selection_text= document.getElementById("id_selection_text");
  $e_selection_text.innerHTML = v_selection_text;
};






//-----------------------------------------------------------------------------------------------------------------------------------
function fx_bubble( v_filtered_list_of_dict , v_dom_id  ){

max_otu = Math.max(...v_filtered_list_of_dict['otu_ids'])
v_color_list = v_filtered_list_of_dict['otu_ids'].map( i => Math.round((i*40)/max_otu) )

max_sample_values = Math.max(...v_filtered_list_of_dict['sample_values'])
v_size_list = v_filtered_list_of_dict['sample_values'].map( i => 10* Math.round((i*10)/max_sample_values) )



if (v_restyle=="needed") {
  Plotly.restyle(v_dom_id, "x",  [v_filtered_list_of_dict['otu_ids']]   );
  Plotly.restyle(v_dom_id, "y", [v_filtered_list_of_dict['sample_values']] );
  Plotly.restyle(v_dom_id, "marker.color", [v_color_list] );
  Plotly.restyle(v_dom_id, "marker.size", [v_size_list] );
  
}
else 
{

// Create the Traces




var trace1 = {
  x: v_filtered_list_of_dict['otu_ids'],
  y: v_filtered_list_of_dict['sample_values'],
  text: v_filtered_list_of_dict['otu_desc'], 
  mode: "markers",
  type: "scatter",
  name: "high jump",
  marker: {
    color: v_color_list,
    symbol: "circle",
	size : v_size_list,
	colorscale : 'Viridis'
  }
};



// Create the data array for the plot
var data = [trace1];

// Define the plot layout
var layout = {
  title: "Sample Value vs the OTU ID",
  xaxis: { title: "OTU ID" },
  yaxis: { title: "Sample Values" },
    height: 500,
  width: 1150,
};

// Plot the chart to a div tag with id "plot"
Plotly.newPlot(v_dom_id, data, layout);

}

};


//-----------------------------------------------------------------------------------------------------------------------------------
function fx_gauge( v_int_value,v_dom_id  ){



// Enter a speed between 0 and 10
var level = v_int_value;

// Trig to calc meter point
var degrees = 10 - level,
     radius = .5;
var radians = degrees * Math.PI / 10;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

var data = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 10, color:'850000'},
    showlegend: false,
    name: 'speed',
    text: 'nish',
    hoverinfo: 'name'},
  { 
  values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9 , 50],
  rotation: 90,
  text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1' ,''],
  textinfo: 'text',
  textposition:'inside',      
  marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                         'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
						 'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                         'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)', 'rgba(232, 226, 202, .5)',
                         'rgba(255, 255, 255, 0)']},
  //labels: ['151-180', '121-150', '91-120', '61-90', '31-60', '0-30', ''],
  hoverinfo: 'label',
  hole: .5,
  type: 'pie',
  showlegend: false
}];

var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  title: '<b>Belly Button Washing Frequency</b> <br>Scrubs per week',
  height: 400,
  width: 400,
  xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
};

Plotly.newPlot(v_dom_id, data, layout);

};


//-----------------------------------------------------------------------------------------------------------------------------------

function fx_pie( v_filtered_list_of_dict , v_dom_id  ){
	


if (v_restyle=="needed") {
  Plotly.restyle(v_dom_id, "labels",  [v_filtered_list_of_dict['otu_ids']]   );
  Plotly.restyle(v_dom_id, "values", [v_filtered_list_of_dict['sample_values']] );
}
else 
{
		var trace1 = {
  labels: v_filtered_list_of_dict['otu_ids'],
  values: v_filtered_list_of_dict['sample_values'],
   hovertext : v_filtered_list_of_dict['otu_desc'], 
  type: 'pie'
};

var data = [trace1];

var layout = {
  title: "Sample Value %",
    height: 400,
  width: 400,
};
Plotly.newPlot(v_dom_id, data, layout);
}
;


};
//-----------------------------------------------------------------------------------------------------------------------------------
//------------meta data  population 

function fx_table( v_filtered_list_of_dict , v_dom_id  ){

  var $e_table= document.getElementById(v_dom_id);
  var $e_header =  $e_table.querySelector("thead");
  var $e_tbody =  $e_table.querySelector("tbody");

  // Start the table body  and header with a blank HTML
  $e_tbody.innerHTML = "";
  $e_header.innerHTML = "";

  var v_result_data_set = v_filtered_list_of_dict;
  var v_header_col_list = Object.keys(v_filtered_list_of_dict[0]);

  //---header population 
  var row = $e_header.insertRow(0);
    for (var k = 0; k < v_header_col_list.length; k++) {
      var  th = document.createElement('th');
		th.innerHTML = v_header_col_list[k];
		row.appendChild(th);
  };
  //----
  
  // The outer loop fills the rows
  // The inner loop fills the cells for each row
  for (var i = 0; i < v_result_data_set.length; i++) {
    // Insert a row into the table at position i
    var $row = $e_tbody.insertRow(i);
    d1 =  v_result_data_set[i];

    for (var j = 0; j < v_header_col_list.length; j++) {
      var $cell = $row.insertCell(j);
      $cell.innerText = d1[v_header_col_list[j]]; 
    }

  }

  



  //-----


};

//-----------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------




