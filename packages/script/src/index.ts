import { bootstrap } from './bootstrap';

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap, false);
  } else {
    bootstrap();
  }
}
