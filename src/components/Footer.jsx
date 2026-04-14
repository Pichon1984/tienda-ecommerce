export default function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="row align-items-center">
          {/* Logo */}
          <div className="col-12 col-md-4 text-center text-md-start mb-3 mb-md-0">
            <img src="/logo.png" alt="Logo" style={{ height: "50px" }} />
          </div>

          {/* Redes sociales */}
          <div className="col-12 col-md-4 text-center mb-3 mb-md-0">
            <div className="d-flex flex-column gap-2 align-items-center">

              <a
                href="https://instagram.com/tuUsuarioInstagram"
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex align-items-center gap-2 text-decoration-none social-link"
              >
                <i className="fab fa-instagram" style={{ color: "#E1306C", fontSize: "22px" }}></i>
                <span>@tuUsuarioInstagram</span>
              </a>

              <a
                href="mailto:tucorreo@ejemplo.com"
                className="d-flex align-items-center gap-2 text-decoration-none social-link"
              >
                <i className="fas fa-envelope" style={{ color: "#EA4335", fontSize: "22px" }}></i>
                <span>tucorreo@ejemplo.com</span>
              </a>

              <a
                href="https://wa.me/5493811234567"
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex align-items-center gap-2 text-decoration-none social-link"
              >
                <i className="fab fa-whatsapp" style={{ color: "#25D366", fontSize: "22px" }}></i>
                <span>+54 9 381 1234567</span>
              </a>

              <a
                href="https://facebook.com/tuPaginaFacebook"
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex align-items-center gap-2 text-decoration-none social-link"
              >
                <i className="fab fa-facebook" style={{ color: "#1877F2", fontSize: "22px" }}></i>
                <span>/tuPaginaFacebook</span>
              </a>
            </div>
          </div>

          {/* Derechos reservados */}
          <div className="col-12 col-md-4 text-center text-md-end">
            <p className="small mb-0">© {new Date().getFullYear()} Mi Tienda</p>
          </div>
        </div>
      </div>
    </footer>
  );
}