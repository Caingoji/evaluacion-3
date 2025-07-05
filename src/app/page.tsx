'use client'
import { useEffect, useState } from "react";
import {voluntario } from "./interfaces/Ivoluntario";

const initialStateVoluntario:voluntario={
  nombre:"",
  apellido:"",
  proyecto:"",
  resumen:"",
  fecha:""
}

export default function Home()
{
  const miStorage = window.localStorage
  const [voluntario, setvoluntario] = useState(initialStateVoluntario)
  const [voluntarios, setvoluntarios] = useState<voluntario[]>([])
  const [nombre, setnombre] = useState("")
  const [apellido, setapellido] = useState("")
  const [proyecto, setproyecto] = useState("")
  const [resumen, setresumen] = useState("")

  useEffect(()=>{
    let listadoStr= miStorage.getItem("voluntario")
    if(listadoStr !=null){
      let listado = JSON.parse(listadoStr)
      setvoluntario(listado)
    }
  })

  const handleRegistrar=()=>{
    miStorage.setItem("voluntarios",JSON.stringify([...voluntarios,voluntario]))
  }

  const handleVoluntario = (name:string,value:string)=> {

  setvoluntario({ ...voluntario, [name]: value });
  if (name === "nombre") {
    setnombre(value.length < 3 ? "El nombre debe tener mínimo 3 caracteres" : "");} 
  if (name === "apellido") {
    setapellido(value.length < 4 ? "el apellido debe tener minimo 4 caracteres" : "");} 
  if (name === "proyecto") {
    setproyecto(value.length < 3 ? "el proyecto debe tener un nombre que pase los 3 caracteres" : "");}
  if (name=="resumen"){
    setresumen(value.length < 20 ? "el resumen de su proyecto debe pasar los 20 caracteres":"")}
}
  const handleActualizar = ()=>{
    alert("")
  }

  return(
    <>
    <form>
      <h1>{voluntario.nombre}{voluntario.apellido}{voluntario.proyecto}</h1>
      <label>Nombre</label><br />
      <input 
      name="nombre" 
      type="text"
      placeholder="Nombre" 
      onChange={(e)=>{handleVoluntario(e.currentTarget.name,e.currentTarget.value)}}/><br />
      <span>{nombre}</span><br />

      <label>Apellido</label><br />
      <input 
      name="apellido"
      type="text"
      placeholder="apellido"
      onChange={(e)=>{handleVoluntario(e.currentTarget.name,e.currentTarget.value)}}/><br />
      <span>{apellido} </span> <br />

      <label>Proyecto</label><br />
      <input
      name="proyecto"
      type="text"
      placeholder="Nombre de su proyecto"
      onChange={(e)=>{handleVoluntario(e.currentTarget.name,e.currentTarget.value)}}/><br />
      <span>{proyecto} </span> <br />
      
      <label>Resumen</label><br />
      <input 
      name="resumen"
      type="text"
      placeholder="resuma su proyecto" 
      onChange={(e)=>{handleVoluntario(e.currentTarget.name,e.currentTarget.value)}}/><br />
      <span>{resumen}</span>
      <button
      onClick={()=>{handleRegistrar()}}>Registrar</button>
    </form>
    <form>
      <h1>{voluntario.proyecto}{voluntario.nombre}</h1>
    </form>
    </>
  )

 }

