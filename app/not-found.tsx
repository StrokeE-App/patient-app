import Link from "next/link";
import {StrokeeLogo} from '@/components/StrokeeLogo';

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <StrokeeLogo/>
      <br />
      <h1 className="text-customRed text-4xl font-bold">
        Oops
      </h1>
      <h2 className="text-customRed text-2xl font-bold">
        404 - No fue posible encontrar esta pagina :(
      </h2>
      <p className="text-customRed">Regresa al Login para continuar navegando: <Link href="/login" className="underline decoration-1">Login</Link></p>
    </div>
  );
}
