import os
import streamlit as st
from langchain_groq import ChatGroq
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain_community.vectorstores import FAISS  # Vectorstore Db
from langchain_community.document_loaders import PyPDFLoader
from langchain_google_genai import GoogleGenerativeAIEmbeddings  # Vector embedding
from dotenv import load_dotenv
import tempfile

load_dotenv()

# Load the GROQ and the Google API key from the .env file
groq_api_key = os.getenv("NEXT_APP_GROQ_API_KEY")
os.environ['GOOGLE_API_KEY'] = os.getenv("GOOGLE_API_KEY")

st.title("ParSell - Import/Export Compliance Checker")

# Initialize LLM
llm = ChatGroq(groq_api_key=groq_api_key, model_name="Gemma-7b-it")

# ChatPrompt Template
prompt_template = """
You are a knowledgeable and helpful import-export assistant. Assist the user by providing accurate responses and guidance based on their uploaded invoice and pre-loaded import-export documentation.

### Backend Regulations:
Use the pre-loaded documentation in the backend to check if the user's invoice meets the regulations.

### User Invoice:
{input}

### Context:
{context}

If any discrepancies or missing information are found in the user's invoice, highlight them and suggest ways to correct the issues. If no uploaded invoice is provided, guide the user using the backend documentation.
"""
prompt = ChatPromptTemplate.from_template(prompt_template)

# Vector embedding function
@st.cache_resource(show_spinner=False)
def vector_embedding(file_path, backend=False):
    """Embeds documents from the file and stores them in a FAISS vector store."""
    if backend:
        st.write("Loading backend import/export documentation...")
    else:
        st.write("Loading uploaded user invoice...")

    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

    try:
        # Load the PDF file
        loader = PyPDFLoader(file_path)
        documents = loader.load()

        # Split the documents into chunks
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=0)
        final_documents = text_splitter.split_documents(documents)

        # Create and store embeddings
        vector_store = FAISS.from_documents(final_documents, embeddings)
        st.write(f"Processed and embedded {len(final_documents)} document chunks.")
        return vector_store

    except Exception as e:
        st.error(f"Error processing file: {str(e)}")
        return None

# Provide the manual file path for the backend documentation
backend_file_path = r"2023 NTE Report new.pdf"  # <-- Update with the actual path to the backend PDF

# Embed backend documentation
if backend_file_path:
    st.session_state.backend_vectors = vector_embedding(backend_file_path, backend=True)
    st.write(f"Backend documentation loaded from: {backend_file_path}")

# File uploader for user invoices
uploaded_invoice = st.file_uploader("Upload your invoice (PDF format):")

if uploaded_invoice:
    with tempfile.NamedTemporaryFile(delete=False) as tmp_file:
        tmp_file.write(uploaded_invoice.getbuffer())
        temp_file_path = tmp_file.name
        st.session_state.uploaded_invoice_path = temp_file_path
        st.write(f"Invoice uploaded successfully: {temp_file_path}")

# Compliance Check
if st.button("Check Compliance"):
    if "backend_vectors" not in st.session_state:
        st.error("Backend documentation is not loaded.")
    elif "uploaded_invoice_path" not in st.session_state:
        st.error("Please upload an invoice to proceed.")
    else:
        # Embed the uploaded invoice
        user_vectors = vector_embedding(st.session_state.uploaded_invoice_path)

        if not user_vectors:
            st.error("Failed to process the uploaded invoice.")
        else:
            # Create chains for compliance checking
            try:
                backend_retriever = st.session_state.backend_vectors.as_retriever()
                document_chain = create_stuff_documents_chain(llm, prompt)
                retrieval_chain = create_retrieval_chain(backend_retriever, document_chain)

                # Perform compliance check
                with st.spinner("Checking compliance..."):
                    response = retrieval_chain.invoke({
                        'input': "Check this invoice for compliance.",
                        'context': user_vectors  # Provide user_vectors as context
                    })

                    # Display results
                    st.success("Compliance check completed!")
                    st.write(response['answer'])

                    with st.expander("Relevant Sections in Backend Documentation"):
                        for i, doc in enumerate(response["context"]):
                            st.write(doc.page_content)
                            st.write("-----------------------------------")

            except ValueError as e:
                st.error(f"Error in creating document chain: {str(e)}")