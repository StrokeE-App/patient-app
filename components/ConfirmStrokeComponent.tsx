"use client";

import React, { useState } from "react";
import Button from "./Button";
import ConfirmModal from "./ConfirmModal";

export type ConfirmStrokeComponentProps = {
  emergencyId: string;
};

export default function ConfirmStrokeComponent({ emergencyId }: ConfirmStrokeComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState(""); // Estado para el título dinámico
  const [actionType, setActionType] = useState(""); // Estado para el tipo de acción

  const handleConfirm = () => {
    if (actionType === "confirm") {
      console.log(`Emergency ${emergencyId} confirmed`);
    } else if (actionType === "discard") {
      console.log(`Emergency ${emergencyId} discarded`);
    }
    setIsModalOpen(false);
  };

  const openModal = (title: string, action: string) => {
    setModalTitle(title); // Establece el título dinámico
    setActionType(action); // Establece el tipo de acción
    setIsModalOpen(true); // Abre el modal
  };
  return (
    <div className="w-10/12 max-w-md mx-auto flex flex-col space-y-4 mb-5">
      <Button
        title="Confirmar Stroke"
        onClick={() => openModal("¿Estás seguro que quieres confirmar el stroke?", "confirm")}
        color="red"
      />
      <Button
        title="Descartar Stroke"
        onClick={() => openModal("¿Estás seguro que quieres descartar el stroke?", "discard")}
        color="green"
      />
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        title={modalTitle} // Pasamos el título dinámico
      />
    </div>
  );
}

