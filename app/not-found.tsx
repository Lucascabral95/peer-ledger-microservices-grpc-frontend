import Link from "next/link";

import "./not-found.scss";

export default function NotFound() {
  return (
    <main className="notFoundPage">
      <div className="notFoundShell">
        <div className="notFoundGlow" />

        <section className="notFoundCard">
          <span className="notFoundEyebrow">Error 404</span>

          <h1 className="notFoundTitle">Página no encontrada</h1>

          <p className="notFoundDescription">
            La ruta que intentaste abrir no existe o ya no está disponible
            dentro de la plataforma.
          </p>

          <div className="notFoundCode">404</div>

          <div className="notFoundActions">
            <Link href="/" className="primaryButton">
              Volver al inicio
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
