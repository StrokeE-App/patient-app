import {useRouter} from 'next/navigation';

interface EmergencyCardProps {
	userName: string;
	userPhone: string;
	emergencyId: string;
}

export default function EmergencyCard({userName, userPhone, emergencyId}: EmergencyCardProps) {
	const router = useRouter();

	const handleClick = () => {
		router.push(`/emergency/${emergencyId}`);
	};

	return (
		<>
			<div onClick={handleClick} className="border-b border-red-200 py-4 w-full max-w-80 cursor-pointer">
				<p className="text-center text-customRed font-medium">{userName}</p>
				<p className="text-center text-customRed">+57 {userPhone}</p>
			</div>
		</>
	);
}
