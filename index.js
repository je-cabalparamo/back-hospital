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

app.post('/masterlogin', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    res.json({ 'alert': 'Faltan datos' });
    return;
  }
  
  const medicoCollection = collection(db, 'Medico');
  const enfermeroCollection = collection(db, 'Enfermeros');

  const medicoPromise = getDoc(doc(medicoCollection, email));
  const enfermeroPromise = getDoc(doc(enfermeroCollection, email));
  
  Promise.all([medicoPromise, enfermeroPromise])
    .then(([medicoSnapshot, enfermeroSnapshot]) => {
      if (!medicoSnapshot.exists() && !enfermeroSnapshot.exists()) {
        res.json({ 'alert': 'Correo no registrado' });
      } else {
        const medicoData = medicoSnapshot.exists() ? medicoSnapshot.data() : null;
        const enfermeroData = enfermeroSnapshot.exists() ? enfermeroSnapshot.data() : null;

        const comparePassword = (data) => {
          bcrypt.compare(password, data.password, (error, result) => {
            if (result) {
              res.json({ 
                'alert': `Success ... Bienvenido ${data.nombre}`,
                'fromTable': data.hasOwnProperty('apellido') ? 'Medico' : 'Enfermeros',
                'data': data
              });
            } else {
              res.json({ 'alert': 'Contraseña incorrecta' });
            }
          });
        };

        if (medicoData) {
          comparePassword(medicoData);
        } else {
          comparePassword(enfermeroData);
        }
      }
    })
    .catch((error) => {
      res.json({ 'alert': error });
    });
});

//--------------------------Inicio de seccion rutas enfermeros------------------------
/*app.get('/busqueda',async (req, res) => {
    const {clave, campo} = req.body

    const alumnos = collection(db, "Enfermeros")//Obtenciaon de datos 
    const arrgl = await alumnos.where(`${campo}`, '==', `${clave}`).get()
    let rtnData =  [] //Lo que se le mostrara al usuario

    arrgl.forEach(alumno => {
        rtnData.push(alumno.data())
    })

    res.json({
        'alert' : 'Success...',
        'data' : rtnData
    })
})*/

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
                          'alert' : 'Success ... Bienvenido',
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
  console.log(`Escuchando puerto: ${PORT}`);
});