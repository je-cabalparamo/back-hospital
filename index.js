const express = require('express')
const bcrypt = require('bcrypt')
const cors = require('cors')
const { getFirestore, collection, getDoc, setDoc, getDocs, doc, updateDoc, deleteDoc } = require('firebase/firestore')
const { initializeApp } = require('firebase/app')
require('dotenv/config')

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCNds7p_VvR3Vo2IDLgIcYm52p_nPqo4bA",
  authDomain: "registrationhospital.firebaseapp.com",
  projectId: "registrationhospital",
  storageBucket: "registrationhospital.appspot.com",
  messagingSenderId: "211342989939",
  appId: "1:211342989939:web:ff35ad94a96a77c9dd2806"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig)
const db = getFirestore()

//Iniciamos Sevidor
const app = express()

//Opciones de CORS
const corsOptions = {
    "origin": "*",
    "optionSuccessStatus": 200
}

//Configuracion de Servidor
app.use(express.json())
app.use(cors(corsOptions))

const PORT = process.env.PORT || 15000

app.listen(PORT, () => {
    console.log(`Escuchando puerto: ${PORT}`) 
})