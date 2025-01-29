'use client';

// Mocks
import {emergenciesList} from '@/mocks/emergency';

// Components
import EmergencyCard from '@/components/EmergencyCard';
import SettingsMenu from '@/components/SettingsMenu';

export default function Dashboard() {
	return (
		<main className="min-h-screen bg-white p-4">
			{/* Header */}
			<SettingsMenu />

			{/* Main Content */}
			<div className="mt-12 px-4 flex flex-col items-center w-full">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">En proceso</h1>

				{/* Patient Information */}
				{emergenciesList.map((emergency) => (
					<EmergencyCard key={emergency.emergencyId} userName={emergency.userName} userPhone={emergency.userPhone} emergencyId={emergency.emergencyId} />
				))}
			</div>
		</main>
	);
}
