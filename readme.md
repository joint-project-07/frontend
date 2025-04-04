# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

```
frontend
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  └─ vite.svg
├─ readme.md
├─ src
│  ├─ App.css
│  ├─ App.tsx
│  ├─ assets
│  │  └─ react.svg
│  ├─ components
│  │  ├─ common
│  │  │  └─ common.jsx
│  │  ├─ feature
│  │  │  └─ feature.tsx
│  │  └─ layout
│  │     └─ layout.tsx
│  ├─ constasnts
│  │  └─ constants.tsx
│  ├─ hooks
│  │  └─ hooks.tsx
│  ├─ index.css
│  ├─ main.tsx
│  ├─ pages
│  │  └─ pages.tsx
│  ├─ service
│  │  └─ service.tsx
│  ├─ store
│  │  └─ store.tsx
│  ├─ style
│  │  └─ style.css
│  ├─ types
│  │  └─ custom.d.ts
│  ├─ utils
│  │  └─ utils.tsx
│  └─ vite-env.d.ts
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```
```
frontend
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  └─ vite.svg
├─ readme.md
├─ src
│  ├─ App.css
│  ├─ App.tsx
│  ├─ assets
│  │  ├─ logo.png
│  │  └─ react.svg
│  ├─ components
│  │  ├─ common
│  │  │  ├─ CardComponent.css
│  │  │  ├─ CardComponent.tsx
│  │  │  ├─ Footer.tsx
│  │  │  ├─ Header.tsx
│  │  │  └─ Modal.tsx
│  │  ├─ feature
│  │  │  └─ feature.tsx
│  │  └─ layout
│  │     └─ layout.tsx
│  ├─ constasnts
│  │  └─ constants.tsx
│  ├─ hooks
│  │  └─ useModal.ts
│  ├─ index.css
│  ├─ main.tsx
│  ├─ pages
│  │  └─ pages.tsx
│  ├─ service
│  │  └─ service.tsx
│  ├─ store
│  │  └─ store.tsx
│  ├─ style
│  │  ├─ Button.css
│  │  ├─ Footer.css
│  │  ├─ Header.css
│  │  ├─ Input.css
│  │  └─ Modal.css
│  ├─ types
│  │  └─ custom.d.ts
│  ├─ utils
│  │  └─ utils.tsx
│  └─ vite-env.d.ts
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```
```
frontend
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  └─ vite.svg
├─ readme.md
├─ src
│  ├─ App.css
│  ├─ App.tsx
│  ├─ assets
│  │  ├─ logo.png
│  │  └─ react.svg
│  ├─ components
│  │  ├─ common
│  │  │  ├─ Card.tsx
│  │  │  ├─ Footer.tsx
│  │  │  ├─ Header.tsx
│  │  │  ├─ LoginModal.tsx
│  │  │  └─ Modal.tsx
│  │  ├─ feature
│  │  │  └─ feature.tsx
│  │  └─ layout
│  │     └─ layout.tsx
│  ├─ contexts
│  │  └─ AuthContext.tsx
│  ├─ hooks
│  │  └─ useModal.ts
│  ├─ index.css
│  ├─ main.tsx
│  ├─ pages
│  │  ├─ LandingPage.tsx
│  │  ├─ Mypage.tsx
│  │  ├─ ShelterSignup.tsx
│  │  └─ UsersSignup.tsx
│  ├─ service
│  │  └─ service.tsx
│  ├─ store
│  │  └─ store.tsx
│  ├─ style
│  │  ├─ Button.css
│  │  ├─ Card.css
│  │  ├─ Footer.css
│  │  ├─ Header.css
│  │  ├─ Input.css
│  │  ├─ LoginModal.css
│  │  ├─ Modal.css
│  │  └─ Mypage.css
│  ├─ types
│  │  ├─ api
│  │  │  └─ user.ts
│  │  └─ custom.d.ts
│  ├─ utils
│  │  └─ utils.tsx
│  └─ vite-env.d.ts
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```