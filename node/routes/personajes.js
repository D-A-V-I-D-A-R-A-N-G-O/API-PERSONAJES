const express = require('express');
const req = require('express/lib/request');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const filePath = path.join(__dirname, '../data/personajes.json');


// Método para leer los usuarios del archivo personajes.json
const getpersonajes = () => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

// Método para guardar usuarios en el personajes.json
const savepersonajes = (personajes) => {
    fs.writeFileSync(filePath, JSON.stringify(personajes, null, 2));
};

 // Ruta para consultar los usuarios
 router.get('/', (req, res) => {
     const personajes = getpersonajes();
     res.json(personajes);
});

// Obtener usuario por su id
router.get('/:id', (req, res) => {
    const personajes = getpersonajes();
    const personaje = personajes.find(u => u.id === parseInt(req.params.id));
    if (personaje) {
        res.json(personaje);
    } else {
        res.status(404).json({ message: "Ese usuario no existe parcero, pailas" });
    }
});

// Crear nuevos usuarios
router.post('/', (req, res) => {
    const personajes = getpersonajes();
    const newpersonaje = {
        id: personajes.length ? personajes[personajes.length - 1].id + 1 : 1,
        nombre: req.body.nombre,
        apodo: req.body.apodo,
        descripcion: req.body.descripcion,
        imgUrl: req.body.imgUrl,
        edad: req.body.edad
    };
    personajes.push(newpersonaje);
    savepersonajes(personajes);
    res.status(201).json(newpersonaje);
});

//Actualizando o editando usuarios
router.put('/:id', (req, res)=>{
    const personajes = getpersonajes()
    const personajeIndex = personajes.findIndex(u => u.id === parseInt(req.params.id))

    if (personajeIndex !== -1) {
        personajes[personajeIndex]={
            ...personajes[personajeIndex],
        nombre: req.body.nombre || personajes[personajeIndex].nombre,
        apodo: req.body.apodo || personajes[personajeIndex].apodo,
        descripcion: req.body.descripcion || personajes[personajeIndex].descripcion,
        imgUrl: req.body.imgUrl || personajes[personajeIndex].imgUrl,
        edad: req.body.edad || personajes[personajeIndex].edad
        }
        savepersonajes(personajes)
        res.json(personajes[personajeIndex])
    } else {
        res.status(404).json({message: "Huy, manito esa personaje no existe pa"})
    }
})

//Eliminar o borrar un usuario por id
router.delete('/:id', (req, res)=>{
    const personajes = getpersonajes()
    const newpersonajes = personajes.filter(u => u.id !== parseInt(req.params.id))

    if (newpersonajes.length !== personajes.length) {
        savepersonajes(newpersonajes)
        res.json({message: "personaje eliminada satisfactoriamente "})
    } else {
        res.status(404).json({message: "Imposible eliminarlo manito ese personaje no existe pa"})
    }

})

// Exportamos el módulo
module.exports = router;