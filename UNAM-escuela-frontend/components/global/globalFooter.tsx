import { Facebook, Twitter, Instagram } from "lucide-react";
import GlobalLogoUNAM from "./globalLogoUNAM";

export default function Footer() {
  return (
    <footer
      className="text-white py-8 px-6 bg-primary"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="flex-1">
          <GlobalLogoUNAM />

          <p className="text-blue-100 text-sm mb-3">
            Nuestra Gran Universidad Nacional Autónoma de México es una
            institución pública dedicada a la educación, investigación y
            difusión de la cultura.
          </p>
          <div className="text-xs text-blue-200 space-y-2">
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
            <ul className="space-y-1 text-sm text-blue-100">
              {[
                "Ingles A1",
                "Ingles A2",
                "Ingles B1",
                "Ingles B2",
                "Ingles C1",
                "Ingles C2",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-bold mb-3">Contacto</h4>

          <div className="text-sm text-blue-100 mb-4">
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
                className="bg-blue-800 bg-opacity-40 p-2 rounded-full hover:bg-blue-600 transition-all duration-300"
              >
                <Icon size={16} className="text-white" />
              </a>
            ))}
          </div>

          <button className="w-full bg-blue-500 text-white py-2 px-4 rounded font-medium text-sm hover:bg-blue-600 transition-all duration-200 mb-4">
            Solicita información
          </button>

          <h4 className="font-bold mb-2">Términos y Condiciones</h4>
          <div className="flex flex-wrap gap-3 text-xs text-blue-200">
            <a href="#" className="hover:text-white">
              Aviso de Privacidad
            </a>
            <span>•</span>
            <a href="#" className="hover:text-white">
              Términos de Uso
            </a>
            <span>•</span>
            <a href="#" className="hover:text-white">
              Reglamentos
            </a>
            <span>•</span>
            <a href="#" className="hover:text-white">
              Mapa del Sitio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
