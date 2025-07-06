'use client'
import { useEffect, useState } from "react";
import { voluntario } from "./interfaces/Ivoluntario";

export default function MenuEventos() {
  const [voluntarios, setVoluntarios] = useState<voluntario[]>([]);

  useEffect(() => {
    const listaStr = localStorage.getItem("voluntarios");
    if (listaStr) {
      setVoluntarios(JSON.parse(listaStr));
    }
  }, []);

  const eventosUnicos = Array.from(new Set(voluntarios.map(v => v.evento)));

  return (
    <div>
      <h1>Proyectos por Evento</h1>
      {eventosUnicos.map((evento, i) => (
        <div key={i} style={{ marginBottom: "1rem" }}>
        <h2>{evento}</h2>
        <ul>
        {voluntarios
            .filter(v => v.evento === evento)
            .map((v, j) => (
            <li key={j}>
            <strong>{v.proyecto}</strong> - {v.nombre} {v.apellido} ({v.fecha}) - {v.integrantes} integrante(s)
        </li>))}
        </ul>
        </div>
      ))}
    </div>
  );
}

