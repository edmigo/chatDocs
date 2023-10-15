import streamlit as st
import os
import codecs
import docx2txt, pdf2txt
import join
import binascii
from io import StringIO
import EmbeddDocs as ed

# # define the flask endpoint
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DocumentsPathToLoad = 'SimpleLoadFile_01//DocumentsToLoad//'
DocumentPath = 'SimpleLoadFile_01//DocumentsTxt//'

Questions = "explane about monitoring ?"


def binary_to_string(bits):
    return ''.join([chr(int(i, 2)) for i in bits])


# Streamlit app code
def process_file(file):
    if '.docx' in file:
        filename = file.split('.docx')
        f = open(DocumentPath + filename[0] + '.txt', 'w')
        f.write(docx2txt.process(DocumentsPathToLoad + file))
        print('Document: ' + file + ' is loaded')
        f.close()
    elif '.pdf' in file:
        filename = file.split('.pdf')
        f = codecs.open(DocumentPath + filename[0] + '.txt', 'w', encoding='utf-8')
        result = pdf2txt.PdfDocument(DocumentsPathToLoad + file)
        for row in result.paragraphs:
            f.write(row)
        f.close()
        print('Document: ' + file + ' is loaded')

    ed.LoadDocument(file)
    print('Document is loaded, now you can ask questions...')
    Questions = "explane about monitoring ?"
    # print('\nWe are go to ask the following question: \n\n' + Questions + '\n' )
    # ed.EmbeddedDocument(Questions)

    Questions = "explane about GIAI ?"
    # print('\nWe are go to ask the following question: \n\n' + Questions + '\n' )
    # ed.EmbeddedDocument(Questions)

    # Return the processed results as a JSON response
    return 'TRUE'


# Streamlit route for file upload
@st.cache_resource
@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        print(request)
        return "No document part", 400
    file = request.files["file"]
    if file is not None:
        print('Get new document: ' + file.filename)
        file.save(DocumentsPathToLoad + file.filename)
        results = process_file(file.filename)
        return results
    else:
        raise ValueError("No file uploaded.")


@st.cache_resource
@app.route("/question", methods=["POST"])
def AskQuestion():
    question = request.form['text']
    if question is not None:
        print('Get new question: ' + question)
        result = ed.EmbeddedDocument(question)

    return result


# # run the flask app on port 8888
app.run(host='0.0.0.0', port=8888)

