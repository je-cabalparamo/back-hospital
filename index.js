const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { getFirestore, collection, getDoc, setDoc, getDocs, doc, updateDoc, deleteDoc } = require('firebase/firestore');
const { initializeApp } = require("firebase/app");
require('dotenv/config');

const firebaseConfig = {
  apiKey: "AIzaSyCNds7p_VvR3Vo2IDLgIcYm52p_nPqo4bA",
  authDomain: "registrationhospital.firebaseapp.com",
  projectId: "registrationhospital",
  storageBucket: "registrationhospital.appspot.com",
  messagingSenderId: "211342989939",
  appId: "1:211342989939:web:ff35ad94a96a77c9dd2806"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore();

// Iniciamos Servidor
const app = express();

// Opciones de CORS
const corsOptions = {
  origin: "*",
  optionSuccessStatus: 200
};

// Configuracion de Servidor
app.use(express.json());
app.use(cors(corsOptions));

app.post('/insertar_Paciente', (req, res) => {
  const { pacienteid, nombre, apellidos, habitacion, telefonoEmergencia, fechaEntrada, fechaSalida, medicoEncargado } = req.body;

  if (!pacienteid, !nombre || !apellidos || !habitacion || !telefonoEmergencia || !fechaEntrada || !fechaSalida || !medicoEncargado) {
    res.json({
      'alert': 'Faltan datos'
    });
    return;
  }

  // Validaciones
  if (pacienteid.length < 8) {
    res.json({
      'alert': 'identificacion debe contener al menos 8 caracteres'
    });
  }
  else if (nombre.length < 2) {
    res.json({
      'alert': 'Nombre mínimo de 2 caracteres'
    });
  } else if (apellidos.length < 2) {
    res.json({
      'alert': 'Apellidos mínimo de 2 caracteres'
    });
  } else if (habitacion.length < 1) {
    res.json({
      'alert': 'Planta mínimo de 1 caracter'
    });
  } else if (fechaEntrada.length < 3) {
    res.json({
      'alert': 'Debe ingresar Fecha de Entrada'
    });
  } else if (fechaSalida.length < 3) {
    res.json({
      'alert': 'Debe ingresar Fecha de Salida'
    });
  } else if (!medicoEncargado.length) {
    res.json({
      'alert': 'Debe ingresar el Médico Encargado'
    });
  } else if (!Number(telefonoEmergencia) || telefonoEmergencia.length !== 10) {
    res.json({
      'alert': 'Introduce un número válido de teléfono de emergencia (10 dígitos)'
    });
  } else {
    const pacientes = collection(db, "Pacientes");
    getDoc(doc(pacientes, pacienteid)).then((paciente) => {
      if (paciente.exists()) {
        res.json({
          'alert': 'Paciente ya está registrado'
        });
      } else {
        const sndData = {
          pacienteid,
          nombre,
          apellidos,
          habitacion,
          medicoEncargado,
          telefonoEmergencia,
          fechaEntrada,
          fechaSalida
        };

        setDoc(doc(pacientes, pacienteid), sndData)
          .then(() => {
            res.json({
              'alert': 'Success...'
            });
          })
          .catch((e) => {
            res.json({
              'alert': e
            });
          });
      }
    });
  }
});

// Obtener de DB
app.get('/todo_Paciente', async (req, res) => {
  const pacientes = collection(db, "Pacientes"); // Obtención de datos
  const arrgl = await getDocs(pacientes);
  let rtnData = []; // Lo que se le mostrará al usuario
  arrgl.forEach((paciente) => {
    rtnData.push(paciente.data());
  });
  // Enviar todos los datos de la base de datos
  res.json({
    'alert': 'Success...',
    'data': rtnData
  });
});

// Eliminar
app.post('/eliminar_Paciente', (req, res) => {
  const { pacienteid } = req.body;
  deleteDoc(doc(db, 'Pacientes', pacienteid)).then((elim) => {
    if (!elim) {
      res.json({
        'alert': 'Paciente eliminado'
      });
    } else {
      res.json({
        'alert': 'No se pudo eliminar'
      });
    }
  });
});

// Actualizar
app.post('/actualizar_Paciente', (req, res) => {
  const { pacienteid, nombre, apellidos, habitacion, telefonoEmergencia, fechaEntrada, fechaSalida, medicoEncargado } = req.body;

  if (!pacienteid || !nombre || !apellidos || !habitacion || !telefonoEmergencia || !fechaEntrada || !fechaSalida || !medicoEncargado) {
    res.json({
      'alert': 'Faltan datos'
    });
    return;
  }

  // Validaciones
  if (pacienteid.length < 8) {
    res.json({
      'alert': 'Identificacion debe al menos tener 8 caracteres'
    });
  }
  else if (nombre.length < 2) {
    res.json({
      'alert': 'Nombre mínimo de 2 caracteres'
    });
  } else if (apellidos.length < 2) {
    res.json({
      'alert': 'Apellidos mínimo de 2 caracteres'
    });
  } else if (habitacion.length < 1) {
    res.json({
      'alert': 'Planta mínimo de 1 caracter'
    });
  } else if (fechaEntrada.length < 3) {
    res.json({
      'alert': 'Debe ingresar Fecha de Entrada'
    });
  } else if (fechaSalida.length < 3) {
    res.json({
      'alert': 'Debe ingresar Fecha de Salida'
    });
  } else if (!Number(telefonoEmergencia) || !(telefonoEmergencia.length === 10)) {
    res.json({
      'alert': 'Introduce un numero valido'
    });
  } else {
    const dataUpdate = {
      pacienteid,
      nombre,
      apellidos,
      habitacion,
      telefonoEmergencia,
      fechaEntrada,
      fechaSalida,
    };
    updateDoc(doc(db, "Pacientes", pacienteid), dataUpdate) // Base de datos a modificar, datos nuevos, "primary key"
      .then((response) => {
        res.json({
          'alert': `Registro modificado: ${pacienteid}`
        });
      })
      .catch((e) => {
        res.json({
          'alert': e
        });
      });
  }
});

app.post('/insertarMedico', (req,res) => {
  const { nombre, apellido, email, password, telefono, consultorio, especialidad, horarioEntrada, horarioSalida } = req.body
  if(!nombre || !apellido || !email || !password || !telefono || !consultorio || !especialidad || !horarioEntrada || !horarioSalida ) {
    res.json({
      'alert': 'Faltan datos'
    })
    return
  }
  const Medico = collection(db, "Medico")

  getDoc(doc(Medico, email)).then(Medico => {
    if(Medico.exists()) {
      res.json({
        'alert': 'El correo ya existe en la BD'
      })
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          sendData = {
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
          setDoc(doc(Medico, email), sendData).then(() => {
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
  .then((respose) => {
    res.json({
      'alert': 'Medico borrado'
    })
  })
})

app.post('/actualizarMedico', (req,res) => {
  const { nombre, email, apellido, telefono, consultorio, especialidad, horarioEntrada, horarioSalida } = req.body
  if(!nombre || !apellido || !email || !telefono || !consultorio || !especialidad || !horarioEntrada || !horarioSalida ) {
    res.json({
      'alert': 'Faltan datos'
    })
    return
  }
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
})

const PORT = process.env.PORT || 15000

app.listen(PORT, () => {
  console.log(`Escuchando puerto: ${PORT}`);
});