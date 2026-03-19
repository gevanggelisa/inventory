## Inventory Management System (Frontend Only)
### Overview

This project is a frontend-only Inventory Management System built using modern web technologies. It simulates real-world inventory workflows including stock management, approval processes, and data visualization.

The application mimics a real backend using mock APIs and provides a responsive, interactive UI.

### Tech Stack

- Framework: Next.js (App Router)
- Language: TypeScript
- State Management: Zustand
- Data Fetching: TanStack React Query
- Mock API: MSW (Mock Service Worker)
- Styling: Tailwind CSS + shadcn/ui
- Charts: Recharts
- Date Handling: Moment.js

### How to Run the Project
1. Install dependencies
yarn install
2. Run development server
yarn dev
3. Open in browser
http://localhost:3000

### Architectural Decisions
1. Separation of Concerns
   - UI Layer: Components (Table, Dialog, Chart)
   - State Layer: Zustand (global state management)
   - Data Layer: MSW + localStorage (mock backend simulation)

2. Mock API using MSW
   - MSW is used to simulate real API behavior.
   - All CRUD operations are asynchronous to mimic real network calls.
   - Data is persisted using localStorage.
     
3. State Management Strategy
   - Zustand is used for global UI + business state (inventory, stock, modal state).
   - React Query is used for async handling and caching behavior.

4. Data Modeling
   - Two main entities:
     - Inventory: Represents live (approved) data
     - Stock: Represents pending changes (add, update, delete)
   - This separation allows implementation of an approval workflow.

5. Approval Workflow Design
   - Staff actions (Add, Edit, Delete) do NOT directly update inventory.
   - Instead, they create pending stock records:
     - status: pending
     - action: add | update | delete
   - Officer actions:
     - Approve: commit changes to inventory
     - Reject: discard changes
       
6. Assumptions Made
   - Only latest stock entry can be edited/deleted.
   - Validation is handled on frontend only.
   - IDs are generated using incremental logic.
   - Historical stock data is either mocked or derived from stock records.
     
7. Folder structure
   ```bash
   | app -> page / routing and layout
   | components
     | custom -> custom component
     | ui -> component generate using shadcn/ui
   | lib -> utilities
   | modules
   | msw -> endpoint api
     | data -> static / mock data
     | storage -> handling data on localstorage
   | providers -> React Query provider component that also sets up MSW (Mock Service Worker) for API mocking
   | store -> state management and function storing
   | types
       
   ```
