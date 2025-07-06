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
        <>
            <h1>Proyectos</h1>
            <select
                onChange={(e) => {
                    const index = parseInt(e.target.value);
                    if (!isNaN(index)) traerProyecto(voluntarios[index]);
                }}
            >
                <option value="">Selecciona un proyecto</option>
                {voluntarios.map((v, index) => (
                    <option key={index} value={index}>
                        {v.proyecto} ({v.nombre})
                    </option>
                ))}
            </select>
            <table>
                <thead>
                    <tr>
                        <th>Proyecto</th>
                        <th>Nombre</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {voluntarios.map((v, index) => (
                        <tr key={index}>
                            <td>{v.proyecto}</td>
                            <td>{v.nombre}</td>
                            <td>
                                <button onClick={() => traerProyecto(v)}>Editar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default MostrarProyectos