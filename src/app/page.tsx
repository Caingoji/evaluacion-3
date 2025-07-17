'use client'
import { useEffect, useState } from "react";
import { voluntario } from "./interfaces/Ivoluntario";
import MostrarProyectos from "./MostrarProyectos";
import MenuEventos from "./menuEventos";
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase/FireBase";

const initialStateVoluntario: voluntario = {
  nombre: "",
  apellido: "",
  proyecto: "",
  resumen: "",
  fecha: "",
  evento: "",
  integrantes: 0,
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
    const cargarVoluntarios = async () => {
      try {
        const snapshot = await getDocs(collection(db, "voluntarios"));
        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as voluntario)
        }));
        setvoluntarios(lista);
        miStorage.setItem("voluntarios", JSON.stringify(lista));
      } catch (error) {
        console.error("Error al cargar voluntarios desde Firebase:", error);
      }
    };
    cargarVoluntarios();
  }, []);

  const handleRegistrar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "voluntarios"), voluntario);
      const nuevoVoluntario = { ...voluntario, id: docRef.id };
      alert("Voluntario registrado en Firebase correctamente.");
      const nuevaLista = [...voluntarios, nuevoVoluntario];
      setvoluntarios(nuevaLista);
      miStorage.setItem("voluntarios", JSON.stringify(nuevaLista));
      setvoluntario(initialStateVoluntario);
    } catch (error) {
      console.error("Error al registrar en Firebase:", error);
      alert("Hubo un error al registrar el voluntario.");
    }
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
    setvoluntario({ ...v });
  };

  const handleActualizar = () => setEditando(true);

  const handleEliminar = async () => {
    if (!proyectoSeleccionado?.id) {
      alert("No se puede eliminar: proyecto inválido.");
      return;
    }
    try {
      await deleteDoc(doc(db, "voluntarios", proyectoSeleccionado.id));
      alert("Proyecto eliminado correctamente.");
      const nuevaLista = voluntarios.filter(v => v.id !== proyectoSeleccionado.id);
      setvoluntarios(nuevaLista);
      miStorage.setItem("voluntarios", JSON.stringify(nuevaLista));
      setProyectoSeleccionado(null);
      setvoluntario(initialStateVoluntario);
    } catch (error) {
      console.error("Error al eliminar proyecto:", error);
      alert("Hubo un error al eliminar.");
    }
  };

  const guardarCambios = () => {
    if (!proyectoSeleccionado) return;
    const nuevosVoluntarios = voluntarios.map(v => v.id === proyectoSeleccionado.id ? voluntario : v);
    miStorage.setItem("voluntarios", JSON.stringify(nuevosVoluntarios));
    setvoluntarios(nuevosVoluntarios);
    setEditando(false);
  };

  return (
  <>
    <form onSubmit={handleRegistrar} className="formulario">
    <h1>{voluntario.nombre} {voluntario.apellido} {voluntario.proyecto}</h1>
    <label>Nombre</label><br />
      <input 
      name="nombre" 
      type="text" 
      placeholder="Nombre" 
      onChange={(e) => handleVoluntario(e.currentTarget.name, e.currentTarget.value)} /><br />
      <span>{nombre}</span><br />

    <label>Apellido</label><br />
      <input 
      name="apellido" 
      type="text" 
      placeholder="Apellido" 
      onChange={(e) => handleVoluntario(e.currentTarget.name, e.currentTarget.value)} /><br />
      <span>{apellido}</span><br />
    
    <label>Proyecto</label><br />
      <input 
      name="proyecto" 
      type="text" 
      placeholder="Nombre del proyecto" 
      onChange={(e) => handleVoluntario(e.currentTarget.name, e.currentTarget.value)} /><br />
      <span>{proyecto}</span><br />

    <label>Resumen</label><br />
      <input 
      name="resumen" 
      type="text" 
      placeholder="Resuma su proyecto" 
      onChange={(e) => handleVoluntario(e.currentTarget.name, e.currentTarget.value)} /><br />
      <span>{resumen}</span><br />
        
    <label>Evento</label><br />
      <select 
        name="evento" 
        onChange={(e) => handleVoluntario(e.currentTarget.name, e.currentTarget.value)}>
      <option value="">Seleccione un evento</option>
      <option value="medicina">Medicina</option>
      <option value="veterinaria">Veterinaria</option>
      <option value="mecanica">Mecánica</option>
      <option value="educacion">Educación</option>
      </select><br />
      
      <label>Fecha</label><br />
        <input 
        name="fecha" 
        type="date" 
        onChange={(e) => handleVoluntario(e.currentTarget.name, e.currentTarget.value)} /><br />
      
      <label>Cantidad de Integrantes</label><br />
        <input 
        name="integrantes" 
        type="number" 
        onChange={(e) => handleVoluntario(e.currentTarget.name, e.currentTarget.value)} /><br /><br />
        <button type="submit">Registrar</button>
      </form>

      <form className="formulario">
        <h1>{voluntario.proyecto} {voluntario.nombre}</h1>
        <MostrarProyectos traerProyecto={traerProyecto} />

      {proyectoSeleccionado && !editando && (
        <div>
        <h2>Gestión de Proyecto Seleccionado</h2>
        <button type="button" onClick={handleActualizar}>Actualizar</button>
        <button type="button" onClick={handleEliminar}>Eliminar</button>
        </div>
        )}

       {editando && (
        <div>
        <h3>Editando Proyecto</h3>
        <label>Nombre del Proyecto</label><br />
          <input 
          name="proyecto" 
          value={voluntario.proyecto} 
          onChange={(e) => handleVoluntario("proyecto", e.target.value)} /><br />
        <label>Nombre del Autor</label><br />
          <input 
          name="nombre" 
          value={voluntario.nombre} 
          onChange={(e) => handleVoluntario("nombre", e.target.value)} /><br />
        <label>Evento</label><br />
          <input 
          name="evento" 
          value={voluntario.evento} 
          onChange={(e) => handleVoluntario("evento", e.target.value)} /><br />
        <label>Fecha</label><br />
          <input 
          name="fecha" 
          value={voluntario.fecha} 
          type="date" 
          onChange={(e) => handleVoluntario("fecha", e.target.value)} /><br />
        <label>Integrantes</label><br />
          
          <input
          name="integrantes" 
          value={voluntario.integrantes} 
          type="number" 
          onChange={(e) => handleVoluntario("integrantes", e.target.value)} /><br /><br />
        <button type="button" onClick={guardarCambios}>Guardar</button>
        <button type="button" onClick={() => setEditando(false)}>Cancelar</button>
        </div>
        )}
      </form>

    <div className="menu-eventos">
      <MenuEventos />
      </div>
    </>
  );
}
