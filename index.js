const express = require('express')
const bcrypt = require('bcrypt')
const cors = require('cors')
const { getFirestore, collection, getDoc, setDoc, getDocs, doc, updateDoc, deleteDoc } = require('firebase/firestore')
const { initializeApp } = require('firebase/app')
require('dotenv/config')

//import { initializeApp } from "firebase/app";

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

//--------------------------Inicio de seccion rutas enfermeros------------------------
app.post('/insertar', (req, res) => {
  const {nombre, apellidos, planta, puesto, telefono, entrada, salida, email, password} = req.body

  if(!nombre || !apellidos || !planta || !puesto || !telefono || !entrada || !salida || !email || !password) {
      res.json({
          'alert': 'Faltan datos'
      })
      return
  }

  //Validaciones
  if(nombre.length < 2){
      res.json({
          'alert': 'Nombre minimo de 2 caracteres'
      })
  }
  else if(apellidos.length < 2){
      res.json({
          'alert': 'Apellidos minimo de 2 caracteres'
      })
  }
  else if(planta.length < 1){
    res.json({
      'alert': 'planta minimo de 2 caracteres'
    })
  }
  else if(puesto.length < 5)
  {
    res.json({
      'alert': 'Puesto minimo de 5 caracteres'
    })
  }
  else if(entrada.length < 3)
  {
    res.json({
      'alert': 'Entrada minimo de 5 caracteres'
    })
  }
  else if(salida.length < 3)
  {
    res.json({
      'alert': 'Salida minimo de 5 caracteres'
    })
  }
  else if(!email.length)
  {
      res.json({
          'alert': 'Debe de ingresar el email'
      })
  }
  else if(password.length < 8)
  {
      res.json({
          'alert': 'Constraseña debe de ser minimo 8 caracteres'
      })
  }
  else if(!Number(telefono) || !telefono.length === 10)
  {
      res.json({
          'alert': 'Introduce un numero valido'
      })
  }
  else
  {
      const alumnos = collection(db,"Enfermeros")
      getDoc(doc(alumnos,email)).then(alumno => {
          if(alumno.exists()){
              res.json({
                  'alert': 'Correo en uso'
              })
          }
          else
          {
              bcrypt.genSalt(10,(err,salt) => {
                  bcrypt.hash(password, salt, (err,hash) => {
                      sndData = {
                          nombre,
                          apellidos,
                          planta,
                          puesto,
                          telefono,
                          horarioEntrada: entrada,
                          horarioSalida: salida,
                          email,
                          password: hash,
                      }
                      //Guardarlo en la base de datos
                      setDoc(doc(alumnos,email),sndData).then(() => {
                          res.json({
                              'alert' : 'Success...'
                          })
                      }).catch((e) => {
                          res.json({
                              'alert' : e
                          })
                      })
                  })
              })
          }
      })
  }
})

//Obtener de DB
app.get('/todo',async (req, res) =>{
  const alumnos = collection(db, "Enfermeros")//Obtenciaon de datos 
  const arrgl = await getDocs(alumnos)
  let rtnData =  [] //Lo que se le mostrara al usuario
  arrgl.forEach(alumno => {
      rtnData.push(alumno.data())
  })
  //Enviar todos los datos de la base de datos
  res.json({
      'alert' : 'Success...',
      'data' : rtnData
  })
})

//Eliminar
app.post('/eliminar', (req, res) =>{
  const {email} = req.body
  deleteDoc(doc(db,'Enfermeros',email)).then((elim) => {
      if(!elim)
      {
          res.json({
              'alert' : 'Enfermero eliminado'
          })
      }
      else
      {
          res.json({
              'alert' : 'No se pudo eliminar'
          })
      }
  })
})

//Actualizar
app.post('/actualizar', (req, res) =>{
  const {nombre, apellidos, planta, puesto, telefono, entrada, salida, email} = req.body

  if(!nombre || !apellidos || !planta || !puesto || !telefono || !entrada || !salida || !email) {
      res.json({
          'alert': 'Faltan datos'
      })
      return
  }

  //Validaciones
  if(nombre.length < 2){
      res.json({
          'alert': 'Nombre minimo de 2 caracteres'
      })
  }
  else if(apellidos.length < 2){
      res.json({
          'alert': 'Apellidos minimo de 2 caracteres'
      })
  }
  else if(planta.length < 1){
    res.json({
      'alert': 'planta minimo de 2 caracteres'
    })
  }
  else if(puesto.length < 5)
  {
    res.json({
      'alert': 'Puesto minimo de 5 caracteres'
    })
  }
  else if(entrada.length < 3)
  {
    res.json({
      'alert': 'Entrada minimo de 5 caracteres'
    })
  }
  else if(salida.length < 3)
  {
    res.json({
      'alert': 'Salida minimo de 5 caracteres'
    })
  }
  else if(!email.length)
  {
      res.json({
          'alert': 'Debe de ingresar el email'
      })
  }
  else if(!Number(telefono) || !telefono.length === 10)
  {
      res.json({
          'alert': 'Introduce un numero valido'
      })
  }
  else
  {
      const dataUpdate = {
        nombre,
        apellidos,
        planta,
        puesto,
        telefono,
        horarioEntrada: entrada,
        horarioSalida: salida,
        email,
      }
      updateDoc(doc(db,"Enfermeros",email),dataUpdate)//Base de datos a modificar, datos nuevos, "primary key"
      .then((response) => {
          res.json({
              'alert' : `Registro modificado: ${email}`
          })
      })
      .catch((e) => {
          res.json({
              'alert' : e
          })
      })
  }
})

//Ingresar
app.post('/login', (req, res) => {
  const {email, password} = req.body
  if(!email || !password) 
  {
      res.json({
          'alert': "Faltan datos"
      })
  }
  else
  {
      const alumnos = collection(db, 'Enfermeros')
      getDoc(doc(alumnos,email))
      .then((alumno) => {
          if(!alumno.exists())
          {
              res.json({
                  'alert' : 'Correo no registrado'
              })
          }
          else
          {
              bcrypt.compare(password, alumno.data().password, (error, result) => {
                  if(result)
                  {
                      //Para regrrsar datos
                      let data = alumno.data()
                      
                      res.json({
                          'alert' : `Success ... Bienvenido ${data.nombre}`,
                          name : data.name,
                          lastname : data.lastname,
                          data
                      })
                      
                  }
                  else
                  {
                      res.json({
                          'alert' : 'Contraseña incorrecta'
                      })
                  }
              })
          }
      })
  }
})
//--------------------------Fin de seccion rutas enfermeros------------------------


const PORT = process.env.PORT || 15000

app.listen(PORT, () => {
    console.log(`Escuchando puerto: ${PORT}`) 
})