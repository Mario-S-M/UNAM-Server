import { FormLogin } from "./components/form-login";

const LoginPage = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="hidden md:flex md:w-1/2 bg-primary items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-3xl font-bold">Bienvenido</h2>
          <p className="mt-2">Ingresa tus credenciales para acceder a tu cuenta.</p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-4">
        <div className="p-8 rounded-md w-full max-w-md border-3 border-gray-400">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold mb-2 text-content">Iniciar Sesión</h1>
          </div>
          <FormLogin />
          
        </div>
      </div>
    </div>
  );
};

export default LoginPage;