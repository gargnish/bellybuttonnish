# import necessary libraries
import os
import numpy as np
import pandas as pd
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func  
from config import config

#sys.path.insert(0, './db')
from db.models import db, sess, c_otu, c_samples_metadata, c_samples

from flask.ext.cors import CORS
#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#config_name = os.getenv("FLASK_ENV", "default")
config_name = "development"
app.config.from_object(config[config_name])

CORS(app, headers=['Content-Type'])


db.init_app(app)		
######################################################
		



# create route that renders index.html template
@app.route("/")
def home():
    """Return the dashboard homepage"""
    return render_template("index.html")


#########################################

@app.route('/names')
def name():
    """List of sample names.
    Returns a list of sample names in the format
    [
        "BB_940",
        "BB_941",
        "BB_943",
        "BB_944",
        "BB_945",
        "BB_946",
        "BB_947",
        ...
    ]
    """
    list1 = sess.query( c_samples_metadata.SAMPLEID). \
        order_by(c_samples_metadata.SAMPLEID). \
        all()
    r1 = [ 'BB_' +str(x[0]) for x in list1]

    return jsonify(r1)

#########################################
@app.route('/otu')
def otu():
    """List of OTU descriptions.
    Returns a list of OTU descriptions in the following format
    [
        "Archaea;Euryarchaeota;Halobacteria;Halobacteriales;Halobacteriaceae;Halococcus",
        "Archaea;Euryarchaeota;Halobacteria;Halobacteriales;Halobacteriaceae;Halococcus",
        "Bacteria",
        "Bacteria",
        "Bacteria",
        ...
    ]
    """
    list1 = sess.query(c_otu.lowest_taxonomic_unit_found). \
        order_by(c_otu.lowest_taxonomic_unit_found). \
        all()
    r1 = [ x[0] for x in list1]
    return jsonify(r1)


#########################################
@app.route('/metadata/<v_sample>')
def sample_metadata(v_sample):
    """MetaData for a given sample.
    Args: Sample in the format: `BB_940`
    Returns a json dictionary of sample metadata in the format
    {
        AGE: 24,
        BBTYPE: "I",
        ETHNICITY: "Caucasian",
        GENDER: "F",
        LOCATION: "Beaufort/NC",
        SAMPLEID: 940
    }
    """
    list1 = sess.query(
        c_samples_metadata.AGE,
        c_samples_metadata.BBTYPE,
        c_samples_metadata.ETHNICITY,
        c_samples_metadata.GENDER,
        c_samples_metadata.LOCATION, c_samples_metadata.SAMPLEID). \
        filter(c_samples_metadata.SAMPLEID == func.replace(v_sample, 'BB_', ''))
    d1 = {'AGE': list1[0][0] , 'BBTYPE': list1[0][1],'ETHNICITY': list1[0][2], 'GENDER': list1[0][3], 'LOCATION': list1[0][4], 'SAMPLEID': list1[0][5]  }
    return jsonify(d1)

#########################################
@app.route('/wfreq/<v_sample>')
def wfreq(v_sample):
    """Weekly Washing Frequency as a number.

    Args: Sample in the format: `BB_940`

    Returns an integer value for the weekly washing frequency `WFREQ`
    """
    r1 = sess.query(c_samples_metadata.WFREQ). \
        filter(c_samples_metadata.SAMPLEID == func.replace(v_sample, 'BB_', ''))
    r2 = str(r1[0][0])
    return r2;
	
#########################################
@app.route('/samples/<v_sample>')
def sample(v_sample):
    """OTU IDs and Sample Values for a given sample.

    Sort your Pandas DataFrame (OTU ID and Sample Value)
    in Descending Order by Sample Value

    Return a list of dictionaries containing sorted lists  for `otu_ids`
    and `sample_values`

    [
        {
            otu_ids: [
                1166,
                2858,
                481,
                ...
            ],
            sample_values: [
                163,
                126,
                113,
                ...
            ]
        }
    ]
    """

    list_2d_statement = sess.query(c_otu.lowest_taxonomic_unit_found,c_samples.otu_id , 'samples.'+v_sample).filter(c_otu.otu_id==c_samples.otu_id).statement

    df = pd.read_sql_query(list_2d_statement, sess.bind).sort_values(['samples.'+v_sample], ascending=False).head(10)
    #otu_id  samples.BB_943
    l_otu_ids = [ int(r['otu_id']) for i,r in df.iterrows() ]
    l_sample_values = [ int(r['samples.'+v_sample]) for i,r in df.iterrows() ]
    l_otu_desc = [ r['lowest_taxonomic_unit_found'] for i,r in df.iterrows() ]
    d1 = { "otu_ids" : l_otu_ids , "sample_values" : l_sample_values , "otu_desc" : l_otu_desc }
    print(d1)
    return jsonify(d1)


#################################################
if __name__ == "__main__":
    app.run(debug=True)