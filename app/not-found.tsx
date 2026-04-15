type ErrorStateProps = {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function ErrorState({
  title = "Ocurrió un error inesperado",
  message = "No se pudo completar la operación. Intentá nuevamente en unos instantes.",
  actionLabel = "Reintentar",
  onAction,
}: ErrorStateProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6">
      <section className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:p-10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
        </div>

        <div className="mt-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {title}
          </h1>

          <p className="mt-3 text-sm leading-6 text-neutral-400 sm:text-base">
            {message}
          </p>
        </div>

        {onAction && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white px-5 py-2.5 text-sm font-medium text-neutral-950 transition hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              {actionLabel}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
