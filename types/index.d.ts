export type EmergencyInfo = {
	emergencyId: string;
	userName: string;
	userPhone: string;
	userAge: number;
	userAddress: string;
	userWeight: double;
	userHeight: double;
	emergencyTime: Date;
	strokeLevel?: string;
	emergencyLocation: {latitude: double; longitude: double};
};

export type EmergencyContact = {
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	relationship: string;
	emergencyContactId: number;
	canActivateEmergency: boolean;
};

export type EditPatientData = {
	firstName: string;
	lastName: string;
	phoneNumber: string;
	age: number | string;
	birthDate: string;
	weight: number | string;
	height: number | string;
	medications: string[];
	conditions: string[];
};

export interface MongoDBUserData {
	patientId: string;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	age: number;
	birthDate: string;
	weight: number;
	height: number;
	medications: string[];
	conditions: string[];
}
