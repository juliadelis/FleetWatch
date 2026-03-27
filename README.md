# FleetWatch

Aplicação frontend para gerenciamento de veículos, com funcionalidades de listagem, criação, edição, visualização e exclusão.

---

## Tecnologias utilizadas

- React / Next.js (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui
- TanStack React Query
- React Hook Form
- Zod
- Sonner (toasts)
- Vitest

---

## Como rodar o projeto

### 1. Clone o repositório

git clone <https://github.com/juliadelis/FleetWatch/>
cd <frontend>

### 2. Importante saber

O projeto esté configurado no Node 22

---

### 3. Instale as dependências

npm install

---

### 4. Rode o projeto

npm run dev

A aplicação estará disponível em:

http://localhost:3000

---

## Decisões técnicas

### 1. Separação entre `NewVehicle` e `Vehicle`

Foi criada uma distinção entre:

- `NewVehicle`: dados vindos do formulário
- `Vehicle`: entidade existente (com `id`, `createdAt`, `status`)

> Isso simula melhor um cenário real de backend e evita inconsistências de tipagem.

---

### 2. Uso de React Query para dados assíncronos

A listagem e mutações utilizam **React Query**, permitindo:

- cache automático
- invalidação de dados após mutations
- melhor controle de loading e erro

queryClient.invalidateQueries({ queryKey: ["vehicles"] });

---

### 3. Mock de backend em memória

Foi implementado um `vehicle-store.ts` simulando um backend:

- `listVehicles`
- `createVehicle`
- `updateVehicle`
- `deleteVehicle`

> Isso permite simular CRUD completo.

---

### 4. Formulários com React Hook Form + Zod

- validação centralizada no schema (`zod`)
- mensagens de erro inline
- integração com TypeScript

---

### 5. Reutilização do modal para criação e edição

O mesmo componente de dialog foi reaproveitado para:

- criar veículo
- editar veículo

> Reduz duplicação e mantém consistência de UX.

---

### 6. Controle de estado via URL (filtros)

Filtros de busca utilizam query params:

?placa=ABC&status=ativo

> Benefícios:

- estado compartilhável via URL
- navegação previsível
- melhor experiência do usuário

---

### 7. Uso do Sonner para feedback

Substituição do toast antigo por **Sonner**, que oferece:

- melhor UX
- API mais simples
- menor boilerplate

---

### 8. Prevenção de comportamento inesperado no Dialog

Foi utilizado:

onCloseAutoFocus={(e) => e.preventDefault()}

> Para evitar que a tela “role” ao fechar o modal.

---

### 9. Responsividade Mobile

A interface foi construída utilizando TailwindCSS com abordagem mobile-first, garantindo compatibilidade com diferentes tamanhos de tela.

---

### 10. Uso de useDebounce na busca

A busca por veículos utiliza um hook customizado de debounce para controlar o input do usuário antes de atualizar os parâmetros da URL.

> Isso evita atualizações excessivas no router e melhora a performance geral.

---

### 11. Uso de Vitest

Testes unitários do schema do veículo e testes unitários de validação das mensagens de erro.

> Isso garante comportamento ideal dos componentes.

---

## O que eu faria diferente com mais tempo

### 1. Integração com backend real

- API REST ou GraphQL
- persistência real de dados
- autenticação

---

### 2. Paginação server-side

Atualmente a paginação é feita no frontend.

Melhoria:

- paginação via API
- melhor performance para grandes volumes

---

### 3. Validações mais avançadas

- validação de placa única
- validação real de RENAVAM (com dígito verificador)
- feedback assíncrono

---

### 4. Melhorias de UX/UI

- animações de entrada/saída
- feedback visual mais rico

---

### 6. Componentização e design system

- extrair componentes reutilizáveis (inputs, selects)
- padronizar tokens de design
- extrair a lógica da tabela para um hook

---

### 7. Acessibilidade (a11y)

- navegação por teclado
- aria-labels mais completos
- foco controlado nos dialogs

---

## Considerações finais

O projeto foi estruturado com foco em:

- escalabilidade
- separação de responsabilidades
- experiência do usuário
- proximidade com cenários reais de produção

---

Obrigada
