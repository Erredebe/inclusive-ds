import '@inclusiv-ds/tokens/src/tokens.css';
import { defineCustomElements as defineButton } from '@inclusiv-ds/button/loader';
import { defineCustomElements as defineInput } from '@inclusiv-ds/input/loader';

defineButton();
defineInput();

const style = document.createElement('style');
style.textContent = `
  :root {
    font-family: Inter, Segoe UI, Arial, sans-serif;
  }

  body {
    margin: 0;
    background: #f5faf9;
    color: #0b1f1d;
  }

  .layout {
    max-width: 980px;
    margin: 0 auto;
    padding: 24px;
    display: grid;
    gap: 16px;
  }

  .card {
    background: #fff;
    border: 1px solid #d9ece8;
    border-radius: 12px;
    padding: 16px;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
  }

  .col {
    display: grid;
    gap: 12px;
    max-width: 380px;
  }
`;
document.head.appendChild(style);
