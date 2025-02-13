import {EmergencyContact, EmergencyInfo} from '@/types';

const emergency1: EmergencyInfo = {
	emergencyId: '123',
	userName: 'Juan Perez',
	userPhone: '1234567890',
	userAge: 30,
	userAddress: 'Calle 123',
	userWeight: 77.5,
	userHeight: 170.5,
	emergencyTime: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
	emergencyLocation: {latitude: 3.467754, longitude: -76.483429},
};

const emergency2: EmergencyInfo = {
	emergencyId: '456',
	userName: 'María López',
	userPhone: '3209876543',
	userAge: 45,
	userAddress: 'Carrera 45 #67-89',
	userWeight: 65.2,
	userHeight: 165.0,
	emergencyTime: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
	emergencyLocation: {latitude: 3.467754, longitude: -76.483429},
};

const emergency3: EmergencyInfo = {
	emergencyId: '789',
	userName: 'Carlos Rodríguez',
	userPhone: '3115554433',
	userAge: 52,
	userAddress: 'Avenida 78 #12-34',
	userWeight: 82.3,
	userHeight: 178.0,
	emergencyTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
	emergencyLocation: {latitude: 3.467754, longitude: -76.483429},
};

const emergenciesList: EmergencyInfo[] = [emergency1, emergency2, emergency3];

const emergencyContactsList: EmergencyContact[] = [
	{
		id: 1,
		name: 'Pepito Pérez',
		phone: '+57 123 456 7890',
		relationship: 'Padre',
		email: 'pepito@gmail.com',
	},
	{
		id: 2,
		name: 'María García Londoño Lopez',
		phone: '+57 321 654 0987',
		relationship: 'Madre',
		email: 'maria@gmail.com',
	},
	{
		id: 3,
		name: 'Juanito López Hernando',
		phone: '+57 987 654 3210',
		relationship: 'Hermano',
		email: 'juanito@gmail.com',
	},
	{
		id: 4,
		name: 'Carlos Rodríguez',
		phone: '+57 311 555 4433',
		relationship: 'Tío',
		email: 'carlos@gmail.com',
	},
];

export {emergency1, emergency2, emergency3, emergenciesList, emergencyContactsList};
