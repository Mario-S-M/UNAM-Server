import { Facebook, Twitter, Instagram } from "lucide-react";
import GlobalLogoUNAM from "./globalLogoUNAM";

export default function Footer() {
  return (
    <footer className="text-primary-foreground py-8 px-6 bg-primary">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="flex-1">
          <GlobalLogoUNAM />

          <p className="text-primary-foreground/80 text-sm mb-3">
            Nuestra Gran Universidad Nacional Autónoma de México es una
            institución pública dedicada a la educación, investigación y
            difusión de la cultura.
          </p>
          <div className="text-xs text-primary-foreground/70 space-y-2">
            <p>© 2025 Universidad Nacional Autónoma de México.</p>
            <p className="mt-2">Nuestra Gran Universidad </p>
            <p className="font-bold">
              Producto realizado con el apoyo del programa PAPIME PE405625
            </p>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-bold mb-3">Cursos y Acreeditaciones</h4>
          <div className="grid grid-cols-2 gap-x-4">
            <ul className="space-y-1 text-sm text-primary-foreground/80">
              {[
                "Ingles A1",
                "Ingles A2",
                "Ingles B1",
                "Ingles B2",
                "Ingles C1",
                "Ingles C2",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-primary-foreground">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-bold mb-3">Contacto</h4>

          <div className="text-sm text-primary-foreground/80 mb-4">
            <p>Salida a Pátzcuaro, Morelia,</p>
            <p>C.P. 58190, Michoacán, México</p>
            <p className="mt-2">Tel: +52 (443) 314-5678</p>
            <p>Email: contacto@morelia.mx</p>
          </div>

          <div className="flex space-x-2 mb-4">
            {[Facebook, Twitter, Instagram].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="bg-primary-700 bg-opacity-40 p-2 rounded-full hover:bg-primary-600"
              >
                <Icon size={16} className="text-primary-foreground" />
              </a>
            ))}
          </div>

          <button className="w-full bg-warning text-warning-foreground py-2 px-4 rounded font-medium text-sm hover:bg-warning/90 mb-4">
            Solicita información
          </button>

          <h4 className="font-bold mb-2">Términos y Condiciones</h4>
          <div className="flex flex-wrap gap-3 text-xs text-primary-foreground/70">
            <a href="#" className="hover:text-primary-foreground">
              Aviso de Privacidad
            </a>
            <span>•</span>
            <a href="#" className="hover:text-primary-foreground">
              Términos de Uso
            </a>
            <span>•</span>
            <a href="#" className="hover:text-primary-foreground">
              Reglamentos
            </a>
            <span>•</span>
            <a href="#" className="hover:text-primary-foreground">
              Mapa del Sitio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
