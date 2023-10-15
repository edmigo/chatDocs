"""
This script creates a database of information gathered from local text files.
pip install langchain
pip install sentence-transformers
pip install faiss-cpu
pip install ctransformers
"""

from langchain.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS

from langchain.llms import CTransformers
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain import PromptTemplate
from langchain.chains import RetrievalQA

import os
import codecs
import docx2txt, pdf2txt

DocumentsPathToLoad = 'SimpleLoadFile_01//DocumentsToLoad//'
DocumentPath = 'SimpleLoadFile_01//DocumentsTxt//'
ModelsPath = 'SimpleLoadFile_01//Models//'

Llama2 = 'llama-2-7b-chat.ggmlv3.q4_0.bin'

#Questions = "explane about monitoring ?"

def LoadDocument(filename):
    # define what documents to load
    # loader = DirectoryLoader("./", glob="*.txt", loader_cls=TextLoader)
    loader = DirectoryLoader(DocumentPath, glob="*.txt", loader_cls=TextLoader)

    # interpret information in the documents
    documents = loader.load()
    splitter = RecursiveCharacterTextSplitter(chunk_size=500,
                                              chunk_overlap=50)
    texts = splitter.split_documents(documents)
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={'device': 'cpu'})

    # create and save the local database
    db = FAISS.from_documents(texts, embeddings)
    db.save_local("faiss")


def EmbeddedDocument(Questions):
    global ModelsPath, Llama2

    """
    This script reads the database of information from local text files
    and uses a large language model to answer questions about their content.
    """

    # prepare the template we will use when prompting the AI
    template = """Use the following pieces of information to answer the user's question.
    If you don't know the answer, just say that you don't know, don't try to make up an answer.
    Context: {context}
    Question: {question}
    Only return the helpful answer below and nothing else.
    Helpful answer:
    """
    ModelPath = ModelsPath + Llama2

    # load the language model
    # llm = CTransformers(model='./llama-2-7b-chat.ggmlv3.q8_0.bin',
    #                     model_type='llama',
    #                     config={'max_new_tokens': 256, 'temperature': 0.01})
    llm = CTransformers(model=ModelPath,
                        model_type='llama',
                        config={'max_new_tokens': 256, 'temperature': 0.01})

    # load the interpreted information from the local database
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={'device': 'cpu'})
    db = FAISS.load_local("faiss", embeddings)

    # prepare a version of the llm pre-loaded with the local content
    retriever = db.as_retriever(search_kwargs={'k': 2})
    prompt = PromptTemplate(
        template=template,
        input_variables=['context', 'question'])
    qa_llm = RetrievalQA.from_chain_type(llm=llm,
                                         chain_type='stuff',
                                         retriever=retriever,
                                         return_source_documents=True,
                                         chain_type_kwargs={'prompt': prompt})

    # ask the AI chat about information in our local files
    # prompt = "Who is the author of FftSharp? What is their favorite color?"
    prompt = Questions
    output = qa_llm({'query': prompt})
    print(output["result"])

    return output["result"]