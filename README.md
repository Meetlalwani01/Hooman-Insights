````markdown
## Getting Started

Follow these steps to set up and run the Hooman Insights Dashboard locally.

### Prerequisites

- **Node.js** v16 or higher  
- **npm** v8 or higher  

Check your versions:

```bash
node -v   # e.g. v18.16.0
npm -v    # e.g. 8.19.2
````

---

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/hooman-insights.git
   cd hooman-insights
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

---

### Development

Start the development server with hot-reload:

```bash
npm run dev
```

* Open your browser at:

  ```
  http://localhost:3000
  ```
* The mock data API is available at:

  ```
  http://localhost:3000/api/conversations
  ```

---

### Production Build

Build and serve the optimized production bundle:

```bash
npm run build
npm start
```

* The dashboard will run at:

  ```
  http://localhost:3000
  ```

```
```
