'use client'
import { useState, useEffect } from "react";
import { voluntario } from "./interfaces/Ivoluntario";

interface Props {
    traerProyecto: (v: voluntario) => void;
}

export const MostrarProyectos = ({ traerProyecto }: Props) => {
    const miStorage = window.localStorage;
    const [voluntarios, setVoluntarios] = useState<voluntario[]>([]);

    useEffect(() => {
        const listadoStr = miStorage.getItem("voluntarios");
        if (listadoStr) setVoluntarios(JSON.parse(listadoStr));
    }, []);

    return (
        <select onChange={(e) => {
        const index = parseInt(e.target.value);
        if (!isNaN(index)) traerProyecto(voluntarios[index]);
        }}>
        <option value="">Seleccione un proyecto</option>
        {voluntarios.map((v, index) => (
        <option key={index} value={index}>
        {v.proyecto} ({v.nombre})
        </option>
        ))}
    </select> 
        );};

export default MostrarProyectos