import { useState, useEffect } from "react";
import { voluntario } from "./interfaces/Ivoluntario";

interface props{
    traerProyecto: (v: voluntario)=>void;
}

export const MostrarProyectos = (props:props) =>  {
    const miStorage = window.localStorage
    const [voluntario, setvoluntario] = useState<voluntario[]>([])
    useEffect(()=>{
        let listadoStr = miStorage.getItem("voluntarios")
        if (listadoStr != null){
            let listado =JSON.parse(listadoStr)
            setvoluntario(listado)
        }
    },[])
    const Editar = (index:number) => {
        props.traerProyecto(voluntario[index])
    }
    
    return(
        <>
        <h1>Proyectos</h1>
        <table>
            <thead>
                <tr>
                    <th>proyecto</th>
                    <th>Nombre</th>
                </tr>
            </thead>
            <tbody>
                {voluntario.map((v,index)=>{
                    return(
                        <tr>
                            <td>{v.proyecto}</td>
                            <td>{v.nombre}</td>
                            <td>
                                <button onClick={()=>Editar(index)}>Editar</button><button>eliminar</button>
                            </td>
                        </tr>
                    )
                }
            )}
            </tbody>
        </table>
        </>
    )
}
export default MostrarProyectos