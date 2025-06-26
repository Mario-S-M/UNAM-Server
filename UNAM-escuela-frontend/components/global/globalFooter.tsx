import { Facebook, Twitter, Instagram } from "lucide-react";
import GlobalLogoUNAM from "./globalLogoUNAM";

export default function Footer() {
  return (
    <footer className="text-primary-foreground py-8 px-6 bg-primary">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="flex-1">
          <GlobalLogoUNAM variant="footer" />

          <p className="text-primary-foreground/80 text-sm mb-3">
            Nuestra Gran Universidad Nacional Autónoma de México es una
            institución pública dedicada a la educación, investigación y
            difusión de la cultura.
          </p>
          <div className="text-xs text-primary-foreground/70 space-y-2">
            <p className="text-primary-foreground/70">
              © 2025 Universidad Nacional Autónoma de México.
            </p>
            <p className="mt-2 text-primary-foreground/70">
              Nuestra Gran Universidad{" "}
            </p>
            <p className="font-bold text-primary-foreground/70">
              Producto realizado con el apoyo del programa PAPIME PE405625
            </p>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-bold mb-3 text-primary-foreground">Contacto</h4>

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

          <h4 className="font-bold mb-2 text-primary-foreground">
            Términos y Condiciones
          </h4>
          <div className="flex flex-wrap gap-3 text-xs text-primary-foreground/70">
            <a
              href="#"
              className="hover:text-primary-foreground text-primary-foreground/70"
            >
              Aviso de Privacidad
            </a>
            <span className="text-primary-foreground/70">•</span>
            <a
              href="#"
              className="hover:text-primary-foreground text-primary-foreground/70"
            >
              Términos de Uso
            </a>
            <span className="text-primary-foreground/70">•</span>
            <a
              href="#"
              className="hover:text-primary-foreground text-primary-foreground/70"
            >
              Reglamentos
            </a>
            <span className="text-primary-foreground/70">•</span>
            <a
              href="#"
              className="hover:text-primary-foreground text-primary-foreground/70"
            >
              Mapa del Sitio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
