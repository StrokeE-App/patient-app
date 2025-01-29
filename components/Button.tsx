'use client'
//A button component that recieves a title, click event and a color


interface ButtonProps {
  title: string;
  onClick: () => void;
  color: string;
}

export default function Button({ title, onClick, color }: ButtonProps){
  const buttonColor = color === 'red' ? 'bg-customRed' : 'bg-customGreen';
  const textColor = color === 'red' ? 'text-customWhite' : 'text-customBlack';

  return (
    <button
      onClick={onClick}
      className={`${buttonColor} ${textColor} font-bold py-2 px-4 rounded w-full`}
    >
      {title}
    </button>
  );
};
