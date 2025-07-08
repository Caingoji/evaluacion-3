'use client'
import { useEffect, useState } from "react";
import { voluntario } from "./interfaces/Ivoluntario";
import MostrarProyectos from "./MostrarProyectos";
import MenuEventos from "./menuEventos";

const initialStateVoluntario: voluntario = {
  nombre: "",
  apellido: "",
  proyecto: "",
  resumen: "",
  fecha: "",
  evento: "",
  integrantes: 0
};

export default function Home() {
  const miStorage = window.localStorage;
  const [voluntario, setvoluntario] = useState(initialStateVoluntario);
  const [voluntarios, setvoluntarios] = useState<voluntario[]>([]);
  const [nombre, setnombre] = useState("");
  const [apellido, setapellido] = useState("");
  const [proyecto, setproyecto] = useState("");
  const [resumen, setresumen] = useState("");
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<voluntario | null>(null);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    let listadoStr = miStorage.getItem("voluntarios");
    if (listadoStr != null) {
      let listado = JSON.parse(listadoStr);
      setvoluntarios(listado);
    }
  }, []);

  const handleRegistrar = () => {
    miStorage.setItem("voluntarios", JSON.stringify([...voluntarios, voluntario]));
    setvoluntarios([...voluntarios, voluntario]);
    setvoluntario(initialStateVoluntario);
  };

  const handleVoluntario = (name: string, value: string) => {
    if (name === "integrantes") {
      setvoluntario({ ...voluntario, [name]: parseInt(value) });
    } else {
      setvoluntario({ ...voluntario, [name]: value });
    }

    if (name === "nombre") setnombre(value.length < 3 ? "El nombre debe tener mínimo 3 caracteres" : "");
    if (name === "apellido") setapellido(value.length < 4 ? "el apellido debe tener minimo 4 caracteres" : "");
    if (name === "proyecto") setproyecto(value.length < 3 ? "el proyecto debe tener un nombre que pase los 3 caracteres" : "");
    if (name === "resumen") setresumen(value.length < 20 ? "el resumen de su proyecto debe pasar los 20 caracteres" : "");
  };

  const traerProyecto = (v: voluntario) => {
    setProyectoSeleccionado(v);
    setvoluntario(v);
  };

  const handleActualizar = () => setEditando(true);

  const handleEliminar = () => {
    if (!proyectoSeleccionado) return;
    const nuevosVoluntarios = voluntarios.filter(v => v.proyecto !== proyectoSeleccionado.proyecto);
    miStorage.setItem("voluntarios", JSON.stringify(nuevosVoluntarios));
    setvoluntarios(nuevosVoluntarios);
    setProyectoSeleccionado(null);
    setvoluntario(initialStateVoluntario);
  };

  const guardarCambios = () => {
    if (!proyectoSeleccionado) return;
    const nuevosVoluntarios = voluntarios.map(v => v.proyecto === proyectoSeleccionado.proyecto ? voluntario : v);
    miStorage.setItem("voluntarios", JSON.stringify(nuevosVoluntarios));
    setvoluntarios(nuevosVoluntarios);
    setEditando(false);
  };

  return (
    <>
      <form className="formulario">
        <h1>{voluntario.nombre} {voluntario.apellido} {voluntario.proyecto}</h1>

        <label>Nombre</label><br />
        <input name="nombre" type="text" placeholder="Nombre" onChange={(e) => handleVoluntario(e.currentTarget.name, e.currentTarget.value)} /><br />
        <span>{nombre}</span><br />

        <label>Apellido</label><br />
        <input name="apellido" type="text" placeholder="Apellido" onChange={(e) => handleVoluntario(e.currentTarget.name, e.currentTarget.value)} /><br />
        <span>{apellido}</span><br />

        <label>Proyecto</label><br />
        <input name="proyecto" type="text" placeholder="Nombre del proyecto" onChange={(e) => handleVoluntario(e.currentTarget.name, e.currentTarget.value)} /><br />
        <span>{proyecto}</span><br />

        <label>Resumen</label><br />
        <input name="resumen" type="text" placeholder="Resuma su proyecto" onChange={(e) => handleVoluntario(e.currentTarget.name, e.currentTarget.value)} /><br />
        <span>{resumen}</span><br />

        <label>Evento</label><br />
        <select name="evento" onChange={(e) => handleVoluntario(e.currentTarget.name, e.currentTarget.value)}>
          <option value="">Seleccione un evento</option>
          <option value="medicina">Medicina</option>
          <option value="veterinaria">Veterinaria</option>
          <option value="mecanica">Mecánica</option>
          <option value="educacion">Educación</option>
        </select><br />

        <label>Fecha</label><br />
        <input name="fecha" type="date" onChange={(e) => handleVoluntario(e.currentTarget.name, e.currentTarget.value)} /><br />

        <label>Cantidad de Integrantes</label><br />
        <input name="integrantes" type="number" onChange={(e) => handleVoluntario(e.currentTarget.name, e.currentTarget.value)} /><br /><br />

        <button onClick={handleRegistrar}>Registrar</button>
      </form>

      <form className="formulario">
        <h1>{voluntario.proyecto} {voluntario.nombre}</h1>
        <MostrarProyectos traerProyecto={traerProyecto} />

        {proyectoSeleccionado && !editando && (
          <div>
            <button onClick={handleActualizar}>Actualizar</button>
            <button onClick={handleEliminar}>Eliminar</button>
          </div>
        )}

        {editando && (
          <div>
            <h3>Editando Proyecto</h3>

            <label>Nombre del Proyecto</label><br />
            <input name="proyecto" value={voluntario.proyecto} onChange={(e) => handleVoluntario("proyecto", e.target.value)} /><br />

            <label>Nombre del Autor</label><br />
            <input name="nombre" value={voluntario.nombre} onChange={(e) => handleVoluntario("nombre", e.target.value)} /><br />

            <label>Evento</label><br />
            <input name="evento" value={voluntario.evento} onChange={(e) => handleVoluntario("evento", e.target.value)} /><br />

            <label>Fecha</label><br />
            <input name="fecha" value={voluntario.fecha} type="date" onChange={(e) => handleVoluntario("fecha", e.target.value)} /><br />

            <label>Integrantes</label><br />
            <input name="integrantes" value={voluntario.integrantes} type="number" onChange={(e) => handleVoluntario("integrantes", e.target.value)} /><br /><br />

            <button onClick={guardarCambios}>Guardar</button>
            <button onClick={() => setEditando(false)}>Cancelar</button>
          </div>
        )}
      </form>

     <div className="menu-eventos">
      <h1>Proyectos por Evento</h1>
  
    </div>
    </>
  );
}
