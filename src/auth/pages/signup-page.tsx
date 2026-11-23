import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinners';
import { personaService } from '@/services/persona.service';
import { getSignupSchema, SignupSchemaType } from '../forms/signup-shema';

// Campos de texto simples. Las contrasenas van aparte por el boton de ver
const CAMPOS: {
  name: keyof SignupSchemaType;
  label: string;
  type?: string;
  placeholder?: string;
}[] = [
  { name: 'nombres', label: 'Nombres', placeholder: 'Sergio Luis' },
  { name: 'apellidos', label: 'Apellidos', placeholder: 'Pérez López' },
  { name: 'documento', label: 'Documento', placeholder: '12345678' },
  { name: 'telefono', label: 'Teléfono', type: 'tel', placeholder: '70123456' },
  { name: 'email', label: 'Correo', type: 'email', placeholder: 'ana@correo.com' },
  // type date entrega "1995-05-20", el formato que pide el backend
  { name: 'fechaNacimiento', label: 'Fecha de nacimiento', type: 'date' },
  { name: 'usuario', label: 'Usuario', placeholder: 'ana.perez' },
];

export function SignUpPage() {
  const navigate = useNavigate();

  const [verContrasena, setVerContrasena] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(getSignupSchema()),
    defaultValues: {
      nombres: '',
      apellidos: '',
      documento: '',
      telefono: '',
      email: '',
      fechaNacimiento: '',
      usuario: '',
      constrasena: '',
      confirmar: '',
    },
  });

  async function onSubmit(values: SignupSchemaType) {
    try {
      setProcesando(true);
      setError(null);

      // confirmar solo sirve aqui: el backend rechaza campos que no conoce.
      // Y nunca se manda "rol": el backend pone CLIENTE por defecto
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmar, ...datos } = values;


      const respuesta = await personaService.registrar(datos);


      alert(`Cuenta creada para ${respuesta.data.nombres}. Ya puedes ingresar.`);
      navigate('/auth/signin');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo crear la cuenta. Intenta de nuevo.',
      );
    } finally {
      setProcesando(false);
    }
  }


return (
  <div className="w-full">
    <div className="mx-auto w-full max-w-2xl space-y-7 rounded-2xl
      border border-white/10 bg-[#111318] p-5 text-white
      shadow-2xl shadow-black/30 sm:p-8">

      {/* Encabezado */}
      <div className="flex items-center gap-4 border-b
        border-white/10 pb-6">
        <div className="flex h-14 w-14 shrink-0 items-center
          justify-center rounded-2xl border border-amber-400/30
          bg-amber-400/10 text-amber-400">
          <span className="text-3xl">🎬</span>
        </div>
        <div>
          <p className="text-xl font-black tracking-[0.18em]">
            CINÉLUX
          </p>
          <p className="mt-1 text-xs tracking-[0.2em] text-gray-400">
            TU MUNDO DE CINE
          </p>
        </div>
      </div>

      {/* Título */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.2em]
          text-amber-400">
          Únete a nuestra comunidad
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          Crear cuenta
        </h1>
        <p className="text-sm leading-6 text-gray-400">
          Completa tus datos para registrarte como cliente
          y reservar tus butacas favoritas.
        </p>
      </div>

      {/* Error del servidor */}
      {error && (
        <Alert variant="destructive">
          <AlertIcon>
            <AlertCircle className="h-4 w-4" />
          </AlertIcon>
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Datos personales */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-amber-400" />
              <h2 className="font-semibold text-white">
                Datos personales
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {CAMPOS.filter((campo) =>
                ['nombres', 'apellidos', 'documento',
                 'telefono', 'email', 'fechaNacimiento']
                  .includes(campo.name)
              ).map((campo) => (
                <FormField
                  key={campo.name}
                  control={form.control}
                  name={campo.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">
                        {campo.label}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type={campo.type ?? 'text'}
                          placeholder={campo.placeholder}
                          disabled={procesando}
                          {...field}
                          className="h-11 border-white/10 bg-[#090b10]
                            text-white placeholder:text-gray-600
                            focus-visible:ring-amber-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          {/* Datos de acceso */}
          <div className="space-y-4 border-t border-white/10 pt-6">
            <div className="flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-amber-400" />
              <h2 className="font-semibold text-white">
                Datos de acceso
              </h2>
            </div>

            {CAMPOS.filter((campo) =>
              campo.name === 'usuario'
            ).map((campo) => (
              <FormField
                key={campo.name}
                control={form.control}
                name={campo.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">
                      {campo.label}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        autoComplete="username"
                        placeholder={campo.placeholder}
                        disabled={procesando}
                        {...field}
                        className="h-11 border-white/10 bg-[#090b10]
                          text-white placeholder:text-gray-600
                          focus-visible:ring-amber-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <FormField
              control={form.control}
              name="constrasena"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">
                    Contraseña
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={verContrasena ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Mínimo 6 caracteres"
                        disabled={procesando}
                        {...field}
                        className="h-11 border-white/10 bg-[#090b10]
                          pr-11 text-white placeholder:text-gray-600
                          focus-visible:ring-amber-400"
                      />
                      <button
                        type="button"
                        onClick={() => setVerContrasena((v) => !v)}
                        className="absolute right-3 top-1/2
                          -translate-y-1/2 text-gray-400
                          transition hover:text-amber-400"
                        aria-label={verContrasena
                          ? 'Ocultar contraseña'
                          : 'Mostrar contraseña'}
                      >
                        {verContrasena
                          ? <EyeOff className="h-4 w-4" />
                          : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">
                    Repite la contraseña
                  </FormLabel>
                  <FormControl>
                    <Input
                      type={verContrasena ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Vuelve a escribir tu contraseña"
                      disabled={procesando}
                      {...field}
                      className="h-11 border-white/10 bg-[#090b10]
                        text-white placeholder:text-gray-600
                        focus-visible:ring-amber-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Botón */}
          <Button
            type="submit"
            disabled={procesando}
            className="h-12 w-full bg-amber-400 font-bold
              text-black transition hover:bg-amber-300
              disabled:opacity-60"
          >
            {procesando && (
              <Spinner className="me-2 h-4 w-4 animate-spin" />
            )}
            {procesando ? 'Creando cuenta…' : 'Crear cuenta de cliente →'}
          </Button>

          <p className="text-center text-xs leading-5 text-gray-500">
            Tus datos se utilizarán para gestionar tu cuenta
            y tus reservas en CINÉLUX.
          </p>
        </form>
      </Form>

      {/* Enlace al login */}
      <div className="border-t border-white/10 pt-5 text-center">
        <p className="text-sm text-gray-400">
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/auth/signin"
            className="font-semibold text-amber-400
              transition hover:text-amber-300 hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  </div>
);

}
