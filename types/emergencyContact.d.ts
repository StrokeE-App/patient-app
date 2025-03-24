export interface PatientDetails {
	patientId: string;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	conditions: string[];
	medications: string[];
	emergencyContactId: string;
}

export interface EmergencyContact {
	userId: string;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	patientDetails: PatientDetails[];
}

export interface Patient {
	id: string;
	name: string;
	relationship: string;
	conditions: string[];
	medications: string[];
	phoneNumber: string;
	email: string;
	emergencyContactId: string;
}
