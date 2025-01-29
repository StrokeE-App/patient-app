'use client';

import { EmergencyInfo } from "@/types";


export default function EmergencyInfoComponent({ 
  emergencyId,
  userName,
  userPhone,
  userAge,
  userAddress,
  userWeight,
  userHeight,
  emergencyLocation,
  strokeLevel = "...",
  emergencyTime
}: EmergencyInfo) {
  const readableString = emergencyTime ? emergencyTime.toLocaleString() : "Ahorita"
  return (
    <div className="w-11/12 mx-auto p-6 ">
      <div className="text-center space-y-6">
        <div className="pb-4">
          <h1 className="text-2xl font-bold inline-block px-4 pb-1">
            {userName}
          </h1>
        </div>
        
        <div className="grid grid-cols-2 gap-x-6 gap-y-6">
          <div>
            <h2 className="text-custom-black font-bold text-sm">Teléfono</h2>
            <p className="text-custom-black font-medium">{userPhone}</p>
          </div>
          <div>
            <h2 className="text-custom-black text-sm font-bold">Edad</h2>
            <p className="text-custom-black font-medium">{userAge} años</p>
          </div>
          <div>
            <h2 className="text-custom-black text-sm font-bold">Peso</h2>
            <p className="text-custom-black font-medium">{userWeight} kg</p>
          </div>
          <div>
            <h2 className="text-custom-black text-sm font-bold">Estatura</h2>
            <p className="text-custom-black font-medium">{userHeight} m</p>
          </div>
          <div>
            <h2 className="text-custom-black text-sm font-bold">Nivel De Stroke</h2>
            <p className="text-custom-black font-medium">{strokeLevel}</p>
          </div>
          <div>
            <h2 className="text-custom-black text-sm font-bold whitespace-wrap">
              Tiempo desde que inició la emergencia
            </h2>
            <p className="text-custom-black font-medium">{readableString}</p>
          </div>
        </div>
      </div>
    </div>
  );
}