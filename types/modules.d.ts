/* Fallback ambient module declarations for third-party libs that
   already ship their own typings.  These are only consulted if the
   compiler cannot find the real declaration files (for example, some
   IDEs with stale caches).  They re-export the actual package types so
   the correct typings are still used at compile time. */

declare module 'lucide-react' {
  import * as LR from 'lucide-react/types/index';
  export = LR;
}

declare module 'xlsx' {
  import * as XLSX from 'xlsx/types';
  export = XLSX;
}

declare module '@clerk/nextjs' {
  import * as Clerk from '@clerk/nextjs/dist/types';
  export = Clerk;
}

declare module 'firebase/app' {
  export * from 'firebase';
}

declare module 'firebase/auth' {
  export * from 'firebase/auth';
}

declare module 'firebase/firestore' {
  export * from 'firebase/firestore';
}