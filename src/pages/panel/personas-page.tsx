
import { useEffect, useState } from 'react';
import { Container } from '@/components/common/container';
import { personaService } from '@/services/persona.service';
import type { Persona } from '@/types/persona';

export function PersonasPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Valores escritos en los campos.
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');

  // Filtros aplicados al pulsar Buscar.
  const [filtros, setFiltros] = useState({
    nombres: '',
    apellidos: '',
  });

  useEffect(() => {
    let cancelado = false;

    async function cargarPersonas() {
      setCargando(true);
      setError(null);

      try {
        const respuesta =
          filtros.nombres || filtros.apellidos
            ? await personaService.buscar(
                filtros.nombres,
                filtros.apellidos,
                pagina,
                10,
              )
            : await personaService.listar(pagina, 10);

        if (!cancelado) {
          setPersonas(respuesta.data);
          setTotalPaginas(
            Math.max(1, respuesta.totalPaginas),
          );
        }
      } catch (e) {
        if (!cancelado) {
          setError(
            e instanceof Error
              ? e.message
              : 'Ocurrió un error al cargar las personas.',
          );
        }
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    }

    void cargarPersonas();

    return () => {
      cancelado = true;
    };
  }, [pagina, filtros.nombres, filtros.apellidos]);

  function buscarPersonas(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    setPagina(1);
    setFiltros({
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
    });
  }

  function limpiarBusqueda() {
    setNombres('');
    setApellidos('');
    setPagina(1);
    setFiltros({
      nombres: '',
      apellidos: '',
    });
  }

  return (
    <Container>
      <div className="space-y-6 py-8">
        <div>
          <h1 className="text-2xl font-semibold">
            Listado de personas
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Consulta y busca personas registradas en el sistema.
          </p>
        </div>

        <form
          onSubmit={buscarPersonas}
          className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2"
        >
          <div>
            <label
              htmlFor="nombres"
              className="mb-2 block text-sm font-medium"
            >
              Nombres
            </label>

            <input
              id="nombres"
              type="text"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              placeholder="Ej. Ana María"
              className="w-full rounded-md border bg-background px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="apellidos"
              className="mb-2 block text-sm font-medium"
            >
              Apellidos
            </label>

            <input
              id="apellidos"
              type="text"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              placeholder="Ej. Pérez López"
              className="w-full rounded-md border bg-background px-3 py-2"
            />
          </div>

          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
            >
              Buscar
            </button>

            <button
              type="button"
              onClick={limpiarBusqueda}
              className="rounded-md border px-4 py-2"
            >
              Limpiar
            </button>
          </div>
        </form>

        {cargando ? (
          <div className="rounded-lg border p-6">
            <p>Cargando personas...</p>
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-lg border border-destructive p-6"
          >
            <p className="font-medium">
              No se pudieron cargar las personas.
            </p>
            <p className="mt-2 text-sm">{error}</p>

            <button
              type="button"
              onClick={() => setPagina((p) => p)}
              className="mt-3 rounded-md border px-4 py-2"
            >
              Volver a intentar
            </button>
          </div>
        ) : personas.length === 0 ? (
          <div className="rounded-lg border p-6">
            <p className="font-medium">Sin resultados</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {filtros.nombres || filtros.apellidos
                ? 'No se encontraron personas con los filtros indicados.'
                : 'Todavía no hay personas registradas.'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Nombres</th>
                    <th className="p-3">Apellidos</th>
                    <th className="p-3">Documento</th>
                    <th className="p-3">Teléfono</th>
                    <th className="p-3">Correo</th>
                    <th className="p-3">Fecha de nacimiento</th>
                  </tr>
                </thead>

                <tbody>
                  {personas.map((persona) => (
                    <tr
                      key={persona.id}
                      className="border-t"
                    >
                      <td className="p-3">{persona.id}</td>
                      <td className="p-3">{persona.nombres}</td>
                      <td className="p-3">{persona.apellidos}</td>
                      <td className="p-3">{persona.documento}</td>
                      <td className="p-3">{persona.telefono}</td>
                      <td className="p-3">{persona.email}</td>
                      <td className="p-3">
                        {new Date(
                          persona.fechaNacimiento,
                        ).toLocaleDateString('es-BO', {
                          timeZone: 'UTC',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Página {pagina} de {totalPaginas}
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={pagina <= 1}
                  onClick={() =>
                    setPagina((p) => Math.max(1, p - 1))
                  }
                  className="rounded-md border px-4 py-2 disabled:opacity-50"
                >
                  Anterior
                </button>

                <button
                  type="button"
                  disabled={pagina >= totalPaginas}
                  onClick={() =>
                    setPagina((p) =>
                      Math.min(totalPaginas, p + 1),
                    )
                  }
                  className="rounded-md border px-4 py-2 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
