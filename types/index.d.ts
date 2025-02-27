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
};
