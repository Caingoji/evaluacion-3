'use client'
import { useEffect, useState } from "react";
import {voluntario } from "./interfaces/Ivoluntario";

const initialStateVoluntario:voluntario={
  nombre:"",
  apellido:"",
  proyecto:"",
}

export default function Home()
{
  const miStorage = window.localStorage
  const [voluntario, setvoluntario] = useState(initialStateVoluntario)
  const [voluntarios, setvoluntarios] = useState<voluntario[]>([])
  const [nombre, setnombre] = useState("")
  const [apellido, setapellido] = useState("")
  const [proyecto, setproyecto] = useState("")

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
      name="Apellido"
      type="text"
      placeholder="apellido"
      onChange={(e)=>{handleVoluntario(e.currentTarget.name,e.currentTarget.value)}}/><br />
      <span>{apellido} </span> <br />

      <label>Proyecto</label><br />
      <input
      name="nombre del proyecto"
      type="text"
      placeholder="Nombre de su proyecto"
      onChange={(e)=>{handleVoluntario(e.currentTarget.name,e.currentTarget.value)}}/><br />
      <span>{proyecto} </span> <br />
      <button
      onClick={()=>{handleRegistrar()}}>Registrar</button>
    </form>
    </>
  )

 }