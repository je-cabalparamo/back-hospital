const express = require('express')
const bcrypt = require('bcrypt')
const cors = require('cors')
const { getFirestore, collection, getDoc, setDoc, getDocs, doc, updateDoc, deleteDoc } = require('firebase/firestore')
const { initializeApp } = require('firebase/app')
require('dotenv/config')

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

app.post('/insertarMedico', (req,res) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  const { nombre, apellido, email, password, telefono, consultorio, especialidad, horarioEntrada, horarioSalida } = req.body
  if(!nombre || !apellido || !email || !password || !telefono || !consultorio || !especialidad || !horarioEntrada || !horarioSalida ) {
    res.json({
      'alert': 'Faltan datos'
    })
    return
  }
  if (nombre.length < 3) {
    res.json({
      'alert': 'Nombre debe tener minimo 3 caracteres'
    });
  } else if (apellido.length < 2) {
    res.json({
      'alert': 'Apellidos mínimo de 2 caracteres'
    });
  } else if (!emailRegex.test(email)) {
    res.json({
      'alert': 'Ingrese un correo valido'
    });
  } else if (!passwordRegex.test(password)) {
    res.json({
      'alert': 'Debe ingresar una contraseña valida, Minimo 8 caracteres, Debe contener una mayuscula, Debe contener un digito, se permiten caracteres especiales'
    });
  } else if (consultorio.length < 3) {
    res.json({
      'alert': 'Debe ingresar el numero de Consultorio'
    });
  } else if (especialidad.length < 3) {
    res.json({
      'alert': 'Debe ingresar la especialidad del Medico'
    });
  } else if (horarioEntrada.length < 3) {
    res.json({
      'alert': 'Debe ingresar horario de entrada'
    });
  } else if (horarioSalida.length < 3) {
    res.json({
      'alert': 'Debe ingresar horario de salida'
    });
  } else if (!Number(telefono) || telefono.length !== 10) {
    res.json({
      'alert': 'Introduce un número de teléfono válido (10 dígitos)'
    });
  } else {
    const MedicoCollection = collection(db, "Medico")
    getDoc(doc(MedicoCollection, email)).then((MedicoDoc) => {
      if (MedicoDoc.exists()) {
        res.json({
          'alert': 'El correo ya existe en la BD'
        })
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            const sendData = {
              nombre,
              apellido,
              email,
              password: hash,
              telefono,
              consultorio, 
              especialidad, 
              horarioEntrada, 
              horarioSalida
            }
            setDoc(doc(MedicoCollection, email), sendData).then(() => {
              res.json({
                'alert': 'Success'
              })
            }).catch((error) => {
              res.json({
                'alert': error
              })
            })
          })
        })
      }
    })
  }
})

app.post('/loginMedico', (req,res) => {
  const { email, password } = req.body
  if( !email || !password ) {
    res.json({ 'alert': 'Faltan datos' })
  }
  const Medico = collection(db, 'Medico')
  getDoc(doc(Medico, email))
  .then((Medico) => {
    if(!Medico.exists()) {
      res.json({ 'alert': 'Correo no registrado' })
    } else {
      bcrypt.compare(password, Medico.data().password, (error, result) => {
        if( result ) {
          let data = Medico.data()
          res.json({ 
            'alert': 'Success', 
            nombre: data.nombre,
            apellido: data.apellido,
          })
        } else {
          res.json({ 'alert': 'Contraseña Incorrecta' })
        }
      })
    }
  })
  .catch((error) => {
    res.json({ 'alert': error })
  })
})

app.get('/traerMedicos', async (req,res) => {
  const Medico = collection(db, "Medico")
  const arreglo = await getDocs(Medico)
  let returnData = []
  arreglo.forEach(Medico => {
    returnData.push(Medico.data())
  })
  res.json({
    'alert': 'Success',
    'data': returnData
  })
})

app.post('/eliminarMedico', (req,res) => {
  const { email } =  req.body
  let MedicoBorrado = doc(db, "Medico", email)
  deleteDoc(MedicoBorrado)
  .then((response) => {
    res.json({
      'alert': 'Medico borrado'
    })
  })
})

app.post('/actualizarMedico', (req,res) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const { nombre, email, apellido, telefono, consultorio, especialidad, horarioEntrada, horarioSalida } = req.body
  if(!nombre || !apellido || !email || !telefono || !consultorio || !especialidad || !horarioEntrada || !horarioSalida ) {
    res.json({
      'alert': 'Faltan datos'
    })
    return
  }
  if (nombre.length < 3) {
    res.json({
      'alert': 'Nombre debe tener minimo 3 caracteres'
    });
  } else if (apellido.length < 2) {
    res.json({
      'alert': 'Apellidos mínimo de 2 caracteres'
    });
  } else if (!emailRegex.test(email)) {
    res.json({
      'alert': 'Ingrese un correo valido'
    });
  } else if (consultorio.length < 3) {
    res.json({
      'alert': 'Debe ingresar el numero de Consultorio'
    });
  } else if (especialidad.length < 3) {
    res.json({
      'alert': 'Debe ingresar la especialidad del Medico'
    });
  } else if (horarioEntrada.length < 3) {
    res.json({
      'alert': 'Debe ingresar horario de entrada'
    });
  } else if (horarioSalida.length < 3) {
    res.json({
      'alert': 'Debe ingresar horario de salida'
    });
  } else if (!Number(telefono) || telefono.length !== 10) {
    res.json({
      'alert': 'Introduce un número de teléfono válido (10 dígitos)'
    });
  } else {
    const dataUpdate = {
      nombre,
      apellido,
      telefono, 
      consultorio, 
      especialidad, 
      horarioEntrada, 
      horarioSalida 
    }
    updateDoc(doc(db, "Medico", email), dataUpdate)
    .then((response) => {
      res.json({ 'alert': 'Success' })
    })
    .catch((error) => {
      res.json({ 'alert': error })
    })
  }
})

const PORT = process.env.PORT || 15000

app.listen(PORT, () => {
    console.log(`Escuchando puerto: ${PORT}`) 
})