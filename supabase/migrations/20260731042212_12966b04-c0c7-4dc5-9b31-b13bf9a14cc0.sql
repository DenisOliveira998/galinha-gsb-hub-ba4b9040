CREATE TABLE public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_key text NOT NULL,
  post_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (owner_key, post_id)
);

CREATE INDEX favorites_owner_key_idx ON public.favorites (owner_key);

GRANT SELECT, INSERT, DELETE ON public.favorites TO anon;
GRANT SELECT, INSERT, DELETE ON public.favorites TO authenticated;
GRANT ALL ON public.favorites TO service_role;

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- O app não tem login real; a "identidade" é uma chave aleatória (UUID) guardada
-- no navegador do visitante. Sem essa chave não é possível ler ou apagar a lista,
-- pois toda consulta precisa filtrar por owner_key (imposto abaixo).
CREATE POLICY "Favoritos visíveis por chave do dono"
  ON public.favorites FOR SELECT
  USING (owner_key = current_setting('request.headers', true)::json ->> 'x-owner-key');

CREATE POLICY "Inserir favoritos com a chave do dono"
  ON public.favorites FOR INSERT
  WITH CHECK (owner_key = current_setting('request.headers', true)::json ->> 'x-owner-key');

CREATE POLICY "Remover favoritos com a chave do dono"
  ON public.favorites FOR DELETE
  USING (owner_key = current_setting('request.headers', true)::json ->> 'x-owner-key');