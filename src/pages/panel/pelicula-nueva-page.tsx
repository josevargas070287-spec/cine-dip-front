import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from '@/components/common/container';
import { peliculaService } from '@/services/pelicula.service';
import type { CrearPelicula } from '@/types/pelicula';

const MAX_IMAGENES = 5;
const MAX_BYTES = 5 * 1024 * 1024;
const EXTENSIONES_PERMITIDAS = ['.jpg', '.jpeg', '.png', '.webp'];

function validarArchivos(archivos: File[]): string | null {
  if (archivos.length === 0) {
    return 'Debes seleccionar por lo menos una imagen de la película.';
  }

  if (archivos.length > MAX_IMAGENES) {
    return 'Puedes seleccionar como máximo 5 imágenes.';
  }

  for (const archivo of archivos) {
    const nombre = archivo.name.toLowerCase();

    const extensionValida = EXTENSIONES_PERMITIDAS.some(
      (extension) => nombre.endsWith(extension),
    );

    if (!extensionValida) {
      return `El archivo "${archivo.name}" no es válido. Usa JPG, JPEG, PNG o WEBP.`;
    }

    if (archivo.size === 0) {
      return `El archivo "${archivo.name}" está vacío. Selecciona otra imagen.`;
    }

    if (archivo.size > MAX_BYTES) {
      return `La imagen "${archivo.name}" supera el límite de 5 MiB.`;
    }
  }

  return null;
}

export function PeliculaNuevaPage() {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState('');
  const [sinopsis, setSinopsis] = useState('');
  const [duracionMinutos, setDuracionMinutos] = useState('');
  const [fechaEstreno, setFechaEstreno] = useState('');
  const [activo, setActivo] = useState(true);
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [vistasPrevias, setVistasPrevias] = useState<string[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urls = imagenes.map((archivo) => URL.createObjectURL(archivo));
    setVistasPrevias(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagenes]);

  function seleccionarImagenes(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const archivos = Array.from(input.files ?? []);
    const errorArchivos = validarArchivos(archivos);

    if (errorArchivos) {
      setError(errorArchivos);
      input.value = '';
      return;
    }

    setError(null);
    setImagenes(archivos);
  }

  async function registrarPelicula(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const duracion = Number(duracionMinutos);

    // Validar título
    if (!titulo.trim()) {
      setError('El título de la película es obligatorio.');
      return;
    }

    // Validar sinopsis
    if (!sinopsis.trim()) {
      setError('La sinopsis de la película es obligatoria.');
      return;
    }

    // Validar duración
    if (
      !duracionMinutos.trim() ||
      !Number.isInteger(duracion) ||
      duracion <= 0
    ) {
      setError('La duración debe ser un número entero mayor que cero.');
      return;
    }

    // Validar fecha
    if (
      !fechaEstreno ||
      !/^\d{4}-\d{2}-\d{2}$/.test(fechaEstreno) ||
      Number.isNaN(Date.parse(`${fechaEstreno}T00:00:00`))
    ) {
      setError('Debes seleccionar una fecha de estreno válida.');
      return;
    }

    // Validar que exista por lo menos una imagen
    const errorArchivos = validarArchivos(imagenes);

    if (errorArchivos) {
      setError(errorArchivos);
      return;
    }

    const pelicula: CrearPelicula = {
      titulo: titulo.trim(),
      sinopsis: sinopsis.trim(),
      duracionMinutos: duracion,
      fechaEstreno,
      activo,
    };

    try {
      setEnviando(true);
      await peliculaService.crear(pelicula, imagenes);
      // El listado público de películas está en /peliculas.
      navigate('/panel/peliculas', { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo registrar la película.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Container>
      <div className="mx-auto max-w-3xl space-y-6 py-8">
        <div>
          <Link to="/panel/peliculas" className="text-sm text-primary hover:underline">
            ← Volver a películas
          </Link>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">
            Registrar película
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Completa los datos y selecciona hasta cinco imágenes.
          </p>
        </div>

        <form
          onSubmit={registrarPelicula}
          className="space-y-5 rounded-xl border border-border bg-card p-5"
        >
          <div className="space-y-2">
            <label htmlFor="titulo" className="block text-sm font-medium">
              Título *
            </label>
            <input
              id="titulo"
              name="titulo"
              value={titulo}
              onChange={(event) => setTitulo(event.target.value)}
              required
              maxLength={200}
              className="w-full rounded-lg border border-border bg-background px-3 py-2"
              placeholder="Ej. Interestelar"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="sinopsis" className="block text-sm font-medium">
              Sinopsis *
            </label>
            <textarea
              id="sinopsis"
              name="sinopsis"
              value={sinopsis}
              onChange={(event) => setSinopsis(event.target.value)}
              required
              rows={4}
              className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2"
              placeholder="Describe brevemente la película"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="duracionMinutos" className="block text-sm font-medium">
                Duración (minutos) *
              </label>
              <input
                id="duracionMinutos"
                name="duracionMinutos"
                type="number"
                min={1}
                step={1}
                required
                value={duracionMinutos}
                onChange={(event) => setDuracionMinutos(event.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
                placeholder="169"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="fechaEstreno" className="block text-sm font-medium">
                Fecha de estreno *
              </label>
              <input
                id="fechaEstreno"
                name="fechaEstreno"
                type="date"
                required
                value={fechaEstreno}
                onChange={(event) => setFechaEstreno(event.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="activo"
              name="activo"
              type="checkbox"
              checked={activo}
              onChange={(event) => setActivo(event.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="activo" className="text-sm font-medium">
              Película activa
            </label>
          </div>

          <div className="space-y-2">
            <label htmlFor="imagenes" className="block text-sm font-medium">
              Imágenes (máximo 5, 5 MiB cada una)
            </label>
            <input
              id="imagenes"
              name="imagenes"
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              multiple
              onChange={seleccionarImagenes}
              className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Formatos permitidos: JPG, JPEG, PNG y WEBP.
            </p>
          </div>

          {vistasPrevias.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-medium">Vista previa</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {vistasPrevias.map((url, indice) => (
                  <div key={url} className="space-y-1">
                    <img
                      src={url}
                      alt={`Vista previa ${indice + 1}`}
                      className="aspect-[2/3] w-full rounded-lg border border-border object-cover"
                    />
                    <p className="break-all text-xs text-muted-foreground">
                      {imagenes[indice]?.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800"
            >
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={enviando}
              className="rounded-lg bg-primary px-5 py-2 font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
            >
              {enviando ? 'Registrando...' : 'Registrar película'}
            </button>
            <Link
              to="/peliculas"
              className="rounded-lg border border-border px-5 py-2 text-sm font-medium hover:bg-muted"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </Container>
  );
}
