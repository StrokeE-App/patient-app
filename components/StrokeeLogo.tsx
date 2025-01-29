import {Siren} from 'lucide-react';

export function StrokeeLogo() {
	return (
		<div className="flex flex-col items-center gap-2">
			<Siren size={64} color="#d63a3a" />
			<h1 className="text-red-600 text-2xl font-bold tracking-wider">STROKEE</h1>
		</div>
	);
}
